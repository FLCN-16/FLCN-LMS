"use client"

import Link from "next/link"
import { useEffect, useState } from "react"

import { Button } from "@flcn-lms/ui/components/button"
import { Card } from "@flcn-lms/ui/components/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@flcn-lms/ui/components/tabs"
import { Textarea } from "@flcn-lms/ui/components/textarea"

interface CourseNotesPageProps {
  params: Promise<{ courseSlug: string }>
}

async function CourseNotesPage({ params }: CourseNotesPageProps) {
  const { courseSlug } = await params

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Course Notes</h1>
        <p className="mt-1 text-muted-foreground">
          Keep track of your learning with notes
        </p>
      </div>

      {/* Notes sections */}
      <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
        <div className="space-y-4">
          <Card className="p-6">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-semibold">Your Notes</label>
                <Textarea
                  placeholder="Write your notes here..."
                  className="mt-2 min-h-[300px]"
                  disabled
                />
                <p className="mt-2 text-xs text-muted-foreground">
                  Notes feature coming soon
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Sidebar with notes about lessons */}
        <aside className="space-y-4">
          <Card className="p-4">
            <h3 className="font-semibold mb-3">About Notes</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>📝 Write down key concepts</li>
              <li>🔍 Search your notes</li>
              <li>📎 Attach to lessons</li>
              <li>☁️ Auto-saved</li>
            </ul>
          </Card>
        </aside>
      </div>

      <Button asChild variant="outline">
        <Link href={`/learn/${courseSlug}`}>Back to Course</Link>
      </Button>
    </div>
  )
}

export default CourseNotesPage
