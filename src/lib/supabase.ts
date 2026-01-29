import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase environment variables. Please check your .env.local file.'
  )
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
})

// Types para o banco de dados
export type Product = {
  id: string
  slug: string
  name: string
  description: string | null
  short_description: string | null
  price: number
  compare_at_price: number | null
  category: string
  tags: string[] | null
  stock_quantity: number
  is_available: boolean
  is_featured: boolean
  images: string[]
  featured_image: string | null
  ingredients: string[] | null
  allergens: string[] | null
  allows_customization: boolean
  created_at: string
  updated_at: string
}

export type SharedCart = {
  id: string
  short_code: string
  cart_data: {
    items: Array<{
      product_id: string
      product_name: string
      quantity: number
      price: number
      customization?: string
    }>
    subtotal: number
  }
  customer_info: {
    name: string
    phone: string
    email?: string
    delivery_date?: string
    notes?: string
  } | null
  status: 'pending' | 'contacted' | 'converted' | 'expired'
  views: number
  created_at: string
  expires_at: string
}
