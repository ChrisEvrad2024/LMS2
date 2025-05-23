'use client';
import { useQuery, useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { useParams } from 'next/navigation';
import { Progress } from '@/components/ui/progress';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';

export default function CourseProgress() {
  const params = useParams();
  const courseId = params.id;

  const { data: progress } = useQuery({
    queryKey: ['progress', courseId],
    queryFn: async () => {
      const { data } = await axios.get(`/api/courses/${courseId}/progress`);
      return data.progress;
    }
  });

  const { mutate: markComplete } = useMutation({
    mutationFn: async (lessonId: string) => {
      await axios.post(`/api/courses/${courseId}/progress`, { lessonId });
    }
  });

  if (!progress) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Progress</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <Progress value={progress.overall} className="h-4" />
            <div className="text-sm text-muted-foreground mt-2">
              {progress.completed} of {progress.total} lessons completed
            </div>
          </div>

          <div className="space-y-2">
            {progress.modules.map((module) => (
              <div key={module.id} className="space-y-1">
                <h3 className="font-medium">{module.title}</h3>
                <div className="space-y-1 ml-4">
                  {module.lessons.map((lesson) => (
                    <div 
                      key={lesson.id} 
                      className="flex items-center justify-between"
                    >
                      <span>{lesson.title}</span>
                      {lesson.completed ? (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => markComplete(lesson.id)}
                        >
                          Mark Complete
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
