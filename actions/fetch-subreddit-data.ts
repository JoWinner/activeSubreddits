"use server";

import { z } from "zod";
import base64 from 'base-64';

const SubredditSearchSchema = z.object({
  data: z.object({
    children: z.array(
      z.object({
        data: z.object({
          display_name: z.string(),
          subscribers: z.number().nullable().default(0), // Allow null subscribers
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
    subscribers: z.number().nullable().default(0), // Allow null subscribers
  }),
});

let accessToken: string | null = null;
let tokenExpiration: number = 0;

async function getAccessToken() {
  const currentTime = Date.now();
  
  // Check if token exists and is not expired (with 5-minute buffer)
  if (accessToken && tokenExpiration > currentTime + 300000) {
    return accessToken;
  }

  const clientId = process.env.NEXT_PUBLIC_CLIENT_ID;
  const clientSecret = process.env.NEXT_PUBLIC_CLIENT_SECRET;
  const authString = base64.encode(`${clientId}:${clientSecret}`);

  try {
    const response = await fetch('https://www.reddit.com/api/v1/access_token', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${authString}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: 'grant_type=client_credentials',
    });

    if (!response.ok) {
      throw new Error(`Failed to get access token: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    accessToken = data.access_token;
    // Set expiration to current time + expires_in (in milliseconds) - 5 minute buffer
    tokenExpiration = currentTime + (data.expires_in * 1000) - 300000;
    return accessToken;
  } catch (error) {
    console.error('Error getting access token:', error);
    throw new Error('Failed to authenticate with Reddit API');
  }
}

async function fetchWithRetry(url: string, options: RequestInit, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url, options);
      
      if (response.status === 401 && i < retries - 1) {
        // Clear token and try to get a new one
        accessToken = null;
        const newToken = await getAccessToken();
        options.headers = {
          ...options.headers,
          'Authorization': `Bearer ${newToken}`,
        };
        continue;
      }

      if (!response.ok) {
        throw new Error(`${response.status} ${response.statusText}`);
      }

      return response;
    } catch (error) {
      if (i === retries - 1) throw error;
      // Wait for 1 second before retrying
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
  throw new Error('Max retries reached');
}

export async function fetchSubredditData(searchTerm: string, after?: string) {
  try {
    const token = await getAccessToken();

    const searchUrl = new URL("https://oauth.reddit.com/subreddits/search");
    searchUrl.searchParams.append("q", searchTerm);
    searchUrl.searchParams.append("limit", "100");
    if (after) {
      searchUrl.searchParams.append("after", after);
    }

    const searchResponse = await fetchWithRetry(searchUrl.toString(), {
      headers: {
        "Authorization": `Bearer ${token}`,
        "User-Agent": "MyRedditApp/1.0.0",
      },
    });

    const searchData = await searchResponse.json();
    const validatedSearchData = SubredditSearchSchema.parse(searchData);

    const filteredSubreddits = validatedSearchData.data.children.filter(
      (child) => {
        const name = child.data.display_name.toLowerCase();
        return name.includes(searchTerm.toLowerCase()) && !name.startsWith('u/');
      }
    );

    const subredditsWithCounts = await Promise.all(
      filteredSubreddits.map(async (child) => {
        const subredditName = child.data.display_name;
        try {
          const response = await fetchWithRetry(
            `https://oauth.reddit.com/r/${subredditName}/about`,
            {
              headers: {
                "Authorization": `Bearer ${token}`,
                "User-Agent": "MyRedditApp/1.0.0",
              },
            }
          );

          const subredditData = await response.json();
          const validatedSubreddit = SubredditSchema.parse(subredditData);

          return {
            name: validatedSubreddit.data.display_name,
            activeUsers: validatedSubreddit.data.active_user_count ?? 0,
            subscribers: validatedSubreddit.data.subscribers ?? 0,
          };
        } catch (error) {
          console.error(`Error fetching data for ${subredditName}:`, error);
          return {
            name: subredditName,
            activeUsers: 0,
            subscribers: child.data.subscribers ?? 0,
          };
        }
      })
    );

    return {
      data: subredditsWithCounts,
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

