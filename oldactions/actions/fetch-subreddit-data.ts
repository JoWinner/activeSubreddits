'use server'

import { z } from 'zod'

const SubredditSchema = z.object({
  data: z.object({
    active_user_count: z.number().nullable(),
    display_name: z.string(),
    subscribers: z.number(),
  }),
})

export async function fetchSubredditData(subreddit: string) {
  try {
    const response = await fetch(`https://www.reddit.com/r/${subreddit}/about.json`, {
      headers: {
        'User-Agent': 'MyRedditApp/1.0.0',
      },
    })

    if (!response.ok) {
      throw new Error('Failed to fetch subreddit data')
    }

    const data = await response.json()
    const validatedData = SubredditSchema.parse(data)

    return {
      name: validatedData.data.display_name,
      activeUsers: validatedData.data.active_user_count ?? 0,
      subscribers: validatedData.data.subscribers,
    }
  } catch (error) {
    console.error('Error fetching subreddit data:', error)
    return null
  }
}

