'use client'

import { useState, KeyboardEvent } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { X } from 'lucide-react'

interface SearchBarProps {
  onSearch: (keywords: string[]) => void
}

export function SearchBar({ onSearch }: SearchBarProps) {
  const [inputValue, setInputValue] = useState('')
  const [keywords, setKeywords] = useState<string[]>([])

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === ' ' && inputValue.trim()) {
      e.preventDefault()
      if (keywords.length < 5) {
        const newKeyword = inputValue.trim()
        if (!keywords.includes(newKeyword)) {
          const newKeywords = [...keywords, newKeyword]
          setKeywords(newKeywords)
          onSearch(newKeywords)
        }
      }
      setInputValue('')
    }
  }

  const removeKeyword = (keywordToRemove: string) => {
    const newKeywords = keywords.filter(k => k !== keywordToRemove)
    setKeywords(newKeywords)
    onSearch(newKeywords)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (inputValue.trim() && keywords.length < 5) {
      const newKeyword = inputValue.trim()
      if (!keywords.includes(newKeyword)) {
        const newKeywords = [...keywords, newKeyword]
        setKeywords(newKeywords)
        onSearch(newKeywords)
        setInputValue('')
      }
    }
  }

  return (
    <div className="space-y-2">
      <form onSubmit={handleSubmit} className="flex space-x-2">
        <Input
          type="text"
          placeholder={keywords.length >= 5 ? "Maximum tags reached" : "Type and press space to add keywords..."}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={keywords.length >= 5}
          className="flex-grow"
        />
        <Button type="submit" disabled={keywords.length >= 5 || !inputValue.trim()}>
          Search
        </Button>
      </form>
      {keywords.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {keywords.map((keyword) => (
            <Badge key={keyword} variant="secondary" className="px-3 py-1">
              {keyword}
              <button
                onClick={() => removeKeyword(keyword)}
                className="ml-2 hover:text-destructive"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  )
}
