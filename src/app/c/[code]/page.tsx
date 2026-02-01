import { notFound } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { MessageCircle, Calendar, User, Phone, Mail, Package } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

// Force dynamic rendering - essential for this route to work
export const dynamic = 'force-dynamic'
export const revalidate = 0

interface PageProps {
  params: Promise<{
    code: string
  }>
}

async function getSharedCart(code: string) {
  // Buscar carrinho
  const { data: cart, error } = await supabase
    .from('shared_carts')
    .select('*')
    .eq('short_code', code)
    .single()

  if (error || !cart) {
    return null
  }

  // Incrementar visualizações
  await supabase
    .from('shared_carts')
    .update({ views: cart.views + 1 })
    .eq('id', cart.id)

  return cart
}

export default async function SharedCartPage({ params }: PageProps) {
  const { code } = await params
  const cart = await getSharedCart(code)

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
    pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    contacted: 'bg-blue-100 text-blue-800 border-blue-200',
    converted: 'bg-green-100 text-green-800 border-green-200',
    expired: 'bg-gray-100 text-gray-800 border-gray-200',
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
    <div className="min-h-screen bg-neutral-cream">
      {/* Header */}
      <section className="bg-gradient-to-br from-secondary-rose-light via-neutral-cream to-primary-sage-light py-12 md:py-16 border-b">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm">
              <Package className="w-4 h-4 text-secondary-rose" />
              <span className="font-secondary font-medium text-text-primary">
                Código: {params.code.toUpperCase()}
              </span>
            </div>
            <h1 className="font-primary text-3xl md:text-5xl font-bold text-text-primary">
              Carrinho Compartilhado
            </h1>
            <div className="flex justify-center">
              <span
                className={`inline-block px-4 py-2 rounded-lg border font-secondary text-sm font-medium ${statusColors[cart.status as keyof typeof statusColors]
                  }`}
              >
                {statusLabels[cart.status as keyof typeof statusLabels]}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Conteúdo Principal */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-6">
            {/* Coluna Principal - Produtos */}
            <div className="md:col-span-2 space-y-6">
              {/* Produtos */}
              <Card>
                <CardHeader>
                  <CardTitle className="font-primary text-2xl text-secondary-rose">
                    Produtos do Pedido
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {cartData.items.map((item, index) => (
                    <div
                      key={index}
                      className="flex gap-4 pb-4 border-b last:border-b-0 last:pb-0"
                    >
                      {/* Imagem */}
                      <div className="w-20 h-20 rounded-lg bg-gradient-to-br from-secondary-rose-light to-primary-sage-light flex items-center justify-center flex-shrink-0 overflow-hidden">
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.product_name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <Package className="w-8 h-8 text-white" />
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
                          <p className="font-secondary text-sm text-text-light italic">
                            {item.customization}
                          </p>
                        )}
                        <p className="font-secondary font-bold text-secondary-rose">
                          {formatPrice(item.price * item.quantity)}
                        </p>
                      </div>
                    </div>
                  ))}

                  {/* Subtotal */}
                  <div className="pt-4 border-t-2 border-secondary-rose/20">
                    <div className="flex justify-between items-center">
                      <span className="font-secondary text-lg font-semibold text-text-primary">
                        Subtotal
                      </span>
                      <span className="font-primary text-2xl font-bold text-secondary-rose">
                        {formatPrice(cartData.subtotal)}
                      </span>
                    </div>
                    <p className="font-secondary text-sm text-text-light mt-2">
                      Frete e descontos serão calculados no atendimento
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Observações */}
              {customerInfo?.notes && (
                <Card>
                  <CardHeader>
                    <CardTitle className="font-primary text-xl text-secondary-rose">
                      Observações
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="font-secondary text-text-secondary leading-relaxed">
                      {customerInfo.notes}
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Coluna Lateral - Informações do Cliente */}
            <div className="space-y-6">
              {/* Dados do Cliente - só exibe se houver informações */}
              {customerInfo && (
                <Card>
                  <CardHeader>
                    <CardTitle className="font-primary text-xl text-secondary-rose">
                      Informações do Cliente
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {customerInfo.name && (
                      <div className="flex items-start gap-3">
                        <User className="w-5 h-5 text-secondary-rose mt-0.5" />
                        <div>
                          <p className="font-secondary text-sm text-text-light">
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
                        <Phone className="w-5 h-5 text-secondary-rose mt-0.5" />
                        <div>
                          <p className="font-secondary text-sm text-text-light">
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
                        <Mail className="w-5 h-5 text-secondary-rose mt-0.5" />
                        <div>
                          <p className="font-secondary text-sm text-text-light">
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
                        <Calendar className="w-5 h-5 text-secondary-rose mt-0.5" />
                        <div>
                          <p className="font-secondary text-sm text-text-light">
                            Data de Entrega
                          </p>
                          <p className="font-secondary font-medium text-text-primary">
                            {formatDate(customerInfo.deliveryDate)}
                          </p>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* CTA WhatsApp */}
              <Card className="bg-gradient-to-br from-secondary-rose-light to-primary-sage-light border-secondary-rose">
                <CardContent className="pt-6 space-y-4 text-center">
                  <MessageCircle className="w-12 h-12 text-secondary-rose mx-auto" />
                  <div>
                    <h3 className="font-primary text-xl font-semibold text-text-primary mb-2">
                      Finalizar Pedido
                    </h3>
                    <p className="font-secondary text-sm text-text-secondary">
                      Entre em contato pelo WhatsApp para confirmar seu pedido
                    </p>
                  </div>
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block"
                  >
                    <Button
                      size="lg"
                      className="w-full bg-secondary-rose hover:bg-secondary-rose-dark text-white"
                    >
                      <MessageCircle className="mr-2 h-5 w-5" />
                      Chamar no WhatsApp
                    </Button>
                  </a>
                </CardContent>
              </Card>

              {/* Informações Adicionais */}
              <Card className="bg-primary-sage-light/30">
                <CardContent className="pt-6">
                  <p className="font-secondary text-sm text-text-secondary text-center leading-relaxed">
                    Este carrinho foi criado em{' '}
                    <span className="font-medium text-text-primary">
                      {new Date(cart.created_at).toLocaleDateString('pt-BR')}
                    </span>
                    {' '}e já foi visualizado{' '}
                    <span className="font-medium text-text-primary">
                      {cart.views + 1}x
                    </span>
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
