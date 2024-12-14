'use client'

import { useState, useEffect } from 'react'
import { SearchBar } from '@/components/search-bar'
import { SubredditTable } from '@/components/subreddit-table'
import { fetchSubredditData } from '@/actions/fetch-subreddit-data'
import { fetchTopSubreddits } from '@/actions/fetch-top-subreddits'
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from 'lucide-react'
import { Card } from "@/components/ui/card"
import { AdCard } from '@/components/ad-card'
import { Logo } from '@/components/logo'
import { mockAds } from '@/data/ads-data'

interface SubredditData {
  name: string;
  activeUsers: number;
  subscribers: number;
}

export default function Home() {
  const [subredditData, setSubredditData] = useState<SubredditData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadTopSubreddits() {
      try {
        setIsLoading(true);
        setError(null);
        const topSubreddits = await fetchTopSubreddits();
        setSubredditData(topSubreddits.filter(subreddit => subreddit.activeUsers > 0).slice(0, 20));
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
      setSubredditData(topSubreddits.filter(subreddit => subreddit.activeUsers > 0).slice(0, 20));
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const allResults = await Promise.all(
        keywords.map((keyword) => fetchSubredditData(keyword))
      );

      const combinedData = allResults.reduce((acc, result) => {
        result.data.forEach((item) => {
          if (item.activeUsers > 0) {
            const existingItem = acc.find(
              (existing) => existing.name === item.name
            );
            if (!existingItem) {
              acc.push(item);
            } else if (item.activeUsers > existingItem.activeUsers) {
              Object.assign(existingItem, item);
            }
          }
        });
        return acc;
      }, [] as SubredditData[]);

      const sortedData = combinedData
        .sort((a, b) => b.activeUsers - a.activeUsers)
        .slice(0, 20);

      setSubredditData(sortedData);
    } catch (err) {
      console.error("Error in handleSearch:", err);
      setError(
        `Failed to fetch subreddit data: ${
          err instanceof Error ? err.message : "Unknown error"
        }`
      );
      setSubredditData([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#DAE0E6] dark:bg-[#030303]">
      <div className="sticky top-0 z-10 bg-[#FFFFFF] dark:bg-[#1A1A1B] p-4 shadow-md">
        <AdCard ads={mockAds} className="w-full" startIndex={0} />
      </div>
      <main className="container mx-auto p-4">
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
          {/* Left Sidebar - 2 Ad Spaces */}
          <div className="hidden md:flex md:col-span-1 flex-col space-y-4">
            <AdCard ads={mockAds} startIndex={1} />
            <AdCard ads={mockAds} startIndex={2} />
          </div>

          {/* Main Content */}
          <div className="md:col-span-4 space-y-4">
            <div className="text-center mb-8 flex items-center justify-center">
              <Logo />
              <h1 className="text-4xl font-bold ml-2 text-[#FF4500] dark:text-[#FF4500]">
                Redditors Online
              </h1>
            </div>
            <p className="text-center text-[#1c1c1c] dark:text-[#D7DADC] mb-4">
              Track active users across different subreddits in real-time
            </p>

            <SearchBar onSearch={handleSearch} />

            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="bg-[#FFFFFF] dark:bg-[#1A1A1B] rounded-lg shadow">
              <SubredditTable data={subredditData} isLoading={isLoading} />
            </div>

            {/* Mobile Ad Space */}
            <Card className="md:hidden p-4">
              <AdCard ads={mockAds} startIndex={3} />
            </Card>
          </div>

          {/* Right Sidebar - 2 Ad Spaces */}
          <div className="hidden md:flex md:col-span-1 flex-col space-y-4">
            <AdCard ads={mockAds} startIndex={4} />
            <AdCard ads={mockAds} startIndex={5} />
          </div>
        </div>
      </main>
      <div className="bg-[#FFFFFF] dark:bg-[#1A1A1B] p-4 mt-4 shadow-md">
        <AdCard ads={mockAds} className="w-full" startIndex={6} />
      </div>
    </div>
  );
}

