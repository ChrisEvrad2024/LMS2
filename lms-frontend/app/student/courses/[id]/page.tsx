'use client';
import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronRight, Play, BookOpen } from 'lucide-react';
import CourseProgress from './progress';
import Link from 'next/link';

export default function CoursePage() {
  const params = useParams();
  const courseId = params.id;

  const { data: course } = useQuery({
    queryKey: ['course', courseId],
    queryFn: async () => {
      const { data } = await axios.get(`/api/courses/${courseId}`);
      return data.course;
    }
  });

  if (!course) return <div>Loading...</div>;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">{course.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: course.description }} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Modules</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {course.modules.map((module) => (
              <div key={module.id} className="border rounded-lg overflow-hidden">
                <div className="p-4 bg-muted">
                  <h3 className="font-semibold text-lg">{module.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {module.lessons.length} lessons • {module.duration} min
                  </p>
                </div>
                <div className="divide-y">
                  {module.lessons.map((lesson) => (
                    <Link 
                      key={lesson.id} 
                      href={`/student/courses/${courseId}/lessons/${lesson.id}`}
                      className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="p-2 rounded-full bg-primary/10 text-primary">
                          {lesson.contentType === 'video' ? (
                            <Play className="h-4 w-4" />
                          ) : (
                            <BookOpen className="h-4 w-4" />
                          )}
                        </div>
                        <div>
                          <h4 className="font-medium">{lesson.title}</h4>
                          <p className="text-sm text-muted-foreground">
                            {lesson.duration} min • {lesson.contentType}
                          </p>
                        </div>
                      </div>
                      <ChevronRight className="h-5 w-5 text-muted-foreground" />
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        <CourseProgress />
        
        <Card>
          <CardHeader>
            <CardTitle>Resources</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {course.resources?.map((resource) => (
              <a
                key={resource.id}
                href={resource.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 p-2 rounded hover:bg-muted transition-colors"
              >
                <FileText className="h-4 w-4 text-primary" />
                <span>{resource.name}</span>
              </a>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
