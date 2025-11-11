import type { Thing, WithContext } from 'schema-dts'

/**
 * Типы для Schema.org разметки
 * Используем Record для большей гибкости с нестандартными свойствами
 */
export type SchemaType = WithContext<Thing> | Record<string, any>

/**
 * Генерирует схему Organization для компании
 */
export function generateOrganizationSchema(): SchemaType {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'GradientSaaS',
    url: 'https://gradientsaas.com',
    logo: 'https://gradientsaas.com/logo.png',
    description: 'The most powerful SaaS platform with beautiful gradients. Scale your business, delight your customers, and grow faster than ever.',
    sameAs: [
      'https://twitter.com/gradientsaas',
      'https://linkedin.com/company/gradientsaas',
      'https://github.com/gradientsaas',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'Customer Support',
      email: 'support@gradientsaas.com',
      availableLanguage: ['en', 'ru'],
    },
  }
}

/**
 * Генерирует схему WebSite с поиском
 */
export function generateWebSiteSchema(): SchemaType {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'GradientSaaS',
    url: 'https://gradientsaas.com',
    description: 'The most powerful SaaS platform with beautiful gradients.',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://gradientsaas.com/search?q={search_term_string}',
      },
      'query-input': 'required name=search_term_string',
    },
  }
}

/**
 * Генерирует схему WebPage для конкретной страницы
 */
export function generateWebPageSchema(params: {
  name: string
  description: string
  url: string
}): SchemaType {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: params.name,
    description: params.description,
    url: params.url,
    isPartOf: {
      '@type': 'WebSite',
      name: 'GradientSaaS',
      url: 'https://gradientsaas.com',
    },
  }
}

/**
 * Генерирует схему SoftwareApplication для продукта
 */
export function generateSoftwareApplicationSchema(params: {
  minPrice: number
  maxPrice: number
}): SchemaType {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'GradientSaaS Platform',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web, iOS, Android',
    description: 'The most powerful SaaS platform with beautiful gradients. Scale your business and grow faster than ever.',
    offers: {
      '@type': 'AggregateOffer',
      lowPrice: params.minPrice,
      highPrice: params.maxPrice,
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
      priceValidUntil: new Date(new Date().getFullYear() + 1, 11, 31).toISOString().split('T')[0],
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      ratingCount: '1250',
      bestRating: '5',
      worstRating: '1',
    },
    featureList: [
      'Beautiful gradient UI',
      'Lightning-fast performance',
      'Advanced analytics dashboard',
      'Real-time collaboration',
      'Enterprise-grade security',
      '99.9% uptime SLA',
    ],
  }
}

/**
 * Интерфейс для плана подписки из Supabase
 */
export interface PricingPlan {
  id: string
  name: string
  price: number
  interval: 'month' | 'year'
  features: string[]
  is_active: boolean
}

/**
 * Генерирует схему Product для плана подписки
 */
export function generateProductSchema(plan: PricingPlan): SchemaType {
  const billingDuration = plan.interval === 'year' ? 'P1Y' : 'P1M'
  const pricePerMonth = plan.interval === 'year' ? Math.floor(plan.price / 12) : plan.price

  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: `${plan.name} Plan - GradientSaaS`,
    description: `GradientSaaS ${plan.name} subscription plan with ${plan.features.length} features`,
    brand: {
      '@type': 'Brand',
      name: 'GradientSaaS',
    },
    offers: {
      '@type': 'Offer',
      price: plan.price,
      priceCurrency: 'USD',
      priceValidUntil: new Date(new Date().getFullYear() + 1, 11, 31).toISOString().split('T')[0],
      availability: 'https://schema.org/InStock',
      url: `https://gradientsaas.com/#pricing`,
      seller: {
        '@type': 'Organization',
        name: 'GradientSaaS',
      },
      priceSpecification: {
        '@type': 'UnitPriceSpecification',
        price: plan.price,
        priceCurrency: 'USD',
        unitCode: billingDuration,
        billingDuration,
        referenceQuantity: {
          '@type': 'QuantitativeValue',
          value: 1,
          unitCode: billingDuration,
        },
      },
    },
    additionalProperty: plan.features.map((feature, index) => ({
      '@type': 'PropertyValue',
      name: `Feature ${index + 1}`,
      value: feature,
    })),
  }
}

/**
 * Генерирует массив схем Product для всех планов
 */
export function generateAllProductsSchema(plans: PricingPlan[]): SchemaType[] {
  return plans
    .filter(plan => plan.is_active)
    .map(plan => generateProductSchema(plan))
}

/**
 * Интерфейс для вопроса FAQ
 */
export interface FAQItem {
  question: string
  answer: string
}

/**
 * Генерирует схему FAQPage для часто задаваемых вопросов
 */
export function generateFAQPageSchema(faqs: FAQItem[]): SchemaType {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  }
}

/**
 * Генерирует схему BreadcrumbList для навигации
 */
export function generateBreadcrumbSchema(items: Array<{ name: string; url: string }>): SchemaType {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }
}

/**
 * Генерирует все основные схемы для главной страницы
 */
export function generateHomePageSchemas(plans: PricingPlan[] = []): SchemaType[] {
  const activePlans = plans.filter(plan => plan.is_active)
  const prices = activePlans.map(p => p.price).filter(p => p > 0)
  const minPrice = prices.length > 0 ? Math.min(...prices) : 29
  const maxPrice = prices.length > 0 ? Math.max(...prices) : 199

  return [
    generateOrganizationSchema(),
    generateWebSiteSchema(),
    generateWebPageSchema({
      name: 'GradientSaaS - Build Faster with Gradient Magic',
      description: 'The most powerful SaaS platform with beautiful gradients. Scale your business, delight your customers, and grow faster than ever.',
      url: 'https://gradientsaas.com',
    }),
    generateSoftwareApplicationSchema({ minPrice, maxPrice }),
    ...generateAllProductsSchema(activePlans),
  ]
}