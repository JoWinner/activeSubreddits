'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

interface SearchBarProps {
  onSearch: (subreddit: string) => void
}

export function SearchBar({ onSearch }: SearchBarProps) {
  const [subreddit, setSubreddit] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (subreddit.trim()) {
      onSearch(subreddit.trim())
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex space-x-2">
      <Input
        type="text"
        placeholder="Enter subreddit name"
        value={subreddit}
        onChange={(e) => setSubreddit(e.target.value)}
        className="flex-grow"
      />
      <Button type="submit">Search</Button>
    </form>
  )
}

