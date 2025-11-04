'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Menu, X, LogOut } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { User } from '@supabase/supabase-js'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      setLoading(false)
    }

    getUser()

    // Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [supabase.auth])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

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
            <a href="#home" className="text-gray-700 dark:text-gray-300 hover:text-purple-600 transition-colors">Home</a>
            <a href="#about" className="text-gray-700 dark:text-gray-300 hover:text-purple-600 transition-colors">About</a>
            <a href="#pricing" className="text-gray-700 dark:text-gray-300 hover:text-purple-600 transition-colors">Pricing</a>
            <a href="#faq" className="text-gray-700 dark:text-gray-300 hover:text-purple-600 transition-colors">FAQ</a>
          </div>

          {/* Auth Buttons - Desktop */}
          <div className="hidden md:flex items-center space-x-4">
            {loading ? (
              <div className="w-24 h-10 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
            ) : user ? (
              <>
                <Link 
                  href="/dashboard" 
                  className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-purple-600 transition-colors"
                >
                  Dashboard
                </Link>
                <button
                  onClick={handleSignOut}
                  className="px-6 py-2 flex items-center space-x-2 border-2 border-purple-600 text-purple-600 rounded-lg hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-all"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-purple-600 transition-colors">
                  Log In
                </Link>
                <Link href="/signup" className="px-6 py-2 gradient-primary text-white rounded-lg hover:shadow-lg transition-all">
                  Sign Up
                </Link>
              </>
            )}
          </div>

          <button onClick={() => setIsOpen(!isOpen)} className="md:hidden">
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden glass-gradient border-t border-white/10">
          <div className="px-4 pt-2 pb-4 space-y-2">
            <a href="#home" className="block px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors" onClick={() => setIsOpen(false)}>Home</a>
            <a href="#about" className="block px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors" onClick={() => setIsOpen(false)}>About</a>
            <a href="#pricing" className="block px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors" onClick={() => setIsOpen(false)}>Pricing</a>
            <a href="#faq" className="block px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors" onClick={() => setIsOpen(false)}>FAQ</a>
            
            <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
              {loading ? (
                <div className="w-full h-10 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
              ) : user ? (
                <>
                  <Link 
                    href="/dashboard" 
                    className="block w-full px-4 py-2 text-center border rounded-lg mb-2 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={() => {
                      handleSignOut()
                      setIsOpen(false)
                    }}
                    className="flex items-center justify-center space-x-2 w-full px-4 py-2 border-2 border-purple-600 text-purple-600 rounded-lg hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login" className="block w-full px-4 py-2 text-center border rounded-lg mb-2" onClick={() => setIsOpen(false)}>
                    Log In
                  </Link>
                  <Link href="/signup" className="block w-full px-4 py-2 text-center gradient-primary text-white rounded-lg" onClick={() => setIsOpen(false)}>
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}