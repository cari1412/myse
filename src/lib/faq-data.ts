/**
 * FAQ данные для использования в компоненте и Schema.org разметке
 */

export interface FAQItem {
  question: string
  answer: string
}

export const faqData: FAQItem[] = [
  {
    question: 'What is GradientSaaS?',
    answer: 'GradientSaaS is a modern SaaS platform designed to help businesses scale faster.',
  },
  {
    question: 'How does the free trial work?',
    answer: 'Our 14-day free trial gives you full access. No credit card required.',
  },
  {
    question: 'Can I change my plan later?',
    answer: 'Yes! You can upgrade or downgrade at any time.',
  },
  {
    question: 'What payment methods do you accept?',
    answer: 'We accept all major credit cards and PayPal.',
  },
  {
    question: 'Is my data secure?',
    answer: 'Security is our top priority. We use bank-level encryption.',
  },
]