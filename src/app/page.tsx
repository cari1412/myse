import type { Metadata } from 'next'
import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import About from '@/components/About'
import Pricing from '@/components/Pricing'
import FAQ from '@/components/FAQ'
import Footer from '@/components/Footer'
import StructuredData from '@/components/StructuredData'

export const metadata: Metadata = {
  title: 'Home',
}

export default function Home() {
  // Schema.org data for SEO and LLM
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'GradientSaaS',
    url: 'https://gradientsaas.com',
    logo: 'https://gradientsaas.com/logo.png',
    description: 'Modern SaaS platform with beautiful gradients',
  }

  const softwareSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'GradientSaaS Platform',
    applicationCategory: 'BusinessApplication',
    offers: {
      '@type': 'AggregateOffer',
      lowPrice: '29',
      highPrice: '199',
      priceCurrency: 'USD',
    },
  }

  return (
    <>
      <StructuredData data={organizationSchema} />
      <StructuredData data={softwareSchema} />
      <Navbar />
      <main className="min-h-screen">
        <Hero />
        <About />
        <Pricing />
        <FAQ />
      </main>
      <Footer />
    </>
  )
}