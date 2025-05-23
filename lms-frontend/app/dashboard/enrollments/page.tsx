'use client';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { columns } from './columns';
import axios from 'axios';
import { useAuth } from '@/context/AuthContext';

export default function EnrollmentsPage() {
  const { user } = useAuth();

  const { data: enrollments, isLoading } = useQuery({
    queryKey: ['enrollments'],
    queryFn: async () => {
      const { data } = await axios.get('/api/enrollments');
      return data.enrollments;
    },
    enabled: !!user
  });

  if (!user) return null;

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">Enrollment Management</h1>
        {['admin', 'instructor'].includes(user.role) && (
          <Button onClick={() => router.push('/dashboard/enrollments/new')}>
            New Enrollment
          </Button>
        )}
      </div>
      <DataTable
        columns={columns}
        data={enrollments || []}
        isLoading={isLoading}
      />
    </div>
  );
}
