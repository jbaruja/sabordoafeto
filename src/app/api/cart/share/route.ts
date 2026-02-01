import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// Função para gerar código curto único
function generateShortCode(length: number = 7): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789' // Sem I, O, 0, 1 para evitar confusão
  let result = ''
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { items, customerInfo, subtotal } = body

    // Validações básicas
    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: 'Carrinho vazio' },
        { status: 400 }
      )
    }

    // Gerar código único
    let shortCode = generateShortCode()
    let attempts = 0
    const maxAttempts = 5

    // Tentar até 5 vezes se o código já existir
    while (attempts < maxAttempts) {
      const { data: existing } = await supabase
        .from('shared_carts')
        .select('id')
        .eq('short_code', shortCode)
        .single()

      if (!existing) break

      shortCode = generateShortCode()
      attempts++
    }

    if (attempts === maxAttempts) {
      return NextResponse.json(
        { error: 'Erro ao gerar código único' },
        { status: 500 }
      )
    }

    // Preparar dados do carrinho
    const cartData = {
      items: items.map((item: any) => ({
        product_id: item.id,
        product_name: item.name,
        quantity: item.quantity,
        price: item.price,
        image: item.image || null,
        customization: item.customization || null,
      })),
      subtotal,
    }

    // Salvar no Supabase
    const { data, error } = await supabase
      .from('shared_carts')
      .insert({
        short_code: shortCode,
        cart_data: cartData,
        customer_info: customerInfo,
        status: 'pending',
        views: 0,
      })
      .select()
      .single()

    if (error) {
      console.error('Erro ao salvar carrinho:', error)
      return NextResponse.json(
        { error: 'Erro ao salvar carrinho' },
        { status: 500 }
      )
    }

    // Gerar URL
    const baseUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000').replace(/\/$/, '')
    const url = `${baseUrl}/c/${shortCode}`

    return NextResponse.json({
      success: true,
      shortCode,
      url,
      cartId: data.id,
    })
  } catch (error) {
    console.error('Erro na API /api/cart/share:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
