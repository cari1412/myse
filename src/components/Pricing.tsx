import { createClient } from '@/lib/supabase/server'
import PricingClient from './PricingClient'
import StructuredData from './StructuredData'
import { generateAllProductsSchema } from '@/lib/schema'

export default async function Pricing() {
  const supabase = await createClient()

  // Загружаем планы на сервере
  const { data: plans, error } = await supabase
    .from('pricing_plans')
    .select('*')
    .eq('is_active', true)
    .order('price', { ascending: true })

  if (error) {
    console.error('Error loading pricing plans:', error)
  }

  // Генерируем Schema.org разметку для всех планов
  const productSchemas = plans ? generateAllProductsSchema(plans) : []

  return (
    <>
      {/* Schema.org разметка для каждого плана подписки */}
      {productSchemas.length > 0 && <StructuredData data={productSchemas} />}
      
      {/* Передаем данные в клиентский компонент */}
      <PricingClient plans={plans || []} />
    </>
  )
}