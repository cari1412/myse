'use client'

import { Home, MessageSquare, Settings, User } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'

interface MobileNavBarProps {
  activeTab: string
  onTabChange: (tab: string) => void
}

export default function MobileNavBar({ activeTab, onTabChange }: MobileNavBarProps) {
  const pathname = usePathname()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const navItems = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'chats', icon: MessageSquare, label: 'Chats' },
    { id: 'settings', icon: Settings, label: 'Settings' },
    { id: 'profile', icon: User, label: 'Profile' },
  ]

  if (!mounted) return null

  return (
    <>
      {/* Spacer для контента чтобы не перекрывался навигацией */}
      <div className="h-20 md:hidden" />
      
      {/* Liquid Glass Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
        {/* Gradient Background Glow */}
        <div className="absolute inset-0 bg-gradient-to-t from-purple-500/20 via-transparent to-transparent pointer-events-none" 
             style={{ height: '120px', bottom: '0' }} />
        
        {/* Main Navigation Container */}
        <div className="relative mx-4 mb-6">
          {/* Liquid Glass Effect */}
          <div className="liquid-glass-nav rounded-[28px] px-4 py-2.5 shadow-2xl">
            {/* Navigation Items */}
            <div className="flex items-center justify-around relative">
              {navItems.map((item) => {
                const isActive = activeTab === item.id
                const Icon = item.icon
                
                return (
                  <button
                    key={item.id}
                    onClick={() => onTabChange(item.id)}
                    className="relative flex flex-col items-center justify-center py-2 px-4 group transition-all duration-300"
                  >
                    {/* Active Indicator Background */}
                    {isActive && (
                      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-500/30 to-pink-500/30 blur-xl transition-all duration-500" />
                    )}
                    
                    {/* Icon Container with Glass Effect */}
                    <div className={`
                      relative z-10 flex items-center justify-center w-12 h-12 rounded-2xl transition-all duration-300
                      ${isActive 
                        ? 'bg-gradient-to-br from-purple-500 to-pink-500 shadow-lg shadow-purple-500/50 scale-110' 
                        : 'bg-white/10 group-hover:bg-white/20 group-active:scale-95'
                      }
                    `}>
                      <Icon 
                        className={`w-5 h-5 transition-all duration-300 ${
                          isActive 
                            ? 'text-white' 
                            : 'text-gray-400 group-hover:text-gray-300'
                        }`}
                        strokeWidth={isActive ? 2.5 : 2}
                      />
                    </div>
                    
                    {/* Label */}
                    <span className={`
                      relative z-10 mt-1 text-[10px] font-medium transition-all duration-300
                      ${isActive 
                        ? 'text-white font-semibold' 
                        : 'text-gray-400 group-hover:text-gray-300'
                      }
                    `}>
                      {item.label}
                    </span>
                    
                    {/* Ripple Effect on Click */}
                    <div className="absolute inset-0 rounded-2xl overflow-hidden">
                      <div className={`
                        absolute inset-0 bg-white/20 transition-transform duration-300 scale-0 group-active:scale-100
                      `} />
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
          
          {/* Bottom Shadow/Reflection */}
          <div className="absolute -bottom-2 left-4 right-4 h-8 bg-gradient-to-b from-black/10 to-transparent rounded-full blur-xl" />
        </div>
        
        {/* Safe Area Padding для iPhone */}
        <div className="h-[env(safe-area-inset-bottom)] bg-gradient-to-t from-black/5 to-transparent backdrop-blur-xl" />
      </nav>
    </>
  )
}