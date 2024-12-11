'use server'

import { z } from 'zod'

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
    // First, fetch the list of popular subreddits
    const response = await fetch('https://www.reddit.com/subreddits/popular.json?limit=20', {
      headers: {
        'User-Agent': 'MyRedditApp/1.0.0',
      },
    })

    if (!response.ok) {
      throw new Error('Failed to fetch top subreddits')
    }

    const data = await response.json()
    const validatedData = SubredditListSchema.parse(data)

    // Then fetch active user counts for each subreddit
    const subredditsWithCounts = await Promise.all(
      validatedData.data.children.map(async (child) => {
        const subredditName = child.data.display_name
        try {
          const response = await fetch(`https://www.reddit.com/r/${subredditName}/about.json`, {
            headers: {
              'User-Agent': 'MyRedditApp/1.0.0',
            },
          })

          if (!response.ok) {
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

    // Sort by active users in descending order
    return subredditsWithCounts.sort((a, b) => b.activeUsers - a.activeUsers)
  } catch (error) {
    console.error('Error fetching top subreddits:', error)
    return []
  }
}

