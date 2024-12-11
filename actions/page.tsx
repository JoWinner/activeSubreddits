'use client'

import { useState, useEffect } from 'react'
import { SearchBar } from './SearchBar'
import { SubredditTable } from './SubredditTable'
import { fetchSubredditData } from './fetch-subreddit-data'
import { fetchTopSubreddits } from './fetch-top-subreddits'
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from 'lucide-react'

export default function Home() {
  const [subredditData, setSubredditData] = useState<Array<{
    name: string
    activeUsers: number
    subscribers: number
  }>>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadTopSubreddits() {
      try {
        setIsLoading(true)
        setError(null)
        const topSubreddits = await fetchTopSubreddits()
        setSubredditData(topSubreddits)
      } catch (err) {
        setError('Failed to load subreddit data. Please try again later.')
      } finally {
        setIsLoading(false)
      }
    }
    loadTopSubreddits()
  }, [])

  const handleSearch = async (subreddit: string) => {
    try {
      setIsLoading(true)
      setError(null)
      const data = await fetchSubredditData(subreddit)
      if (data) {
        setSubredditData((prevData) => {
          const newData = [...prevData]
          const existingIndex = newData.findIndex((item) => item.name === data.name)
          if (existingIndex !== -1) {
            newData[existingIndex] = data
          } else {
            newData.push(data)
          }
          return newData.slice(0, 20).sort((a, b) => b.activeUsers - a.activeUsers)
        })
      }
    } catch (err) {
      setError('Failed to fetch subreddit data. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Reddit Users Online</h1>
      <SearchBar onSearch={handleSearch} />
      {error && (
        <Alert variant="destructive" className="mt-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      <div className="mt-4">
        <SubredditTable data={subredditData} isLoading={isLoading} />
      </div>
    </main>
  )
}

