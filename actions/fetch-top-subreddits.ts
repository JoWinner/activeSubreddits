'use server'

import { z } from 'zod'
import base64 from 'base-64';

async function getAccessToken() {
  const clientId = process.env.NEXT_PUBLIC_CLIENT_ID;
  const clientSecret = process.env.NEXT_PUBLIC_SECRET;
  const authString = base64.encode(`${clientId}:${clientSecret}`);

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
  return data.access_token;
}

const SubredditListSchema = z.object({
  data: z.object({
    children: z.array(
      z.object({
        data: z.object({
          display_name: z.string(),
          subscribers: z.number(),
        }),
      })
    ),
  }),
})

const SubredditSchema = z.object({
  data: z.object({
    active_user_count: z.number().nullable(),
    display_name: z.string(),
    subscribers: z.number(),
  }),
})

export async function fetchTopSubreddits() {
  try {
    const accessToken = await getAccessToken();

    const response = await fetch('https://oauth.reddit.com/subreddits/popular?limit=20', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'User-Agent': 'MyRedditApp/1.0.0',
      },
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch top subreddits: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    const validatedData = SubredditListSchema.parse(data)

    const subredditsWithCounts = await Promise.all(
      validatedData.data.children.map(async (child) => {
        const subredditName = child.data.display_name
        try {
          const response = await fetch(`https://oauth.reddit.com/r/${subredditName}/about`, {
            headers: {
              'Authorization': `Bearer ${accessToken}`,
              'User-Agent': 'MyRedditApp/1.0.0',
            },
          })

          if (!response.ok) {
            console.error(`Failed to fetch data for ${subredditName}: ${response.status} ${response.statusText}`)
            return {
              name: subredditName,
              activeUsers: 0,
              subscribers: child.data.subscribers,
            }
          }

          const subredditData = await response.json()
          const validatedSubreddit = SubredditSchema.parse(subredditData)

          return {
            name: validatedSubreddit.data.display_name,
            activeUsers: validatedSubreddit.data.active_user_count ?? 0,
            subscribers: validatedSubreddit.data.subscribers,
          }
        } catch (error) {
          console.error(`Error fetching data for ${subredditName}:`, error)
          return {
            name: subredditName,
            activeUsers: 0,
            subscribers: child.data.subscribers,
          }
        }
      })
    )

    return subredditsWithCounts.sort((a, b) => b.activeUsers - a.activeUsers)
  } catch (error) {
    console.error('Error in fetchTopSubreddits:', error)
    throw new Error(`Failed to fetch top subreddits: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

