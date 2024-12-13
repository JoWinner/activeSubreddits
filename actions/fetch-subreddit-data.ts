"use server";

import { z } from "zod";
import base64 from 'base-64';

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

async function getAccessToken() {
  const clientId = 'YE_EDPw7Xeaqtpmwsoa9bg';
  const clientSecret = 'u78b_NmIK_i84_RFL23Zevuc_giTrQ';
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

export async function fetchSubredditData(searchTerm: string, after?: string) {
  try {
    const accessToken = await getAccessToken();

    const searchUrl = new URL("https://oauth.reddit.com/subreddits/search");
    searchUrl.searchParams.append("q", searchTerm);
    searchUrl.searchParams.append("limit", "100");
    if (after) {
      searchUrl.searchParams.append("after", after);
    }

    const searchResponse = await fetch(searchUrl.toString(), {
      headers: {
        "Authorization": `Bearer ${accessToken}`,
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
            `https://oauth.reddit.com/r/${subredditName}/about`,
            {
              headers: {
                "Authorization": `Bearer ${accessToken}`,
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

