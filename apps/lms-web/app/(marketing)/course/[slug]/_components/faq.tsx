"use client"

import { useState } from "react"
import { Plus, Minus } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

export default function CourseFAQSection() {
  const [expandedId, setExpandedId] = useState<number | null>(null)

  const faqs = [
    {
      id: 1,
      question: "How long does the course take to complete?",
      answer:
        "Most students complete the course in 4-6 weeks, studying 5-10 hours per week. However, you can learn at your own pace and access the materials anytime.",
    },
    {
      id: 2,
      question: "Is there a certificate upon completion?",
      answer:
        "Yes! Upon completing all modules and assessments, you'll receive a verified certificate that you can share on LinkedIn and your professional profiles.",
    },
    {
      id: 3,
      question: "Can I download course materials?",
      answer:
        "Yes, you can download all course materials, videos, and resources for offline access. This is included with your enrollment.",
    },
    {
      id: 4,
      question: "Is there a money-back guarantee?",
      answer:
        "We offer a 30-day money-back guarantee. If you're not satisfied with the course, simply request a refund within 30 days of enrollment.",
    },
    {
      id: 5,
      question: "Do I get lifetime access?",
      answer:
        "Yes! Once you enroll, you'll have lifetime access to all course materials, updates, and future content additions at no additional cost.",
    },
  ]

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h2 className="text-2xl font-bold">Frequently Asked Questions</h2>
      </div>

      <div className="space-y-3">
        {faqs.map((faq) => (
          <div
            key={faq.id}
            className="border border-border/40 rounded-lg overflow-hidden hover:border-border/60 transition-colors"
          >
            <button
              onClick={() => setExpandedId(expandedId === faq.id ? null : faq.id)}
              className="w-full px-4 py-4 flex items-center justify-between hover:bg-muted/30 transition-colors text-left"
            >
              <h3 className="font-semibold text-foreground">{faq.question}</h3>
              <HugeiconsIcon
                icon={expandedId === faq.id ? Minus : Plus}
                className="h-5 w-5 flex-shrink-0 text-muted-foreground"
              />
            </button>

            {expandedId === faq.id && (
              <div className="border-t border-border/40 bg-muted/20 px-4 py-4">
                <p className="text-foreground leading-relaxed">{faq.answer}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
