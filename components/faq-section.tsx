"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"

const faqs = [
  {
    question: "What is HSSC CET and why should I prepare with your platform?",
    answer:
      "HSSC CET (Haryana Staff Selection Commission Common Eligibility Test) is a qualifying exam for various government jobs in Haryana. Our platform provides comprehensive preparation with 10,000+ questions, real exam simulation, and detailed analytics to maximize your chances of success.",
  },
  {
    question: "How are your mock tests different from others?",
    answer:
      "Our mock tests are designed by experts who have analyzed years of HSSC CET patterns. Each test mirrors the actual exam in terms of difficulty, question types, and time constraints. Plus, you get detailed solutions and performance analytics after every test.",
  },
  {
    question: "Can I access the platform on my mobile device?",
    answer:
      "Yes! Our platform is fully responsive and optimized for all devices. You can practice tests, review solutions, and track your progress seamlessly on your smartphone, tablet, or computer.",
  },
  {
    question: "What happens after my subscription ends?",
    answer:
      "Your progress and performance data are saved even after your subscription ends. You can still access basic features with a free account. Renew anytime to unlock all premium features again.",
  },
  {
    question: "Do you offer refunds if I'm not satisfied?",
    answer:
      "Yes, we offer a 7-day money-back guarantee. If you're not satisfied with our platform within the first 7 days of your purchase, contact our support team for a full refund.",
  },
  {
    question: "How often is the question bank updated?",
    answer:
      "Our content team updates the question bank regularly based on the latest exam patterns and trends. We add new questions every week and update existing ones to ensure relevance.",
  },
]

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <section id="faq" className="py-20 scroll-mt-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            FAQs
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 text-balance">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-muted-foreground">Got questions? We've got answers.</p>
        </div>

        {/* FAQ Items */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="border border-border rounded-xl overflow-hidden bg-card">
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full flex items-center justify-between p-5 text-left hover:bg-muted/50 transition-colors"
              >
                <span className="font-medium text-foreground pr-4">{faq.question}</span>
                <ChevronDown
                  className={`w-5 h-5 text-muted-foreground flex-shrink-0 transition-transform duration-300 ${
                    openIndex === index ? "rotate-180" : ""
                  }`}
                />
              </button>
              <div
                className={`overflow-hidden transition-all duration-300 ${
                  openIndex === index ? "max-h-96" : "max-h-0"
                }`}
              >
                <p className="px-5 pb-5 text-muted-foreground leading-relaxed">{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
