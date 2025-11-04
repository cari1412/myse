'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  const faqs = [
    { question: 'What is GradientSaaS?', answer: 'GradientSaaS is a modern SaaS platform designed to help businesses scale faster.' },
    { question: 'How does the free trial work?', answer: 'Our 14-day free trial gives you full access. No credit card required.' },
    { question: 'Can I change my plan later?', answer: 'Yes! You can upgrade or downgrade at any time.' },
    { question: 'What payment methods do you accept?', answer: 'We accept all major credit cards and PayPal.' },
    { question: 'Is my data secure?', answer: 'Security is our top priority. We use bank-level encryption.' },
  ]

  return (
    <section id="faq" className="py-20 bg-white dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-gradient-primary">Frequently Asked</span> Questions
          </h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <div key={i} className="glass-gradient rounded-xl border border-gray-200 overflow-hidden">
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full px-6 py-5 flex items-center justify-between text-left"
              >
                <span className="text-lg font-semibold">{faq.question}</span>
                <ChevronDown className={`w-5 h-5 transition-transform ${openIndex === i ? 'rotate-180' : ''}`} />
              </button>
              {openIndex === i && (
                <div className="px-6 pb-5">
                  <p className="text-gray-600">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}