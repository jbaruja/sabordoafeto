import Link from 'next/link'
import { Instagram, Facebook, Mail, Phone, MapPin } from 'lucide-react'
import { Separator } from '@/components/ui/separator'

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-neutral-wood/10 border-t border-neutral-wood/20 mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <h3 className="font-primary text-2xl font-semibold text-secondary-rose">
              Sabor do Afeto
            </h3>
            <p className="font-secondary text-sm text-text-secondary max-w-xs">
              Biscoitos artesanais para os encontros que ficam na memória.
            </p>
          </div>

          {/* Contact Section */}
          <div className="space-y-4">
            <h4 className="font-secondary text-lg font-semibold text-text-primary">
              Contato
            </h4>
            <div className="space-y-3 font-secondary text-sm text-text-secondary">
              <a
                href="https://wa.me/5547991044121?text=Olá! Gostaria de fazer um pedido"
                className="flex items-center gap-2 hover:text-secondary-rose transition-colors"
              >
                <Phone className="h-4 w-4" />
                (47) 99104-4121
              </a>
              <a
                href="mailto:contato@sabordoafeto.com.br"
                className="flex items-center gap-2 hover:text-secondary-rose transition-colors"
              >
                <Mail className="h-4 w-4" />
                contato@sabordoafeto.com.br
              </a>

              <a
                href="https://maps.app.goo.gl/K5EAwSceEUWZDY2c9"
                className="flex items-center gap-2 hover:text-secondary-rose transition-colors"
              >
                <MapPin className="h-4 w-4" />
                R. Paulo Facheti, 248 - Sala 2 - Lídia Duarte, Camboriú - SC
              </a>

            </div>
          </div>

          {/* Hours & Social Section */}
          <div className="space-y-4">
            <h4 className="font-secondary text-lg font-semibold text-text-primary">
              Horário de Funcionamento
            </h4>
            <div className="space-y-2 font-secondary text-sm text-text-secondary">
              <p>Segunda a Sexta: 9h - 18h</p>
              <p>Sábado: 9h - 14h</p>
              <p>Domingo: Fechado</p>
            </div>
            <div className="flex gap-4 pt-4">
              <a
                href="https://instagram.com/sabordoafeto"
                target="_blank"
                rel="noopener noreferrer"
                className="text-text-secondary hover:text-secondary-rose transition-colors"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="https://facebook.com/sabordoafeto"
                target="_blank"
                rel="noopener noreferrer"
                className="text-text-secondary hover:text-secondary-rose transition-colors"
              >
                <Facebook className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        <Separator className="my-8" />

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="font-secondary text-sm text-text-secondary">
            © {currentYear} Sabor do Afeto. Todos os direitos reservados.
          </p>
          <div className="flex gap-6 font-secondary text-sm">
            <Link
              href="/termos"
              className="text-text-secondary hover:text-secondary-rose transition-colors"
            >
              Termos de Uso
            </Link>
            <Link
              href="/privacidade"
              className="text-text-secondary hover:text-secondary-rose transition-colors"
            >
              Privacidade
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
