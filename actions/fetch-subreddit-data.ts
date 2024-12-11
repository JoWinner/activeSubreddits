"use server";

import { z } from "zod";

const SubredditSearchSchema = z.object({
  data: z.object({
    children: z.array(
      z.object({
        data: z.object({
          display_name: z.string(),
          subscribers: z.number(),
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
    subscribers: z.number(),
  }),
});

export async function fetchSubredditData(searchTerm: string, after?: string) {
  try {
    const searchUrl = new URL("https://www.reddit.com/subreddits/search.json");
    searchUrl.searchParams.append("q", searchTerm);
    searchUrl.searchParams.append("limit", "25");
    if (after) {
      searchUrl.searchParams.append("after", after);
    }

    const searchResponse = await fetch(searchUrl.toString(), {
      headers: {
        "User-Agent": "MyRedditApp/1.0.0",
      },
    });

    if (!searchResponse.ok) {
      throw new Error(
        `Failed to search subreddits: ${searchResponse.status} ${searchResponse.statusText}`
      );
    }

    const searchData = await searchResponse.json();
    const validatedSearchData = SubredditSearchSchema.parse(searchData);

    const filteredSubreddits = validatedSearchData.data.children.filter(
      (child) =>
        child.data.display_name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const subredditsWithCounts = await Promise.all(
      filteredSubreddits.map(async (child) => {
        const subredditName = child.data.display_name;
        try {
          const response = await fetch(
            `https://www.reddit.com/r/${subredditName}/about.json`,
            {
              headers: {
                "User-Agent": "MyRedditApp/1.0.0",
              },
            }
          );

          if (!response.ok) {
            console.error(
              `Failed to fetch data for ${subredditName}: ${response.status} ${response.statusText}`
            );
            return {
              name: subredditName,
              activeUsers: 0,
              subscribers: child.data.subscribers,
            };
          }

          const subredditData = await response.json();
          const validatedSubreddit = SubredditSchema.parse(subredditData);

          return {
            name: validatedSubreddit.data.display_name,
            activeUsers: validatedSubreddit.data.active_user_count ?? 0,
            subscribers: validatedSubreddit.data.subscribers,
          };
        } catch (error) {
          console.error(`Error fetching data for ${subredditName}:`, error);
          return {
            name: subredditName,
            activeUsers: 0,
            subscribers: child.data.subscribers,
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
