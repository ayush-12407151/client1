"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Loader2, Plus, Trash2 } from "lucide-react";

export default function CreateCoursePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [sections, setSections] = useState([
    { title: "", lessons: [{ title: "", youtubeUrl: "", isFreePreview: false }] }
  ]);
  
  const addSection = () => {
    setSections([...sections, { title: "", lessons: [{ title: "", youtubeUrl: "", isFreePreview: false }] }]);
  };

  const addLesson = (sectionIndex: number) => {
    const newSections = [...sections];
    newSections[sectionIndex].lessons.push({ title: "", youtubeUrl: "", isFreePreview: false });
    setSections(newSections);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Placeholder for actual API submission
    setTimeout(() => {
      setLoading(false);
      router.push("/instructor/courses");
    }, 1000);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Create New Course</h1>
        <p className="text-gray-500 mt-2">Fill in the details to publish a new course.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Basic Details</CardTitle>
            <CardDescription>Main information about your course</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Course Title</Label>
              <Input required placeholder="e.g. Advanced Web Development 2026" />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea required placeholder="Detailed explanation of what students will learn..." rows={5} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Category</Label>
                <Input required placeholder="e.g. Programming" />
              </div>
              <div className="space-y-2">
                <Label>Price ($)</Label>
                <Input type="number" required placeholder="0 for free" min={0} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Curriculum</CardTitle>
              <CardDescription>Add sections and YouTube Unlisted links for lessons.</CardDescription>
            </div>
            <Button type="button" onClick={addSection} variant="outline" size="sm">
              <Plus className="w-4 h-4 mr-2" /> Add Section
            </Button>
          </CardHeader>
          <CardContent className="space-y-6">
            {sections.map((section, sIdx) => (
              <div key={sIdx} className="border rounded-lg p-4 bg-gray-50/50">
                <div className="mb-4">
                  <Label>Section Title</Label>
                  <Input placeholder="e.g. Getting Started" className="mt-1" />
                </div>
                
                <div className="space-y-4 pl-4 border-l-2 border-blue-200">
                  {section.lessons.map((lesson, lIdx) => (
                    <div key={lIdx} className="flex gap-4 items-start">
                      <div className="flex-1 space-y-3">
                        <Input placeholder="Lesson Title" />
                        <Input placeholder="YouTube Unlisted URL" />
                      </div>
                      <Button variant="ghost" size="icon" className="text-red-500" type="button">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                  <Button type="button" onClick={() => addLesson(sIdx)} variant="ghost" size="sm" className="text-blue-600">
                    <Plus className="w-4 h-4 mr-2" /> Add Lesson
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
          <Button type="submit" className="bg-blue-600 hover:bg-blue-700" disabled={loading}>
            {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : "Publish Course"}
          </Button>
        </div>
      </form>
    </div>
  );
}
