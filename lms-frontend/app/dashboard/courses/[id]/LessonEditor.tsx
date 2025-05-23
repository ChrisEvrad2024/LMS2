'use client';
import { useState, useRef, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Plus, Trash2, Save, Video, Image, FileText } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import dynamic from 'next/dynamic';

const RichTextEditor = dynamic(
  () => import('@/components/ui/rich-text-editor'),
  { ssr: false }
);

export default function LessonEditor({ moduleId }: { moduleId: string }) {
  const [activeTab, setActiveTab] = useState('content');
  const [content, setContent] = useState<any[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: lesson, refetch } = useQuery({
    queryKey: ['lesson', moduleId],
    queryFn: async () => {
      const { data } = await axios.get(`/api/modules/${moduleId}/lesson`);
      if (data.lesson?.content) {
        setContent(JSON.parse(data.lesson.content));
      }
      return data.lesson;
    }
  });

  const { mutate: saveLesson } = useMutation({
    mutationFn: async (values: any) => {
      await axios.put(`/api/modules/${moduleId}/lesson`, values);
    },
    onSuccess: () => {
      toast({
        title: 'Lesson saved successfully',
        variant: 'default'
      });
      refetch();
    },
    onError: () => {
      toast({
        title: 'Failed to save lesson',
        variant: 'destructive'
      });
    }
  });

  const addContentBlock = (type: string) => {
    const newBlock = {
      id: crypto.randomUUID(),
      type,
      content: type === 'text' ? '' : {},
      order: content.length + 1
    };
    setContent([...content, newBlock]);
  };

  const updateContentBlock = (id: string, updates: any) => {
    setContent(content.map(block => 
      block.id === id ? { ...block, ...updates } : block
    ));
  };

  const removeContentBlock = (id: string) => {
    setContent(content.filter(block => block.id !== id));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        addContentBlock('file');
        updateContentBlock(content[content.length - 1].id, {
          content: {
            name: file.name,
            type: file.type,
            size: file.size,
            url: URL.createObjectURL(file)
          }
        });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab}>
      <TabsList>
        <TabsTrigger value="content">Content</TabsTrigger>
        <TabsTrigger value="settings">Settings</TabsTrigger>
        <TabsTrigger value="preview">Preview</TabsTrigger>
      </TabsList>

      <TabsContent value="content">
        <div className="space-y-6">
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              onClick={() => addContentBlock('text')}
            >
              <FileText className="mr-2 h-4 w-4" />
              Add Text
            </Button>
            <Button 
              variant="outline" 
              onClick={() => addContentBlock('video')}
            >
              <Video className="mr-2 h-4 w-4" />
              Add Video
            </Button>
            <Button 
              variant="outline" 
              onClick={() => fileInputRef.current?.click()}
            >
              <Image className="mr-2 h-4 w-4" />
              Add File
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                className="hidden"
              />
            </Button>
          </div>

          <div className="space-y-4">
            {content.map((block) => (
              <div key={block.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium capitalize">
                    {block.type}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeContentBlock(block.id)}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>

                {block.type === 'text' && (
                  <RichTextEditor
                    value={block.content}
                    onChange={(value) => 
                      updateContentBlock(block.id, { content: value })
                    }
                  />
                )}

                {block.type === 'video' && (
                  <div className="space-y-2">
                    <Label>Video URL</Label>
                    <Input
                      value={block.content?.url || ''}
                      onChange={(e) =>
                        updateContentBlock(block.id, {
                          content: { ...block.content, url: e.target.value }
                        })
                      }
                      placeholder="https://example.com/video.mp4"
                    />
                  </div>
                )}

                {block.type === 'file' && (
                  <div>
                    {block.content?.url ? (
                      <div className="flex items-center space-x-2">
                        <span>{block.content.name}</span>
                        <span>({Math.round(block.content.size / 1024)} KB)</span>
                      </div>
                    ) : (
                      <div>No file uploaded</div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>

          <Button
            onClick={() => 
              saveLesson({
                title: lesson?.title || 'New Lesson',
                content: JSON.stringify(content)
              })
            }
          >
            <Save className="mr-2 h-4 w-4" />
            Save Lesson
          </Button>
        </div>
      </TabsContent>

      <TabsContent value="settings">
        <div className="space-y-4">
          <div>
            <Label>Lesson Title</Label>
            <Input
              value={lesson?.title || ''}
              onChange={(e) =>
                saveLesson({
                  title: e.target.value,
                  content: JSON.stringify(content)
                })
              }
            />
          </div>

          <div>
            <Label>Duration (minutes)</Label>
            <Input
              type="number"
              value={lesson?.duration || 0}
              onChange={(e) =>
                saveLesson({
                  duration: parseInt(e.target.value),
                  content: JSON.stringify(content)
                })
              }
            />
          </div>
        </div>
      </TabsContent>

      <TabsContent value="preview">
        <div className="prose max-w-none">
          {content.map((block) => (
            <div key={block.id} className="mb-6">
              {block.type === 'text' && (
                <div dangerouslySetInnerHTML={{ __html: block.content }} />
              )}

              {block.type === 'video' && block.content?.url && (
                <div className="aspect-video bg-black">
                  <video controls className="w-full h-full">
                    <source src={block.content.url} />
                  </video>
                </div>
              )}

              {block.type === 'file' && block.content?.url && (
                <div className="border p-4 rounded-lg">
                  <a 
                    href={block.content.url} 
                    target="_blank"
                    className="text-blue-600 hover:underline"
                  >
                    Download {block.content.name}
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>
      </TabsContent>
    </Tabs>
  );
}
