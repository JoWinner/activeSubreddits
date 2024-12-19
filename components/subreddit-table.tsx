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
      <ChevronUp className="inline-block ml-1 h-4 w-4 text-[#FF4500]" /> :
      <ChevronDown className="inline-block ml-1 h-4 w-4 text-[#FF4500]" />
  }

  return (
    <Table className="w-full">
      <TableHeader>
        <TableRow className="bg-[#F6F7F8] dark:bg-[#272729]">
          <TableHead className="w-[50px] text-[#1c1c1c] dark:text-[#D7DADC]">#</TableHead>
          <TableHead className="cursor-pointer text-[#1c1c1c] dark:text-[#D7DADC]" onClick={() => handleSort('name')}>
            Subreddit <SortIcon column="name" />
          </TableHead>
          <TableHead className="cursor-pointer text-[#1c1c1c] dark:text-[#D7DADC]" onClick={() => handleSort('activeUsers')}>
            Users Online <SortIcon column="activeUsers" />
          </TableHead>
          <TableHead className="cursor-pointer text-[#1c1c1c] dark:text-[#D7DADC]" onClick={() => handleSort('subscribers')}>
            Subscribers <SortIcon column="subscribers" />
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
      {isLoading ? (
          Array.from({ length: 5 }).map((_, index) => (
            <TableRow key={index}>
              <TableCell><Skeleton className="h-4 w-[30px]" /></TableCell>
              <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
              <TableCell><Skeleton className="h-4 w-[80px]" /></TableCell>
              <TableCell><Skeleton className="h-4 w-[80px]" /></TableCell>
            </TableRow>
          ))
        ) : sortedData.length === 0 ? (
          <TableRow>
            <TableCell colSpan={4} className="text-center text-muted-foreground">
              No results found
            </TableCell>
          </TableRow>
        ) : (
          sortedData.map((item, index) => (
            <TableRow key={item.name} className="hover:bg-[#F6F7F8] dark:hover:bg-[#272729]">
              <TableCell className="text-[#1c1c1c] dark:text-[#D7DADC]">{index + 1}</TableCell>
              <TableCell className="text-[#0079D3] dark:text-[#4FBCFF] font-medium">{item.name}</TableCell>
              <TableCell className="text-white ">
                <span className='bg-green-500 dark:bg-green-700 rounded-full w-fit py-1 px-2'>
                {item.activeUsers.toLocaleString()}
                </span>
              </TableCell>
              <TableCell className="text-[#1c1c1c] dark:text-[#D7DADC]">{item.subscribers.toLocaleString()}</TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  )
}

