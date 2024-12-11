import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from '@/components/ui/table'
  import { Skeleton } from '@/components/ui/skeleton'
  import { ChevronDown, ChevronUp } from 'lucide-react'
  import { useState } from 'react'
  
  interface SubredditData {
    name: string
    activeUsers: number
    subscribers: number
  }
  
  interface SubredditTableProps {
    data: SubredditData[]
    isLoading: boolean
  }
  
  type SortKey = 'name' | 'activeUsers' | 'subscribers'
  
  export function SubredditTable({ data, isLoading }: SubredditTableProps) {
    const [sortKey, setSortKey] = useState<SortKey>('activeUsers')
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')
  
    const sortedData = [...data].sort((a, b) => {
      if (sortKey === 'name') {
        return sortDirection === 'asc' 
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name)
      }
      return sortDirection === 'asc'
        ? a[sortKey] - b[sortKey]
        : b[sortKey] - a[sortKey]
    })
  
    const handleSort = (key: SortKey) => {
      if (sortKey === key) {
        setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
      } else {
        setSortKey(key)
        setSortDirection('desc')
      }
    }
  
    const SortIcon = ({ column }: { column: SortKey }) => {
      if (sortKey !== column) return null
      return sortDirection === 'asc' ? 
        <ChevronUp className="inline-block ml-1 h-4 w-4" /> : 
        <ChevronDown className="inline-block ml-1 h-4 w-4" />
    }
  
    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="cursor-pointer" onClick={() => handleSort('name')}>
              Subreddit <SortIcon column="name" />
            </TableHead>
            <TableHead className="cursor-pointer" onClick={() => handleSort('activeUsers')}>
              Active Users <SortIcon column="activeUsers" />
            </TableHead>
            <TableHead className="cursor-pointer" onClick={() => handleSort('subscribers')}>
              Subscribers <SortIcon column="subscribers" />
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading && data.length === 0 ? (
            Array.from({ length: 5 }).map((_, index) => (
              <TableRow key={index}>
                <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
                <TableCell><Skeleton className="h-4 w-[80px]" /></TableCell>
                <TableCell><Skeleton className="h-4 w-[80px]" /></TableCell>
              </TableRow>
            ))
          ) : (
            sortedData.map((item) => (
              <TableRow key={item.name}>
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.activeUsers.toLocaleString()}</TableCell>
                <TableCell>{item.subscribers.toLocaleString()}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    )
  }
  
  