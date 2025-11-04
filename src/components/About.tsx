'use client'

import { Target, Users, Award, TrendingUp } from 'lucide-react'

export default function About() {
  const features = [
    { icon: Target, title: 'Mission Driven', description: 'Helping businesses scale with modern technology.', gradient: 'gradient-ocean' },
    { icon: Users, title: 'Customer First', description: 'Your success is our success.', gradient: 'gradient-sunset' },
    { icon: Award, title: 'Award Winning', description: 'Recognized for excellence in design.', gradient: 'gradient-forest' },
    { icon: TrendingUp, title: 'Rapid Growth', description: 'Join thousands of growing companies.', gradient: 'gradient-purple-dream' },
  ]

  const stats = [
    { value: '10K+', label: 'Active Users' },
    { value: '99.9%', label: 'Uptime' },
    { value: '50+', label: 'Countries' },
    { value: '24/7', label: 'Support' },
  ]

  return (
    <section id="about" className="py-20 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-gradient-primary">About</span> Our Platform
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Built by developers, for developers. We create tools that make your work easier.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20">
          {stats.map((stat, i) => (
            <div key={i} className="text-center glass-gradient p-6 rounded-xl hover-gradient-scale">
              <div className="text-4xl md:text-5xl font-bold text-gradient-primary mb-2">{stat.value}</div>
              <div className="text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, i) => (
            <div key={i} className="glass-gradient p-8 rounded-2xl hover-gradient-scale border border-gray-200">
              <div className={`w-14 h-14 ${feature.gradient} rounded-xl flex items-center justify-center mb-6`}>
                <feature.icon className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}