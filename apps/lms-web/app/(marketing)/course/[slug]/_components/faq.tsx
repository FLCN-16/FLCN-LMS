"use client"

import { useState } from "react"

import { Minus, Plus } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

interface CourseFAQProps {
  faq?: Array<{ question: string; answer: string }>
}

const DEFAULT_FAQS = [
  {
    question: "How long does the course take to complete?",
    answer:
      "Most students complete the course in 4-6 weeks, studying 5-10 hours per week. However, you can learn at your own pace and access the materials anytime.",
  },
  {
    question: "Is there a certificate upon completion?",
    answer:
      "Yes! Upon completing all modules and assessments, you'll receive a verified certificate that you can share on LinkedIn and your professional profiles.",
  },
  {
    question: "Can I download course materials?",
    answer:
      "Yes, you can download all course materials, videos, and resources for offline access. This is included with your enrollment.",
  },
  {
    question: "Is there a money-back guarantee?",
    answer:
      "We offer a 30-day money-back guarantee. If you're not satisfied with the course, simply request a refund within 30 days of enrollment.",
  },
  {
    question: "Do I get lifetime access?",
    answer:
      "Yes! Once you enroll, you'll have lifetime access to all course materials, updates, and future content additions at no additional cost.",
  },
]

export default function CourseFAQSection({ faq }: CourseFAQProps) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null)

  const items = faq && faq.length > 0 ? faq : DEFAULT_FAQS

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h2 className="text-2xl font-bold">Frequently Asked Questions</h2>
      </div>

      <div className="space-y-3">
        {items.map((item, index) => (
          <div
            key={index}
            className="overflow-hidden rounded-lg border border-border/40 transition-colors hover:border-border/60"
          >
            <button
              onClick={() =>
                setExpandedIndex(expandedIndex === index ? null : index)
              }
              className="flex w-full items-center justify-between px-4 py-4 text-left transition-colors hover:bg-muted/30"
            >
              <h3 className="font-semibold text-foreground">{item.question}</h3>
              <HugeiconsIcon
                icon={expandedIndex === index ? Minus : Plus}
                className="h-5 w-5 flex-shrink-0 text-muted-foreground"
              />
            </button>

            {expandedIndex === index && (
              <div className="border-t border-border/40 bg-muted/20 px-4 py-4">
                <p className="leading-relaxed text-foreground">{item.answer}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
