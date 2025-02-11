import { Avatar, AvatarFallback, AvatarImage } from '@/components/common/ui/avatar';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/common/ui/table';
import { Button } from '@/components/common/ui/button';
import { Link } from 'react-router-dom';
import { useState, useMemo } from 'react';

interface Member {
  id?: string;
  name: string;
  username?: string;
  image?: string;
  standing?: string;
  checkIns?: number;
  profileUrl?: string;
}

interface MembersTableProps {
  members: Member[];
}

type SortField = 'standing' | 'checkIns';
type SortOrder = 'asc' | 'desc';

export function MembersTable({ members }: MembersTableProps) {
  const [sortField, setSortField] = useState<SortField | null>(null);
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const sortedMembers = useMemo(() => {
    if (!sortField) return members;

    return [...members].sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];

      if (sortOrder === 'asc') {
        return (aValue ?? 0) > (bValue ?? 0) ? 1 : -1;
      }
      return (aValue ?? 0) < (bValue ?? 0) ? 1 : -1;
    });
  }, [members, sortField, sortOrder]);

  return (
    <div className="w-full">
      <Table>
        <TableHeader>
          <TableRow className="h-12">
            <TableHead className="w-[300px]">Member</TableHead>
            <TableHead
              className="cursor-pointer hover:text-primary"
              onClick={() => handleSort('standing')}
            >
              Standing
              {sortField === 'standing' && (
                <span className="ml-2">{sortOrder === 'asc' ? '↑' : '↓'}</span>
              )}
            </TableHead>
            <TableHead
              className="cursor-pointer text-center hover:text-primary"
              onClick={() => handleSort('checkIns')}
            >
              Check-ins
              {sortField === 'checkIns' && (
                <span className="ml-2">{sortOrder === 'asc' ? '↑' : '↓'}</span>
              )}
            </TableHead>
            <TableHead className="w-[100px]">Profile</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedMembers.map((member) => (
            <TableRow key={member.id}>
              <TableCell className="flex items-center gap-3">
                <Avatar className="h-10 w-10 bg-warning-50">
                  <AvatarImage src={member.image} alt={member.name} />
                  <AvatarFallback>
                    {member.name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="font-medium">{member.name}</span>
                  <span className="text-sm text-muted-foreground">@{member.username}</span>
                </div>
              </TableCell>
              <TableCell>{member.standing}</TableCell>
              <TableCell className="text-center">{member.checkIns}</TableCell>
              <TableCell>
                <Button variant="link" size="sm" asChild>
                  <Link to={member.profileUrl || '#'}>View</Link>
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
