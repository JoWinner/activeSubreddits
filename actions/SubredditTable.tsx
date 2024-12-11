import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Skeleton } from '@/components/ui/skeleton'

interface SubredditData {
  name: string
  activeUsers: number
  subscribers: number
}

interface SubredditTableProps {
  data: SubredditData[]
  isLoading: boolean
}

export function SubredditTable({ data, isLoading }: SubredditTableProps) {
  const sortedData = [...data].sort((a, b) => b.activeUsers - a.activeUsers)

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Subreddit</TableHead>
          <TableHead>Active Users</TableHead>
          <TableHead>Subscribers</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {isLoading ? (
          Array.from({ length: 20 }).map((_, index) => (
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

