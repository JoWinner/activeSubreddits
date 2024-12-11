"use client";

import { useState, useEffect } from "react";
import { SearchBar } from "@/components/search-bar";
import { SubredditTable } from "@/components/subreddit-table";
import { fetchSubredditData } from "@/actions/fetch-subreddit-data";
import { fetchTopSubreddits } from "@/actions/fetch-top-subreddits";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface SubredditData {
  name: string;
  activeUsers: number;
  subscribers: number;
}

export default function Home() {
  const [subredditData, setSubredditData] = useState<SubredditData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentSearch, setCurrentSearch] = useState("");
  const [nextPage, setNextPage] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);

  useEffect(() => {
    async function loadTopSubreddits() {
      try {
        setIsLoading(true);
        setError(null);
        const topSubreddits = await fetchTopSubreddits();
        setSubredditData(topSubreddits);
      } catch (err) {
        console.error("Error loading top subreddits:", err);
        setError(
          `Failed to load top subreddits: ${
            err instanceof Error ? err.message : "Unknown error"
          }`
        );
        setSubredditData([]);
      } finally {
        setIsLoading(false);
      }
    }
    loadTopSubreddits();
  }, []);

  const handleSearch = async (keywords: string[]) => {
    if (keywords.length === 0) {
      const topSubreddits = await fetchTopSubreddits();
      setSubredditData(topSubreddits);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // Search for each keyword separately and combine results
      const allResults = await Promise.all(
        keywords.map((keyword) => fetchSubredditData(keyword))
      );

      // Combine and deduplicate results
      const combinedData = allResults.reduce((acc, result) => {
        result.data.forEach((item) => {
          const existingItem = acc.find(
            (existing) => existing.name === item.name
          );
          if (!existingItem) {
            acc.push(item);
          }
        });
        return acc;
      }, [] as SubredditData[]);

      // Sort by active users
      const sortedData = combinedData.sort(
        (a, b) => b.activeUsers - a.activeUsers
      );

      setSubredditData(sortedData);
      // Since we're not using pagination with multiple tags, set these to false/null
      setHasMore(false);
      setNextPage(null);
    } catch (err) {
      console.error("Error in handleSearch:", err);
      setError(
        `Failed to fetch subreddit data: ${
          err instanceof Error ? err.message : "Unknown error"
        }`
      );
      setSubredditData([]);
      setHasMore(false);
      setNextPage(null);
    } finally {
      setIsLoading(false);
    }
  };

  const loadMore = async () => {
    if (!nextPage || !currentSearch) return;

    try {
      setIsLoading(true);
      const result = await fetchSubredditData(currentSearch, nextPage);
      setSubredditData((prev) => [...prev, ...result.data]);
      setHasMore(result.hasMore);
      setNextPage(result.nextPage);
    } catch (err) {
      console.error("Error in loadMore:", err);
      setError(
        `Failed to load more results: ${
          err instanceof Error ? err.message : "Unknown error"
        }`
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <main className="container mx-auto p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Left Sidebar - Ad Space */}
          <Card className="hidden md:block p-4 h-[600px]">
            <div className="w-full h-full flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg">
              <p className="text-muted-foreground">Ad Space</p>
            </div>
          </Card>

          {/* Main Content */}
          <div className="md:col-span-2 space-y-4">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-primary-foreground bg-clip-text text-transparent">
                Reddit Users Online
              </h1>
              <p className="text-muted-foreground">
                Track active users across different subreddits in real-time
              </p>
            </div>

            <SearchBar onSearch={handleSearch} />

            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
              <SubredditTable data={subredditData} isLoading={isLoading} />
              {hasMore && (
                <div className="p-4 flex justify-center">
                  <Button onClick={loadMore} disabled={isLoading}>
                    {isLoading ? "Loading..." : "Load More"}
                  </Button>
                </div>
              )}
            </div>

            {/* Mobile Ad Space */}
            <Card className="md:hidden p-4">
              <div className="w-full h-[200px] flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg">
                <p className="text-muted-foreground">Ad Space (email us)</p>
              </div>
            </Card>
          </div>

          {/* Right Sidebar - Ad Space */}
          <Card className="hidden md:block p-4 h-[600px]">
            <div className="w-full h-full flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg">
              <p className="text-muted-foreground">Ad Space (email us)</p>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}
