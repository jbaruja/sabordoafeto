import { MapPin, Phone, Mail, Clock, Instagram, Facebook, MessageCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function ContatoPage() {
  const contactInfo = [
    {
      icon: Phone,
      title: 'Telefone/WhatsApp',
      content: '(47) 99104-4121',
      link: 'tel:+5547991044121',
    },
    {
      icon: Mail,
      title: 'Email',
      content: 'contato@sabordoafeto.com.br',
      link: 'mailto:contato@sabordoafeto.com.br',
    },
    {
      icon: MapPin,
      title: 'Endereço',
      content: 'R. Paulo Facheti, 248 - Sala 2 - Lídia Duarte, Camboriú - SC',
      link: https://maps.app.goo.gl/K5EAwSceEUWZDY2c9,
    },
    {
      icon: Clock,
      title: 'Horário de Funcionamento',
      content: 'Seg-Sex: 9h-18h | Sáb: 9h-12h',
      link: null,
    },
  ]

  const socialMedia = [
    {
      icon: Instagram,
      name: 'Instagram',
      link: 'https://instagram.com/sabordoafeto',
      color: 'hover:text-pink-600',
    },
    {
      icon: Facebook,
      name: 'Facebook',
      link: 'https://facebook.com/sabordoafeto',
      color: 'hover:text-blue-600',
    },
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-gradient-to-br from-secondary-rose-light via-neutral-cream to-primary-sage-light py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h1 className="font-primary text-5xl md:text-6xl font-bold text-text-primary">
              Entre em Contato
            </h1>
            <p className="font-secondary text-xl text-text-secondary">
              Estamos aqui para ajudar você a criar o presente perfeito
            </p>
          </div>
        </div>
      </section>

      {/* Informações de Contato */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
              {contactInfo.map((info) => (
                <div
                  key={info.title}
                  className="text-center p-6 bg-neutral-cream rounded-lg hover:shadow-lg transition-shadow"
                >
                  <info.icon className="w-12 h-12 text-secondary-rose mx-auto mb-4" />
                  <h3 className="font-secondary font-semibold text-text-primary mb-2">
                    {info.title}
                  </h3>
                  {info.link ? (
                    <a
                      href={info.link}
                      className="font-secondary text-text-secondary hover:text-secondary-rose transition-colors"
                    >
                      {info.content}
                    </a>
                  ) : (
                    <p className="font-secondary text-text-secondary">
                      {info.content}
                    </p>
                  )}
                </div>
              ))}
            </div>

            {/* WhatsApp CTA */}
            <div className="bg-gradient-to-br from-secondary-rose-light to-primary-sage-light p-8 md:p-12 rounded-2xl text-center space-y-6">
              <MessageCircle className="w-16 h-16 text-secondary-rose mx-auto" />
              <h2 className="font-primary text-3xl md:text-4xl font-semibold text-text-primary">
                Prefere conversar pelo WhatsApp?
              </h2>
              <p className="font-secondary text-lg text-text-secondary max-w-2xl mx-auto">
                Respondemos rapidamente e podemos te ajudar a escolher o
                presente ideal ou tirar qualquer dúvida.
              </p>
              <a
                href="https://wa.me/5547991044121?text=Olá! Gostaria de mais informações"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button
                  size="lg"
                  className="bg-secondary-rose hover:bg-secondary-rose-dark text-white text-lg px-8"
                >
                  <MessageCircle className="mr-2 h-5 w-5" />
                  Chamar no WhatsApp
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Redes Sociais */}
      <section className="py-20 bg-neutral-cream">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <h2 className="font-primary text-4xl md:text-5xl font-semibold text-text-primary">
              Nos Siga nas Redes Sociais
            </h2>
            <p className="font-secondary text-lg text-text-secondary">
              Acompanhe nossas novidades, promoções e inspirações para presentes
            </p>
            <div className="flex gap-6 justify-center pt-4">
              {socialMedia.map((social) => (
                <a
                  key={social.name}
                  href={social.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`p-4 bg-white rounded-full shadow-md transition-all hover:shadow-xl ${social.color}`}
                  aria-label={social.name}
                >
                  <social.icon className="w-8 h-8" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Mapa (Placeholder) */}
      <section className="h-96 bg-primary-sage-light/30 flex items-center justify-center">
        <div className="text-center space-y-4">
          <MapPin className="w-16 h-16 text-primary-sage mx-auto" />
          <p className="font-secondary text-text-secondary">
            Localização: Camboriú, SC
          </p>
          <p className="font-secondary text-sm text-text-light">
            <a href="https://maps.app.goo.gl/K5EAwSceEUWZDY2c9" target="_blank" rel="noopener noreferrer">
              Ver no Google Maps
            </a>
          </p>
        </div>
      </section>
    </div>
  )
}
