import { Heart, Award, Users, Gift } from 'lucide-react'

export default function SobrePage() {
  const values = [
    {
      icon: Heart,
      title: 'Afeto em Cada Detalhe',
      description:
        'Cada produto é feito com carinho e atenção aos mínimos detalhes, pensando em transmitir amor.',
    },
    {
      icon: Award,
      title: 'Qualidade Premium',
      description:
        'Trabalhamos apenas com ingredientes selecionados e de primeira qualidade.',
    },
    {
      icon: Users,
      title: 'Atendimento Personalizado',
      description:
        'Entendemos suas necessidades e criamos presentes únicos para cada ocasião.',
    },
    {
      icon: Gift,
      title: 'Presentes Únicos',
      description:
        'Nossos produtos são exclusivos e feitos sob medida para quem você ama.',
    },
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-gradient-to-br from-secondary-rose-light via-neutral-cream to-primary-sage-light py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h1 className="font-primary text-5xl md:text-6xl font-bold text-text-primary">
              Nossa História
            </h1>
            <p className="font-secondary text-xl text-text-secondary">
              Transformando momentos especiais em memórias inesquecíveis desde
              2020
            </p>
          </div>
        </div>
      </section>

      {/* História */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
              <div className="order-2 md:order-1">
                <div className="aspect-square bg-gradient-to-br from-secondary-rose-light via-neutral-cream to-primary-sage rounded-2xl flex items-center justify-center">
                  <Heart className="w-32 h-32 text-white/60 fill-current" />
                </div>
              </div>
              <div className="order-1 md:order-2 space-y-6">
                <h2 className="font-primary text-4xl font-semibold text-text-primary">
                  Tudo começou com afeto
                </h2>
                <p className="font-secondary text-lg text-text-secondary leading-relaxed">
                  O Sabor do Afeto nasceu do desejo de transformar momentos
                  simples em experiências memoráveis. Acreditamos que um presente
                  feito com carinho tem o poder de fortalecer laços e criar
                  memórias que duram para sempre.
                </p>
                <p className="font-secondary text-lg text-text-secondary leading-relaxed">
                  Cada produto é cuidadosamente preparado de forma artesanal,
                  com ingredientes selecionados e muita dedicação. Mais do que
                  presentes, criamos experiências que aquecem o coração.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Valores */}
      <section className="py-20 bg-neutral-cream">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="font-primary text-4xl md:text-5xl font-semibold text-text-primary mb-4">
                Nossos Valores
              </h2>
              <p className="font-secondary text-lg text-text-secondary">
                O que nos guia em cada presente criado
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-8">
              {values.map((value) => (
                <div
                  key={value.title}
                  className="bg-white p-8 rounded-lg hover:shadow-xl transition-shadow"
                >
                  <value.icon className="w-12 h-12 text-secondary-rose mb-4" />
                  <h3 className="font-primary text-2xl font-semibold text-text-primary mb-3">
                    {value.title}
                  </h3>
                  <p className="font-secondary text-text-secondary leading-relaxed">
                    {value.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Missão */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <h2 className="font-primary text-4xl md:text-5xl font-semibold text-text-primary">
              Nossa Missão
            </h2>
            <p className="font-secondary text-xl text-text-secondary leading-relaxed">
              Criar presentes artesanais que transmitam afeto genuíno,
              fortalecendo laços e tornando momentos especiais ainda mais
              memoráveis através de produtos de qualidade excepcional e
              atendimento personalizado.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
