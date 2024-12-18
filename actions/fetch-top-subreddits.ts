'use server'

import { z } from 'zod'
import base64 from 'base-64';

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

      if (response.status === 404) {
        // Return null for 404 errors
        return null;
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

const SubredditListSchema = z.object({
  data: z.object({
    children: z.array(
      z.object({
        data: z.object({
          display_name: z.string(),
          subscribers: z.number().nullable().default(0),
        }),
      })
    ),
  }),
})

const SubredditSchema = z.object({
  data: z.object({
    active_user_count: z.number().nullable(),
    display_name: z.string(),
    subscribers: z.number().nullable().default(0),
  }),
})

export async function fetchTopSubreddits() {
  try {
    const token = await getAccessToken();

    const response = await fetchWithRetry('https://oauth.reddit.com/subreddits/popular?limit=20', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'User-Agent': 'MyRedditApp/1.0.0',
      },
    });

    if (!response) {
      return null;
    }

    const data = await response.json();
    const validatedData = SubredditListSchema.parse(data);

    const subredditsWithCounts = await Promise.all(
      validatedData.data.children.map(async (child) => {
        const subredditName = child.data.display_name;
        try {
          const response = await fetchWithRetry(
            `https://oauth.reddit.com/r/${subredditName}/about`,
            {
              headers: {
                'Authorization': `Bearer ${token}`,
                'User-Agent': 'MyRedditApp/1.0.0',
              },
            }
          );

          if (response === null) {
            console.log(`Subreddit not found: ${subredditName}`);
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

    // Filter out null results
    const validSubreddits = subredditsWithCounts.filter(
      (subreddit): subreddit is NonNullable<typeof subreddit> => subreddit !== null
    );

    return validSubreddits.sort((a, b) => b.activeUsers - a.activeUsers);
  } catch (error) {
    console.error('Error in fetchTopSubreddits:', error);
    throw new Error(`Failed to fetch top subreddits: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

