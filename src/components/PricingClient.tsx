'use client'

import { useState } from 'react'
import { Check, Zap, Crown, Rocket } from 'lucide-react'

// Типы для данных из Supabase
interface PricingPlan {
  id: string
  name: string
  price: number
  interval: 'month' | 'year'
  features: string[]
  is_active: boolean
  created_at: string
  updated_at: string
}

// Конфигурация для UI (цвета, иконки и т.д.)
const planUIConfig: Record<string, {
  icon: any
  description: string
  gradient: string
  bgGradient: string
  darkBgGradient: string
  borderColor: string
  shadowColor: string
  popular: boolean
}> = {
  'Free': {
    icon: Zap,
    description: 'Perfect for getting started',
    gradient: 'gradient-ocean',
    bgGradient: 'bg-gradient-to-br from-blue-50 to-cyan-50',
    darkBgGradient: 'dark:from-blue-900/20 dark:to-cyan-900/20',
    borderColor: 'border-blue-500',
    shadowColor: 'shadow-blue-500/30',
    popular: false,
  },
  'Pro': {
    icon: Crown,
    description: 'For growing businesses',
    gradient: 'gradient-primary',
    bgGradient: 'bg-gradient-to-br from-purple-50 to-pink-50',
    darkBgGradient: 'dark:from-purple-900/20 dark:to-pink-900/20',
    borderColor: 'border-purple-500',
    shadowColor: 'shadow-purple-500/30',
    popular: true,
  },
  'Pro Yearly': {
    icon: Crown,
    description: 'For growing businesses',
    gradient: 'gradient-primary',
    bgGradient: 'bg-gradient-to-br from-purple-50 to-pink-50',
    darkBgGradient: 'dark:from-purple-900/20 dark:to-pink-900/20',
    borderColor: 'border-purple-500',
    shadowColor: 'shadow-purple-500/30',
    popular: true,
  },
  'Enterprise': {
    icon: Rocket,
    description: 'For large organizations',
    gradient: 'gradient-sunset',
    bgGradient: 'bg-gradient-to-br from-orange-50 to-yellow-50',
    darkBgGradient: 'dark:from-orange-900/20 dark:to-yellow-900/20',
    borderColor: 'border-orange-500',
    shadowColor: 'shadow-orange-500/30',
    popular: false,
  },
}

interface PricingClientProps {
  plans: PricingPlan[]
}

