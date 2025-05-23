import { ColumnDef } from '@tanstack/react-table';
import { Course } from '@/types';
import { Button } from '@/components/ui/button';
import { ArrowUpDown, Edit, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export const columns: ColumnDef<Course>[] = [
  {
    accessorKey: 'title',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Title
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    }
  },
  {
    accessorKey: 'category',
    header: 'Category'
  },
  {
    accessorKey: 'level',
    header: 'Level'
  },
  {
    accessorKey: 'isPublished',
    header: 'Status',
    cell: ({ row }) => (
      <span className={row.getValue('isPublished') ? 'text-green-500' : 'text-gray-500'}>
        {row.getValue('isPublished') ? 'Published' : 'Draft'}
      </span>
    )
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const course = row.original;
      const router = useRouter();
      const { user } = useAuth();

      return (
        <div className="flex space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push(`/dashboard/courses/${course.id}`)}
          >
            <Edit className="h-4 w-4" />
          </Button>
          {['admin', 'instructor'].includes(user?.role || '') && (
            <Button
              variant="ghost"
              size="sm"
              onClick={async () => {
                await axios.delete(`/api/courses/${course.id}`);
                router.refresh();
              }}
            >
              <Trash2 className="h-4 w-4 text-red-500" />
            </Button>
          )}
        </div>
      );
    }
  }
];
