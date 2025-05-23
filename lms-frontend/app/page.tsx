import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

export default function Home() {
  return (
    <main className="container mx-auto py-8">
      <div className="flex flex-col items-center justify-center min-h-[80vh]">
        <Card className="w-full max-w-2xl">
          <CardHeader>
            <CardTitle>Learning Management System</CardTitle>
            <CardDescription>
              A complete platform for online education
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="flex gap-4">
              <Button variant="default">Get Started</Button>
              <Button variant="outline">Learn More</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