export default function PricingClient({ plans }: PricingClientProps) {
  const [isAnnual, setIsAnnual] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState<number | null>(() => {
    // Автоматически выбираем Pro план
    const proIndex = plans.findIndex(plan => plan.name === 'Pro')
    return proIndex !== -1 ? proIndex : null
  })

  // Фильтруем планы по выбранному интервалу (месяц/год)
  const filteredPlans = plans.filter(plan => {
    if (isAnnual) {
      return plan.interval === 'year' || plan.name === 'Free'
    } else {
      return plan.interval === 'month'
    }
  })

  // Если нет планов
  if (plans.length === 0) {
    return (
      <section id="pricing" className="py-20 bg-gray-50 dark:bg-gray-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-gray-600 dark:text-gray-400">No pricing plans available at the moment.</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="pricing" className="py-20 bg-gray-50 dark:bg-gray-800/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-gradient-primary">Simple</span> Pricing
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-3xl mx-auto">
            Choose the perfect plan for your needs. Always flexible to scale up or down.
          </p>

          <div className="inline-flex items-center glass-gradient p-1 rounded-full">
            <button
              onClick={() => setIsAnnual(false)}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                !isAnnual ? 'gradient-primary text-white shadow-lg' : 'text-gray-600 dark:text-gray-400'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setIsAnnual(true)}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                isAnnual ? 'gradient-primary text-white shadow-lg' : 'text-gray-600 dark:text-gray-400'
              }`}
            >
              Annual
              <span className="ml-2 text-xs bg-green-500 text-white px-2 py-1 rounded-full">
                Save 17%
              </span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {filteredPlans.map((plan, index) => {
            const uiConfig = planUIConfig[plan.name] || planUIConfig['Pro'] // Fallback to Pro config
            const Icon = uiConfig.icon
            const displayPrice = plan.interval === 'year' ? Math.floor(plan.price / 12) : plan.price

            return (
              <div
                key={plan.id}
                onClick={() => setSelectedPlan(index)}
                className={`
                  group relative cursor-pointer rounded-2xl p-8 border-2 transition-all duration-300
                  ${uiConfig.bgGradient} ${uiConfig.darkBgGradient}
                  ${selectedPlan === index 
                    ? `${uiConfig.borderColor} scale-105 shadow-2xl ${uiConfig.shadowColor}` 
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                  }
                  hover:scale-[1.02] hover:shadow-xl
                `}
              >
                {/* Popular Badge */}
                {uiConfig.popular && !isAnnual && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className={`${uiConfig.gradient} px-4 py-1 rounded-full text-white text-sm font-semibold shadow-lg`}>
                      Most Popular
                    </div>
                  </div>
                )}

                {/* Selected Badge */}
                {selectedPlan === index && (
                  <div className="absolute top-4 right-4">
                    <div className={`${uiConfig.gradient} w-8 h-8 rounded-full flex items-center justify-center shadow-lg animate-pulse`}>
                      <Check className="w-5 h-5 text-white" />
                    </div>
                  </div>
                )}

                {/* Icon with gradient background */}
                <div 
                  className={`
                    w-16 h-16 ${uiConfig.gradient} rounded-xl flex items-center justify-center mb-4 
                    group-hover:scale-110 transition-transform duration-200 shadow-lg
                  `}
                >
                  <Icon className="w-8 h-8 text-white" />
                </div>

                {/* Plan Name */}
                <h3 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">
                  {plan.name}
                </h3>

                {/* Plan Description */}
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  {uiConfig.description}
                </p>

                {/* Price */}
                <div className="mb-6">
                  <div className="flex items-baseline">
                    <span className="text-5xl font-bold text-gray-900 dark:text-white">
                      ${displayPrice}
                    </span>
                    <span className="text-gray-600 dark:text-gray-400 ml-2">
                      /month
                    </span>
                  </div>
                  {plan.interval === 'year' && (
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                      Billed annually (${plan.price}/year)
                    </p>
                  )}
                </div>

                {/* CTA Button */}
                <button
                  className={`
                    w-full py-3 rounded-lg font-semibold transition-all duration-200 mb-6
                    ${selectedPlan === index || uiConfig.popular
                      ? `${uiConfig.gradient} text-white hover:shadow-xl hover:scale-105`
                      : 'border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-gray-400 hover:shadow-lg'
                    }
                  `}
                >
                  {selectedPlan === index ? 'Selected Plan' : plan.price === 0 ? 'Get Started Free' : 'Get Started'}
                </button>

                {/* Features List */}
                <div className="space-y-3">
                  {plan.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-start">
                      <div className={`${uiConfig.gradient} rounded-full p-1 mr-3 flex-shrink-0`}>
                        <Check className="w-3 h-3 text-white" />
                      </div>
                      <span className="text-gray-600 dark:text-gray-400 text-sm">
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Hover Glow Effect */}
                <div className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none`}>
                  <div className={`absolute inset-0 ${uiConfig.gradient} opacity-10 rounded-2xl`}></div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Additional Info */}
        <div className="mt-16 text-center">
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            All plans include a 14-day free trial. No credit card required.
          </p>
          <a
            href="#faq"
            className="text-purple-600 hover:text-purple-700 dark:hover:text-purple-400 font-medium hover:underline"
          >
            Have questions? Check our FAQ
          </a>
        </div>
      </div>
    </section>
  )
}