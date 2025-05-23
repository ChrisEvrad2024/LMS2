'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { Loader2, Save } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import ModuleEditor from './ModuleEditor';

const formSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  duration: z.number().min(1, 'Duration must be at least 1 minute'),
  difficulty: z.enum(['beginner', 'intermediate', 'advanced']),
  prerequisites: z.string().optional(),
  category: z.string().min(1, 'Category is required'),
  tags: z.array(z.string()).optional(),
  visibility: z.enum(['public', 'private', 'draft']),
  capacity: z.number().min(1, 'Capacity must be at least 1')
});

export default function CourseEditor({ params }: { params: { id: string } }) {
  const router = useRouter();
  
  const { data: course, isLoading } = useQuery({
    queryKey: ['course', params.id],
    queryFn: async () => {
      const { data } = await axios.get(`/api/courses/${params.id}`);
      return data.course;
    }
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
      duration: 60,
      difficulty: 'beginner',
      prerequisites: '',
      category: '',
      tags: [],
      visibility: 'draft',
      capacity: 10
    }
  });

  const { mutate: saveCourse, isPending } = useMutation({
    mutationFn: async (values: z.infer<typeof formSchema>) => {
      const { data } = await axios.put(`/api/courses/${params.id}`, values);
      return data.course;
    },
    onSuccess: () => {
      toast({
        title: 'Course saved successfully',
        variant: 'default'
      });
      router.refresh();
    },
    onError: () => {
      toast({
        title: 'Failed to save course',
        variant: 'destructive'
      });
    }
  });

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Edit Course</h1>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(saveCourse)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Course title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <FormControl>
                    <Input placeholder="Course category" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Detailed course description"
                    className="min-h-[120px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <ModuleEditor courseId={params.id} />

          <div className="flex justify-end">
            <Button type="submit" disabled={isPending}>
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Course
                </>
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
