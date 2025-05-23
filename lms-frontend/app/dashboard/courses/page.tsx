'use client';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { columns } from './columns';
import { useAuth } from '@/context/AuthContext';
import axios from 'axios';
import { Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function CoursesPage() {
  const { user } = useAuth();
  const router = useRouter();

  const { data: courses, isLoading } = useQuery({
    queryKey: ['courses'],
    queryFn: async () => {
      const { data } = await axios.get('/api/courses');
      return data.courses;
    }
  });

  if (!user) return null;

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">Course Management</h1>
        {['admin', 'instructor'].includes(user.role) && (
          <Button onClick={() => router.push('/dashboard/courses/new')}>
            <Plus className="mr-2 h-4 w-4" />
            Create Course
          </Button>
        )}
      </div>
      <DataTable
        columns={columns}
        data={courses || []}
        isLoading={isLoading}
      />
    </div>
  );
}
