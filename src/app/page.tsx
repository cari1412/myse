import type { Metadata } from 'next'
import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import About from '@/components/About'
import Pricing from '@/components/Pricing'
import FAQ from '@/components/FAQ'
import Footer from '@/components/Footer'
import StructuredData from '@/components/StructuredData'
import { generateHomePageSchemas, generateFAQPageSchema } from '@/lib/schema'
import { faqData } from '@/lib/faq-data'
import { createClient } from '@/lib/supabase/server'

export const metadata: Metadata = {
  title: 'Home',
}

export default async function Home() {
  const supabase = await createClient()

  // Загружаем планы из Supabase для генерации Schema.org разметки
  const { data: plans } = await supabase
    .from('pricing_plans')
    .select('*')
    .eq('is_active', true)
    .order('price', { ascending: true })

  // Генерируем все схемы для главной страницы
  // Включает: Organization, WebSite, WebPage, SoftwareApplication, и все Product схемы
  const schemas = generateHomePageSchemas(plans || [])
  
  // Добавляем FAQ схему
  const faqSchema = generateFAQPageSchema(faqData)

  return (
    <>
      {/* Schema.org микроразметка для SEO и LLM */}
      <StructuredData data={[...schemas, faqSchema]} />
      
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