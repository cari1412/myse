'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="fixed top-0 w-full z-50 glass-gradient border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 gradient-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">G</span>
            </div>
            <span className="text-xl font-bold text-gradient-primary">GradientSaaS</span>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            <a href="#home" className="text-gray-700 dark:text-gray-300 hover:text-purple-600">Home</a>
            <a href="#about" className="text-gray-700 dark:text-gray-300 hover:text-purple-600">About</a>
            <a href="#pricing" className="text-gray-700 dark:text-gray-300 hover:text-purple-600">Pricing</a>
            <a href="#faq" className="text-gray-700 dark:text-gray-300 hover:text-purple-600">FAQ</a>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <Link href="/login" className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-purple-600">
              Log In
            </Link>
            <Link href="/signup" className="px-6 py-2 gradient-primary text-white rounded-lg hover:shadow-lg transition-all">
              Sign Up
            </Link>
          </div>

          <button onClick={() => setIsOpen(!isOpen)} className="md:hidden">
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden glass-gradient border-t border-white/10">
          <div className="px-4 pt-2 pb-4 space-y-2">
            <a href="#home" className="block px-4 py-2 rounded-lg hover:bg-gray-100" onClick={() => setIsOpen(false)}>Home</a>
            <a href="#about" className="block px-4 py-2 rounded-lg hover:bg-gray-100" onClick={() => setIsOpen(false)}>About</a>
            <a href="#pricing" className="block px-4 py-2 rounded-lg hover:bg-gray-100" onClick={() => setIsOpen(false)}>Pricing</a>
            <a href="#faq" className="block px-4 py-2 rounded-lg hover:bg-gray-100" onClick={() => setIsOpen(false)}>FAQ</a>
            <Link href="/login" className="block w-full px-4 py-2 text-center border rounded-lg">Log In</Link>
            <Link href="/signup" className="block w-full px-4 py-2 text-center gradient-primary text-white rounded-lg">Sign Up</Link>
          </div>
        </div>
      )}
    </nav>
  )
}