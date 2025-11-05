import { createClient } from '@/lib/supabase/server'
import PricingClient from './PricingClient'

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

  // Передаем данные в клиентский компонент
  return <PricingClient plans={plans || []} />
}