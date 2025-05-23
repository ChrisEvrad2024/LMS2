'use client';
import { useQuery, useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Plus, Trash2, ArrowUp, ArrowDown } from 'lucide-react';
import { useState } from 'react';
import LessonEditor from './LessonEditor';

export default function ModuleEditor({ courseId }: { courseId: string }) {
  const [activeModule, setActiveModule] = useState<string | null>(null);

  const { data: modules, refetch } = useQuery({
    queryKey: ['modules', courseId],
    queryFn: async () => {
      const { data } = await axios.get(`/api/courses/${courseId}/modules`);
      return data.modules;
    }
  });

  const { mutate: createModule } = useMutation({
    mutationFn: async () => {
      await axios.post(`/api/courses/${courseId}/modules`, {
        title: 'New Module',
        description: '',
        order: modules ? modules.length + 1 : 1
      });
    },
    onSuccess: () => refetch()
  });

  const { mutate: deleteModule } = useMutation({
    mutationFn: async (moduleId: string) => {
      await axios.delete(`/api/courses/${courseId}/modules/${moduleId}`);
    },
    onSuccess: () => {
      setActiveModule(null);
      refetch();
    }
  });

  const { mutate: reorderModules } = useMutation({
    mutationFn: async ({ moduleId, direction }: { moduleId: string; direction: 'up' | 'down' }) => {
      await axios.patch(`/api/courses/${courseId}/modules/${moduleId}/reorder`, { direction });
    },
    onSuccess: () => refetch()
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Modules</h2>
        <Button onClick={() => createModule()}>
          <Plus className="mr-2 h-4 w-4" />
          Add Module
        </Button>
      </div>

      <div className="space-y-4">
        {modules?.map((module) => (
          <div key={module.id} className="border rounded-lg overflow-hidden">
            <div className="flex items-center justify-between p-4 bg-gray-50">
              <div className="flex items-center space-x-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => reorderModules({ moduleId: module.id, direction: 'up' })}
                  disabled={module.order === 1}
                >
                  <ArrowUp className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => reorderModules({ moduleId: module.id, direction: 'down' })}
                  disabled={module.order === modules.length}
                >
                  <ArrowDown className="h-4 w-4" />
                </Button>
                <h3 className="font-medium">{module.title}</h3>
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setActiveModule(activeModule === module.id ? null : module.id)}
                >
                  {activeModule === module.id ? 'Hide' : 'Edit'}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => deleteModule(module.id)}
                >
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </div>
            </div>
            
            {activeModule === module.id && (
              <div className="p-4 border-t">
                <LessonEditor moduleId={module.id} />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
