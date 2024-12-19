"use server";

import { z } from "zod";
import base64 from 'base-64';

const SubredditSearchSchema = z.object({
  data: z.object({
    children: z.array(
      z.object({
        data: z.object({
          display_name: z.string(),
          subscribers: z.number().nullable().default(0),
          subreddit_type: z.string(),
        }),
      })
    ),
    after: z.string().nullable(),
    before: z.string().nullable(),
  }),
});

const SubredditSchema = z.object({
  data: z.object({
    active_user_count: z.number().nullable(),
    display_name: z.string(),
    subscribers: z.number().nullable().default(0),
  }),
});

// Remove global token storage
async function getAccessToken(): Promise<string> {
  const clientId = process.env.NEXT_PUBLIC_CLIENT_ID;
  const clientSecret = process.env.NEXT_PUBLIC_CLIENT_SECRET;
  
  if (!clientId || !clientSecret) {
    throw new Error('Missing Reddit API credentials');
  }

  const authString = base64.encode(`${clientId}:${clientSecret}`);

  try {
    const response = await fetch('https://www.reddit.com/api/v1/access_token', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${authString}`,
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': 'MyRedditApp/1.0.0',
      },
      body: 'grant_type=client_credentials',
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error(`Failed to get access token: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data.access_token;
  } catch (error) {
    console.error('Error getting access token:', error);
    throw new Error('Failed to authenticate with Reddit API');
  }
}

async function wait(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function fetchWithRetry(url: string, options: RequestInit, retries = 3): Promise<Response | null> {
  let lastError: Error | null = null;
  let token: string;
  
  for (let i = 0; i < retries; i++) {
    try {
      // Get a fresh token for each retry
      token = await getAccessToken();
      
      // Update headers with new token
      options.headers = {
        ...options.headers,
        'Authorization': `Bearer ${token}`,
        'User-Agent': 'MyRedditApp/1.0.0',
      };

      // Add delay between retries
      if (i > 0) {
        await wait(Math.pow(2, i) * 1000);
      }

      const response = await fetch(url, {
        ...options,
        cache: 'no-store',
      });

      if (response.status === 404) {
        return null;
      }

      if (response.ok) {
        return response;
      }

      // For other status codes, throw an error
      throw new Error(`HTTP ${response.status} ${response.statusText}`);
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      console.error(`Attempt ${i + 1} failed:`, lastError);
      
      if (i === retries - 1) {
        throw lastError;
      }
    }
  }
  
  throw lastError || new Error('Max retries reached');
}

export async function fetchSubredditData(searchTerm: string, after?: string) {
  try {
    const searchUrl = new URL("https://oauth.reddit.com/subreddits/search");
    searchUrl.searchParams.append("q", searchTerm);
    searchUrl.searchParams.append("limit", "25");
    searchUrl.searchParams.append("type", "sr");
    if (after) {
      searchUrl.searchParams.append("after", after);
    }

    const searchResponse = await fetchWithRetry(searchUrl.toString(), {
      method: 'GET',
      cache: 'no-store',
    });

    if (!searchResponse) {
      return { data: [], hasMore: false, nextPage: null };
    }

    const searchData = await searchResponse.json();
    const validatedSearchData = SubredditSearchSchema.parse(searchData);

    const filteredSubreddits = validatedSearchData.data.children.filter(
      (child) => {
        const name = child.data.display_name.toLowerCase();
        return (
          name.includes(searchTerm.toLowerCase()) &&
          !name.startsWith('u_') &&
          !name.startsWith('u/') &&
          child.data.subreddit_type !== 'user'
        );
      }
    );

    // Process subreddits in batches
    const batchSize = 5;
    const results: Array<{
      name: string;
      activeUsers: number;
      subscribers: number;
    }> = [];

    for (let i = 0; i < filteredSubreddits.length; i += batchSize) {
      const batch = filteredSubreddits.slice(i, i + batchSize);
      
      await wait(1000); // Wait between batches
      
      const batchResults = await Promise.all(
        batch.map(async (child) => {
          const subredditName = child.data.display_name;
          try {
            const response = await fetchWithRetry(
              `https://oauth.reddit.com/r/${subredditName}/about`,
              {
                method: 'GET',
                cache: 'no-store',
              }
            );

            if (!response) {
              return null;
            }

            const subredditData = await response.json();
            const validatedSubreddit = SubredditSchema.parse(subredditData);

            return {
              name: validatedSubreddit.data.display_name,
              activeUsers: validatedSubreddit.data.active_user_count ?? 0,
              subscribers: validatedSubreddit.data.subscribers ?? 0,
            };
          } catch (error) {
            console.error(`Error fetching data for ${subredditName}:`, error);
            return null;
          }
        })
      );

      results.push(...batchResults.filter((item): item is NonNullable<typeof item> => item !== null));
    }

    return {
      data: results,
      hasMore: validatedSearchData.data.after !== null,
      nextPage: validatedSearchData.data.after,
    };
  } catch (error) {
    console.error("Error in fetchSubredditData:", error);
    throw new Error(
      `Failed to fetch subreddit data: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}