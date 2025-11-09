'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { User } from '@supabase/supabase-js'
import { LogOut, User as UserIcon, Settings, BarChart, FolderOpen, Bell, MessageSquare } from 'lucide-react'
import Link from 'next/link'
import AIChat from '@/components/AIChat'
import MobileNavBar from './MobileNavBar'

interface DashboardClientProps {
  user: User
}

export default function DashboardClient({ user }: DashboardClientProps) {
  const router = useRouter()
  const supabase = createClient()
  const [activeTab, setActiveTab] = useState<'dashboard' | 'chat' | 'projects' | 'profile' | 'settings'>('chat')

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  // Обработчик для мобильной навигации
  const handleMobileTabChange = (tab: string) => {
    if (tab === 'home') {
      setActiveTab('dashboard')
    } else if (tab === 'chats') {
      setActiveTab('chat')
    } else if (tab === 'settings') {
      setActiveTab('settings')
    } else if (tab === 'profile') {
      setActiveTab('profile')
    }
  }

  // Конвертируем activeTab в формат для MobileNavBar
  const getMobileTab = () => {
    if (activeTab === 'dashboard') return 'home'
    if (activeTab === 'chat') return 'chats'
    return activeTab
  }

  return (
    <div className="h-full bg-gray-50 dark:bg-gray-900 flex flex-col">
      {/* Header - ФИКСИРОВАННЫЙ */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex-shrink-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <Link href="/" className="flex items-center space-x-2">
                <div className="w-10 h-10 gradient-primary rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-xl">G</span>
                </div>
                <span className="text-xl font-bold text-gradient-primary hidden sm:block">GradientSaaS</span>
              </Link>
            </div>

            <div className="flex items-center space-x-4">
              <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                <Bell className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              </button>
              
              <div className="flex items-center space-x-3 pl-4 border-l border-gray-200 dark:border-gray-700">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    {user.user_metadata?.full_name || 'User'}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {user.email}
                  </p>
                </div>
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold">
                    {user.user_metadata?.full_name?.[0] || user.email?.[0].toUpperCase()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main layout - РАСТЯГИВАЕТСЯ */}
      <div className="flex flex-1 overflow-hidden min-h-0">
        {/* Sidebar - ФИКСИРОВАННЫЙ С НЕЗАВИСИМЫМ СКРОЛЛОМ */}
        <aside className="hidden md:flex md:flex-shrink-0">
          <div className="flex flex-col w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
            {/* Навигация - ПРОКРУЧИВАЕТСЯ */}
            <div className="flex-1 overflow-y-auto pt-5 pb-4">
              <nav className="mt-5 flex-1 px-3 space-y-1">
                <button
                  onClick={() => setActiveTab('dashboard')}
                  className={`group flex items-center w-full px-3 py-3 text-sm font-medium rounded-lg transition-colors ${
                    activeTab === 'dashboard'
                      ? 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  <BarChart className="mr-3 h-5 w-5" />
                  Dashboard
                </button>

                <button
                  onClick={() => setActiveTab('chat')}
                  className={`group flex items-center w-full px-3 py-3 text-sm font-medium rounded-lg transition-colors ${
                    activeTab === 'chat'
                      ? 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  <MessageSquare className="mr-3 h-5 w-5" />
                  AI Chat
                </button>
                
                <button
                  onClick={() => setActiveTab('projects')}
                  className={`group flex items-center w-full px-3 py-3 text-sm font-medium rounded-lg transition-colors ${
                    activeTab === 'projects'
                      ? 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  <FolderOpen className="mr-3 h-5 w-5" />
                  Projects
                </button>
                
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`group flex items-center w-full px-3 py-3 text-sm font-medium rounded-lg transition-colors ${
                    activeTab === 'profile'
                      ? 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  <UserIcon className="mr-3 h-5 w-5" />
                  Profile
                </button>
                
                <button
                  onClick={() => setActiveTab('settings')}
                  className={`group flex items-center w-full px-3 py-3 text-sm font-medium rounded-lg transition-colors ${
                    activeTab === 'settings'
                      ? 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  <Settings className="mr-3 h-5 w-5" />
                  Settings
                </button>
              </nav>
            </div>
            
            {/* Sign Out - ВСЕГДА ВНИЗУ, ФИКСИРОВАННЫЙ */}
            <div className="flex-shrink-0 flex border-t border-gray-200 dark:border-gray-700 p-4">
              <button
                onClick={handleSignOut}
                className="flex-shrink-0 w-full group flex items-center px-3 py-3 text-sm font-medium rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
              >
                <LogOut className="mr-3 h-5 w-5" />
                Sign Out
              </button>
            </div>
          </div>
        </aside>

        {/* Main Content - ЗАПОЛНЯЕТ ОСТАВШЕЕСЯ ПРОСТРАНСТВО */}
        <main className="flex-1 overflow-hidden min-w-0">
          {activeTab === 'chat' ? (
            <AIChat user={user} />
          ) : activeTab === 'settings' ? (
            <div className="h-full overflow-y-auto p-6 lg:p-8">
              <div className="max-w-3xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Settings</h1>
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Appearance</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-700 dark:text-gray-300">Theme</span>
                        <span className="text-sm text-gray-500">Auto</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-700 dark:text-gray-300">Language</span>
                        <span className="text-sm text-gray-500">English</span>
                      </div>
                    </div>
                  </div>
                  <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Notifications</h3>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-700 dark:text-gray-300">Push Notifications</span>
                      <span className="text-sm text-gray-500">Enabled</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : activeTab === 'profile' ? (
            <div className="h-full overflow-y-auto p-6 lg:p-8">
              <div className="max-w-3xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Profile</h1>
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center space-x-6 mb-6">
                    <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-3xl">
                        {user.user_metadata?.full_name?.[0] || user.email?.[0].toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                        {user.user_metadata?.full_name || 'User'}
                      </h2>
                      <p className="text-gray-600 dark:text-gray-400">{user.email}</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm text-gray-500 dark:text-gray-400">Member Since</label>
                      <p className="text-gray-800 dark:text-white font-medium">
                        {new Date(user.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full overflow-y-auto p-6 lg:p-8">
              <div className="max-w-7xl mx-auto">
                {/* Welcome Section */}
                <div className="mb-8">
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    Welcome back, {user.user_metadata?.full_name || 'User'}! 👋
                  </h1>
                  <p className="text-gray-600 dark:text-gray-400">
                    Here's what's happening with your projects today.
                  </p>
                </div>

                {/* Stats Grid */}
                <div className="grid gap-6 mb-8 md:grid-cols-2 lg:grid-cols-4">
                  <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center">
                        <FolderOpen className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                      </div>
                      <span className="text-xs font-semibold text-green-600 dark:text-green-400">+12%</span>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">24</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Total Projects</p>
                  </div>

                  <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 bg-cyan-100 dark:bg-cyan-900/30 rounded-xl flex items-center justify-center">
                        <BarChart className="w-6 h-6 text-cyan-600 dark:text-cyan-400" />
                      </div>
                      <span className="text-xs font-semibold text-green-600 dark:text-green-400">+8%</span>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">1,842</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Total Views</p>
                  </div>

                  <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 bg-pink-100 dark:bg-pink-900/30 rounded-xl flex items-center justify-center">
                        <UserIcon className="w-6 h-6 text-pink-600 dark:text-pink-400" />
                      </div>
                      <span className="text-xs font-semibold text-green-600 dark:text-green-400">+23%</span>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">342</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Active Users</p>
                  </div>

                  <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-xl flex items-center justify-center">
                        <Settings className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                      </div>
                      <span className="text-xs font-semibold text-red-600 dark:text-red-400">-3%</span>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">12</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Pending Tasks</p>
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Recent Activity</h2>
                  <div className="space-y-4">
                    <div className="flex items-start space-x-4 p-4 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                      <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-lg flex items-center justify-center flex-shrink-0">
                        <FolderOpen className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          New project created
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          "Landing Page Redesign" was added to your workspace
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">2 hours ago</p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-4 p-4 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                      <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-orange-500 rounded-lg flex items-center justify-center flex-shrink-0">
                        <UserIcon className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          Team member joined
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Sarah Chen joined your team
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">5 hours ago</p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-4 p-4 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                      <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
                        <BarChart className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          Analytics updated
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Your weekly report is ready to view
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">1 day ago</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Liquid Glass Mobile Navigation - заменяет старую навигацию */}
      <MobileNavBar 
        activeTab={getMobileTab()} 
        onTabChange={handleMobileTabChange}
      />
    </div>
  )
}