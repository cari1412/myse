'use client'

import Link from 'next/link'
import { ArrowRight, Sparkles, Zap, Shield } from 'lucide-react'

export default function Hero() {
  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      <div className="absolute inset-0 gradient-animated opacity-20"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <div className="inline-flex items-center space-x-2 glass-gradient px-4 py-2 rounded-full mb-8">
          <Sparkles className="w-4 h-4 text-purple-600" />
          <span className="text-sm font-medium">Introducing GradientSaaS v2.0</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-bold mb-6">
          <span className="text-gray-900 dark:text-white">Build Faster with</span>
          <br />
          <span className="text-gradient-primary">Gradient Magic</span>
        </h1>

        <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 mb-12 max-w-3xl mx-auto">
          The most powerful SaaS platform with beautiful gradients. Scale your business and grow faster than ever.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
          <Link href="/signup" className="group px-8 py-4 gradient-primary text-white rounded-lg text-lg font-semibold hover:shadow-2xl hover:scale-105 transition-all flex items-center justify-center space-x-2">
            <span>Start Free Trial</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          <a href="#pricing" className="px-8 py-4 glass-gradient rounded-lg text-lg font-semibold hover:shadow-lg transition-all border border-gray-200">
            View Pricing
          </a>
        </div>

        <div className="flex flex-wrap justify-center gap-6">
          <div className="flex items-center space-x-2 glass-gradient px-4 py-2 rounded-full">
            <Zap className="w-4 h-4 text-yellow-500" />
            <span>Lightning Fast</span>
          </div>
          <div className="flex items-center space-x-2 glass-gradient px-4 py-2 rounded-full">
            <Shield className="w-4 h-4 text-green-500" />
            <span>Secure & Private</span>
          </div>
          <div className="flex items-center space-x-2 glass-gradient px-4 py-2 rounded-full">
            <Sparkles className="w-4 h-4 text-purple-500" />
            <span>Beautiful UI</span>
          </div>
        </div>
      </div>
    </section>
  )
}