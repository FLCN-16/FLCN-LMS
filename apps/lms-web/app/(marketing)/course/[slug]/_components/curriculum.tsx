"use client"

import { ChevronDown } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useState } from "react"

import { type CurriculumModule } from "@/fetchers/marketing"

function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  if (h > 0) return `${h}h ${m}m`
  return `${m}m`
}

interface CourseCurriculumSectionProps {
  modules: CurriculumModule[]
}

export default function CourseCurriculumSection({
  modules,
}: CourseCurriculumSectionProps) {
  const [expandedModule, setExpandedModule] = useState<string | null>(null)

  if (!modules || modules.length === 0) {
    return (
      <div className="flex flex-col">
        <div className="border-b border-border/20 pb-8">
          <h2 className="text-3xl font-bold tracking-tight">Curriculum</h2>
          <p className="mt-3 text-base leading-relaxed text-muted-foreground">
            Curriculum details coming soon.
          </p>
        </div>
      </div>
    )
  }

  const totalLessons = modules.reduce((sum, m) => sum + m.lesson_count, 0)
  const totalSeconds = modules.reduce(
    (sum, m) => sum + m.lessons.reduce((s, l) => s + l.duration_seconds, 0),
    0
  )

  return (
    <div className="flex flex-col">
      <div className="border-b border-border/20 pb-8">
        <h2 className="text-3xl font-bold tracking-tight">Curriculum</h2>
        <p className="mt-3 text-base leading-relaxed text-muted-foreground">
          {modules.length} modules · {totalLessons} lessons
          {totalSeconds > 0 && ` · ${formatDuration(totalSeconds)} total`}
        </p>
      </div>

      <div className="py-8">
        <div className="space-y-4">
          {modules.map((module, index) => (
            <div key={module.id} className="group">
              <button
                onClick={() =>
                  setExpandedModule(
                    expandedModule === module.id ? null : module.id
                  )
                }
                className="w-full text-left transition-all duration-200"
              >
                <div className="flex items-start gap-4 rounded-lg border border-border/30 p-5 transition-all duration-200 hover:border-border/50 hover:bg-muted/40">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-md bg-gradient-to-br from-blue-500/20 to-cyan-500/20 text-sm font-semibold text-blue-600 dark:text-blue-400">
                    {index + 1}
                  </div>

                  <div className="min-w-0 flex-1">
                    <h3 className="text-lg leading-tight font-semibold text-foreground">
                      Module {index + 1}: {module.title}
                    </h3>
                    {module.description && (
                      <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                        {module.description}
                      </p>
                    )}
                  </div>

                  <div className="ml-2 flex flex-shrink-0 items-center gap-4">
                    <div className="text-right">
                      <div className="text-sm font-medium text-foreground">
                        {module.lesson_count} lessons
                      </div>
                      {module.lessons.length > 0 && totalSeconds > 0 && (
                        <div className="mt-1 text-xs text-muted-foreground">
                          {formatDuration(
                            module.lessons.reduce(
                              (s, l) => s + l.duration_seconds,
                              0
                            )
                          )}
                        </div>
                      )}
                    </div>
                    <HugeiconsIcon
                      icon={ChevronDown}
                      className={`h-5 w-5 flex-shrink-0 text-muted-foreground transition-transform duration-300 group-hover:text-foreground ${
                        expandedModule === module.id ? "rotate-180" : ""
                      }`}
                    />
                  </div>
                </div>
              </button>

              {expandedModule === module.id && module.lessons.length > 0 && (
                <div className="mt-3 animate-in overflow-hidden rounded-lg border border-border/20 bg-gradient-to-br from-blue-50/50 to-cyan-50/30 p-6 duration-300 fade-in slide-in-from-top-2 dark:from-blue-950/20 dark:to-cyan-950/10">
                  <div className="space-y-3">
                    {module.lessons.map((lesson, i) => (
                      <div
                        key={lesson.id}
                        className="group/lesson flex items-center gap-3 opacity-80 transition-opacity hover:opacity-100"
                      >
                        <span className="w-6 text-xs font-semibold text-blue-600 dark:text-blue-400">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <span className="flex-1 text-sm font-medium text-foreground">
                          {lesson.title}
                        </span>
                        {lesson.duration_seconds > 0 && (
                          <span className="flex-shrink-0 text-xs text-muted-foreground">
                            {formatDuration(lesson.duration_seconds)}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {index < modules.length - 1 && <div className="h-2" />}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
