import { notFound } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { MessageCircle, Calendar, User, Phone, Mail, Package, Heart, ShoppingBag } from 'lucide-react'
import { Button } from '@/components/ui/button'

// Force dynamic rendering - essential for this route to work
export const dynamic = 'force-dynamic'
export const revalidate = 0

async function getSharedCart(code: string) {
  console.log('Fetching cart with code:', code)

  const { data: cart, error } = await supabase
    .from('shared_carts')
    .select('*')
    .eq('short_code', code)
    .single()

  console.log('Cart result:', { cart, error })

  if (error || !cart) {
    return null
  }

  await supabase
    .from('shared_carts')
    .update({ views: cart.views + 1 })
    .eq('id', cart.id)

  return cart
}

export default async function SharedCartPage(props: { params: Promise<{ code: string }> }) {
  const params = await props.params
  const cart = await getSharedCart(params.code)

  if (!cart) {
    notFound()
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(price)
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return null
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(date)
  }

  const statusLabels = {
    pending: 'Aguardando Contato',
    contacted: 'Em Atendimento',
    converted: 'Pedido Confirmado',
    expired: 'Expirado',
  }

  const statusColors = {
    pending: 'bg-amber-100 text-amber-700 border-amber-200',
    contacted: 'bg-primary-sage/10 text-primary-sage border-primary-sage/20',
    converted: 'bg-green-100 text-green-700 border-green-200',
    expired: 'bg-gray-100 text-gray-600 border-gray-200',
  }

  const cartData = cart.cart_data as {
    items: Array<{
      product_id: string
      product_name: string
      quantity: number
      price: number
      image?: string
      customization?: string
    }>
    subtotal: number
  }

  const customerInfo = cart.customer_info as {
    name: string
    phone: string
    email?: string
    deliveryDate?: string
    notes?: string
  } | null

  const whatsappMessage = `Olá! Vi o carrinho #${params.code.toUpperCase()} e gostaria de continuar com o pedido`
  const whatsappUrl = `https://wa.me/5547991044121?text=${encodeURIComponent(whatsappMessage)}`

  return (
    <div className="min-h-screen bg-neutral-snow">
      {/* Hero Section */}
      <section className="relative py-20 md:py-28 overflow-hidden">
        {/* Mesh Gradients */}
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-primary-sage opacity-[0.08] rounded-full blur-[100px] -translate-x-1/3 -translate-y-1/3"></div>
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-secondary-rose opacity-[0.06] rounded-full blur-[80px] translate-x-1/4 translate-y-1/4"></div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            {/* Logo */}
            <Link href="/" className="inline-flex items-center gap-2 group">
              <Heart className="w-8 h-8 text-secondary-rose fill-current" />
              <span className="font-primary text-2xl font-light text-text-primary">
                <span className="text-secondary-rose">Sabor</span> do Afeto
              </span>
            </Link>

            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-glass-white backdrop-blur-md rounded-full shadow-soft border border-primary-sage/10">
              <ShoppingBag className="w-4 h-4 text-primary-sage" />
              <span className="font-secondary font-medium text-text-primary">
                Carrinho #{params.code.toUpperCase()}
              </span>
            </div>

            {/* Title */}
            <h1 className="font-primary text-4xl md:text-5xl font-light text-text-primary">
              Seu <span className="text-primary-sage">Carrinho</span> Compartilhado
            </h1>

            {/* Status */}
            <div className="flex justify-center">
              <span
                className={`inline-block px-4 py-2 rounded-full border font-secondary text-sm font-medium ${statusColors[cart.status as keyof typeof statusColors]}`}
              >
                {statusLabels[cart.status as keyof typeof statusLabels]}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Conteúdo Principal */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-8">

            {/* Coluna Principal - Produtos */}
            <div className="md:col-span-2 space-y-6">
              {/* Card de Produtos */}
              <div className="bg-glass-white backdrop-blur-lg border-0 shadow-soft rounded-modern-lg overflow-hidden">
                <div className="p-6 border-b border-primary-sage/10">
                  <h2 className="font-primary text-2xl font-light text-text-primary flex items-center gap-3">
                    <Package className="w-6 h-6 text-primary-sage" />
                    Produtos do Pedido
                  </h2>
                </div>

                <div className="p-6 space-y-4">
                  {cartData.items.map((item, index) => (
                    <div
                      key={index}
                      className="flex gap-4 p-4 bg-neutral-snow/50 rounded-modern"
                    >
                      {/* Imagem */}
                      <div className="w-20 h-20 rounded-modern bg-primary-sage-light/20 flex items-center justify-center flex-shrink-0 overflow-hidden">
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.product_name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <Package className="w-8 h-8 text-primary-sage/40" />
                        )}
                      </div>

                      {/* Informações */}
                      <div className="flex-1 space-y-1">
                        <h3 className="font-secondary font-semibold text-text-primary">
                          {item.product_name}
                        </h3>
                        <p className="font-secondary text-sm text-text-secondary">
                          Quantidade: {item.quantity}x
                        </p>
                        {item.customization && (
                          <p className="font-secondary text-sm text-primary-sage italic">
                            {item.customization}
                          </p>
                        )}
                        {item.price > 0 ? (
                          <p className="font-secondary font-bold text-secondary-rose">
                            {formatPrice(item.price * item.quantity)}
                          </p>
                        ) : (
                          <p className="font-secondary font-medium text-primary-sage text-sm">
                            Sob consulta
                          </p>
                        )}
                      </div>
                    </div>
                  ))}

                  {/* Subtotal */}
                  <div className="pt-6 mt-4 border-t-2 border-primary-sage/10">
                    <div className="flex justify-between items-center">
                      <span className="font-secondary text-lg font-medium text-text-primary">
                        Subtotal
                      </span>
                      <span className="font-primary text-3xl font-light text-secondary-rose">
                        {formatPrice(cartData.subtotal)}
                      </span>
                    </div>
                    <p className="font-secondary text-sm text-text-light mt-2">
                      Frete e descontos serão calculados no atendimento
                    </p>
                  </div>
                </div>
              </div>

              {/* Observações */}
              {customerInfo?.notes && (
                <div className="bg-glass-white backdrop-blur-lg border-0 shadow-soft rounded-modern-lg overflow-hidden p-6">
                  <h3 className="font-primary text-xl font-light text-text-primary mb-3">
                    Observações
                  </h3>
                  <p className="font-secondary text-text-secondary leading-relaxed">
                    {customerInfo.notes}
                  </p>
                </div>
              )}
            </div>

            {/* Coluna Lateral */}
            <div className="space-y-6">
              {/* Dados do Cliente */}
              {customerInfo && (
                <div className="bg-glass-white backdrop-blur-lg border-0 shadow-soft rounded-modern-lg overflow-hidden p-6">
                  <h3 className="font-primary text-xl font-light text-text-primary mb-4 flex items-center gap-2">
                    <User className="w-5 h-5 text-primary-sage" />
                    Informações do Cliente
                  </h3>
                  <div className="space-y-4">
                    {customerInfo.name && (
                      <div className="flex items-start gap-3">
                        <User className="w-4 h-4 text-primary-sage mt-1" />
                        <div>
                          <p className="font-secondary text-xs text-text-light uppercase tracking-wide">
                            Nome
                          </p>
                          <p className="font-secondary font-medium text-text-primary">
                            {customerInfo.name}
                          </p>
                        </div>
                      </div>
                    )}

                    {customerInfo.phone && (
                      <div className="flex items-start gap-3">
                        <Phone className="w-4 h-4 text-primary-sage mt-1" />
                        <div>
                          <p className="font-secondary text-xs text-text-light uppercase tracking-wide">
                            Telefone
                          </p>
                          <p className="font-secondary font-medium text-text-primary">
                            {customerInfo.phone}
                          </p>
                        </div>
                      </div>
                    )}

                    {customerInfo.email && (
                      <div className="flex items-start gap-3">
                        <Mail className="w-4 h-4 text-primary-sage mt-1" />
                        <div>
                          <p className="font-secondary text-xs text-text-light uppercase tracking-wide">
                            Email
                          </p>
                          <p className="font-secondary font-medium text-text-primary break-all">
                            {customerInfo.email}
                          </p>
                        </div>
                      </div>
                    )}

                    {customerInfo.deliveryDate && (
                      <div className="flex items-start gap-3">
                        <Calendar className="w-4 h-4 text-primary-sage mt-1" />
                        <div>
                          <p className="font-secondary text-xs text-text-light uppercase tracking-wide">
                            Data de Entrega
                          </p>
                          <p className="font-secondary font-medium text-text-primary">
                            {formatDate(customerInfo.deliveryDate)}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* CTA WhatsApp */}
              <div className="bg-gradient-to-br from-primary-sage to-primary-sage-dark rounded-modern-lg overflow-hidden p-6 text-center shadow-soft">
                <MessageCircle className="w-12 h-12 text-white/90 mx-auto mb-4" />
                <h3 className="font-primary text-xl font-light text-white mb-2">
                  Finalizar Pedido
                </h3>
                <p className="font-secondary text-sm text-white/80 mb-4">
                  Entre em contato pelo WhatsApp para confirmar
                </p>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  <Button
                    size="lg"
                    className="w-full bg-white text-primary-sage hover:bg-white/90 shadow-soft font-medium"
                  >
                    <MessageCircle className="mr-2 h-5 w-5" />
                    Chamar no WhatsApp
                  </Button>
                </a>
              </div>

              {/* Info Card */}
              <div className="bg-secondary-rose/5 border border-secondary-rose/10 rounded-modern-lg p-4 text-center">
                <p className="font-secondary text-sm text-text-secondary leading-relaxed">
                  Carrinho criado em{' '}
                  <span className="font-medium text-text-primary">
                    {new Date(cart.created_at).toLocaleDateString('pt-BR')}
                  </span>
                  <br />
                  Visualizado{' '}
                  <span className="font-medium text-text-primary">
                    {cart.views + 1}x
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer simples */}
      <footer className="py-8 border-t border-primary-sage/10">
        <div className="container mx-auto px-4 text-center">
          <Link href="/" className="inline-flex items-center gap-2 text-text-secondary hover:text-secondary-rose transition-colors">
            <Heart className="w-4 h-4 fill-current" />
            <span className="font-secondary text-sm">Sabor do Afeto</span>
          </Link>
        </div>
      </footer>
    </div>
  )
}
