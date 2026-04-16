"use client"

import { useState } from "react"
import { ChevronDown } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

export default function CourseCurriculumSection() {
  const [expandedModule, setExpandedModule] = useState<number | null>(null)

  const modules = [
    {
      id: 1,
      title: "Getting Started",
      lessons: 5,
      duration: "1h 30m",
      description: "Introduction and setup fundamentals",
    },
    {
      id: 2,
      title: "Core Concepts",
      lessons: 8,
      duration: "3h 45m",
      description: "Essential concepts and theory",
    },
    {
      id: 3,
      title: "Practical Projects",
      lessons: 12,
      duration: "6h 20m",
      description: "Hands-on projects and real-world applications",
    },
  ]

  const totalLessons = modules.reduce((sum, m) => sum + m.lessons, 0)

  return (
    <div className="flex flex-col">
      {/* Header with generous spacing */}
      <div className="pb-8 border-b border-border/20">
        <h2 className="text-3xl font-bold tracking-tight">Curriculum</h2>
        <p className="mt-3 text-base text-muted-foreground leading-relaxed">
          Learn through {modules.length} modules and {totalLessons} carefully structured lessons
        </p>
      </div>

      {/* Module list with varied rhythm */}
      <div className="py-8">
        <div className="space-y-4">
          {modules.map((module, index) => (
            <div key={module.id} className="group">
              {/* Module card */}
              <button
                onClick={() =>
                  setExpandedModule(expandedModule === module.id ? null : module.id)
                }
                className="w-full text-left transition-all duration-200"
              >
                {/* Tight header group */}
                <div className="flex items-start gap-4 p-5 rounded-lg border border-border/30 hover:border-border/50 hover:bg-muted/40 transition-all duration-200">
                  {/* Module number badge */}
                  <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-md bg-gradient-to-br from-blue-500/20 to-cyan-500/20 text-blue-600 dark:text-blue-400 font-semibold text-sm">
                    {index + 1}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold leading-tight text-foreground">
                      Module {index + 1}: {module.title}
                    </h3>
                    <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                      {module.description}
                    </p>
                  </div>

                  {/* Metadata */}
                  <div className="flex-shrink-0 flex items-center gap-4 ml-2">
                    <div className="text-right">
                      <div className="text-sm font-medium text-foreground">
                        {module.lessons} lessons
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {module.duration}
                      </div>
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

              {/* Expanded lessons section with generous reveal */}
              {expandedModule === module.id && (
                <div className="mt-3 rounded-lg border border-border/20 bg-gradient-to-br from-blue-50/50 to-cyan-50/30 dark:from-blue-950/20 dark:to-cyan-950/10 p-6 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-300">
                  <div className="space-y-3">
                    {Array.from({ length: module.lessons }).map((_, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-3 group/lesson hover:opacity-100 opacity-80 transition-opacity"
                      >
                        <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 w-6">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <span className="text-sm text-foreground font-medium">
                          Lesson {i + 1}
                        </span>
                        <div className="flex-1 h-px bg-border/20 group-hover/lesson:bg-border/40 transition-colors" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Spacing between modules */}
              {index < modules.length - 1 && <div className="h-2" />}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
