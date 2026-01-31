import Image from 'next/image'
import { Heart, Award, Users, Gift, Sparkles } from 'lucide-react'

export default function SobrePage() {
  const values = [
    {
      icon: Heart,
      title: 'O Afeto como Guia',
      description:
        'Não fazemos apenas biscoitos; preparamos gestos de carinho. Acreditamos que o amor deve ser palpável, por isso, cada detalhe — do nó do laço ao sabor da massa — é pensado para abraçar quem recebe.',
    },
    {
      icon: Award,
      title: 'A Verdade no Ingrediente',
      description:
        'Para nós, qualidade não é um selo, é respeito. Escolhemos ingredientes reais e selecionados porque acreditamos que a sua família e os seus convidados merecem o mesmo padrão de excelência que servimos à nossa própria mesa.',
    },
    {
      icon: Users,
      title: 'A Escuta Atenta',
      description:
        'Tratamos cada pedido como uma conversa única. Entendemos o que você deseja celebrar e colocamos a nossa dedicação para que o resultado final tenha a sua cara e a sua intenção.',
    },
    {
      icon: Gift,
      title: 'A Singularidade do Presente',
      description:
        'Nenhum momento é igual ao outro, e nossos biscoitos também não. Criamos presentes que carregam uma identidade própria, feitos artesanalmente para se tornarem memórias inesquecíveis.',
    },
  ]

  return (
    <div className="flex flex-col">
      {/* Hero Section - Estilo igual à Homepage */}
      <section className="relative bg-neutral-snow py-32 md:py-40 overflow-hidden">
        {/* Mesh Gradients - Manchas de cor suaves */}
        <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-primary-sage opacity-[0.08] rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-secondary-rose opacity-[0.06] rounded-full blur-[100px] translate-x-1/3 translate-y-1/3"></div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <div className="inline-block">
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-glass-white backdrop-blur-md rounded-full text-sm font-secondary text-secondary-rose font-medium shadow-soft">
                <Heart className="w-4 h-4 fill-current" />
                Conheça Nossa História
              </span>
            </div>

            <h1 className="font-primary text-5xl md:text-7xl font-light text-text-primary">
              Receitas de família,{' '}
              <span className="text-secondary-rose font-normal">feitas para a sua</span>
            </h1>

            <p className="font-secondary text-lg md:text-xl text-text-secondary max-w-2xl mx-auto">
              Cada biscoito carrega a tradição de uma cozinha cheia de amor e histórias
            </p>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-10 left-10 opacity-10 z-10">
          <Sparkles className="w-12 h-12 text-primary-sage" />
        </div>
        <div className="absolute bottom-10 right-10 opacity-10 z-10">
          <Gift className="w-16 h-16 text-primary-sage" />
        </div>
      </section>

      {/* História com Imagem */}
      <section className="py-24 bg-white relative">
        {/* Linha sutil de separação */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary-sage/10 to-transparent"></div>

        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              {/* Imagem */}
              <div className="order-2 md:order-1">
                <div className="relative rounded-modern-lg overflow-hidden shadow-soft-lg">
                  <Image
                    src="/sobre/about-hero.png"
                    alt="Biscoitos artesanais decorados sobre mesa de madeira rústica"
                    width={600}
                    height={600}
                    className="w-full h-auto object-cover"
                  />
                  {/* Overlay sutil */}
                  <div className="absolute inset-0 bg-gradient-to-t from-text-primary/10 to-transparent"></div>
                </div>
              </div>

              {/* Texto */}
              <div className="order-1 md:order-2 space-y-6">
                <h2 className="font-primary text-3xl md:text-4xl font-light text-text-primary">
                  Tudo começou ao redor da mesa
                </h2>
                <div className="space-y-4">
                  <p className="font-secondary text-text-secondary leading-relaxed">
                    Existem coisas que só quem cozinha com as mãos e o coração entende. Na nossa casa, o afeto nunca foi algo abstrato; ele sempre esteve presente no respeito das palavras, no cuidado com o outro e, principalmente, ao redor da mesa.
                  </p>
                  <p className="font-secondary text-text-secondary leading-relaxed">
                    Crescemos ouvindo histórias alegres na cozinha, entre o cheiro do forno e o som das risadas. E foi desse desejo de compartilhar essa alegria que a <span className="text-secondary-rose font-medium">Sabor do Afeto</span> nasceu.
                  </p>
                  <p className="font-secondary text-text-secondary leading-relaxed">
                    Hoje, nossos biscoitos fazem parte de batizados, casamentos, reuniões de trabalho e daquele café da tarde despretensioso. Mas a nossa essência continua a mesma: cada detalhe é pensado para que você, ao receber nossos biscoitos, sinta-se abraçado.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Valores - Cards com efeito glass */}
      <section className="py-24 bg-neutral-cream relative">
        {/* Linha sutil de separação */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary-sage/10 to-transparent"></div>

        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="font-primary text-4xl md:text-5xl font-light text-text-primary mb-4">
                Nossos Valores
              </h2>
              <p className="font-secondary text-lg text-text-secondary">
                O que nos guia em cada presente criado
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              {values.map((value) => (
                <div
                  key={value.title}
                  className="bg-glass-white backdrop-blur-lg border-0 shadow-soft hover:shadow-float hover:-translate-y-1 transition-all duration-300 p-8 rounded-modern-lg"
                >
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-secondary-rose-light/30 mb-6">
                    <value.icon className="w-7 h-7 text-secondary-rose" />
                  </div>
                  <h3 className="font-primary text-xl font-light text-text-primary mb-3">
                    {value.title}
                  </h3>
                  <p className="font-secondary text-sm text-text-secondary leading-relaxed">
                    {value.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Missão - Destaque */}
      <section className="py-32 bg-white relative overflow-hidden">
        {/* Mesh Gradients */}
        <div className="absolute top-1/2 left-0 w-[400px] h-[400px] bg-primary-sage opacity-[0.05] rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute top-1/2 right-0 w-[400px] h-[400px] bg-secondary-rose opacity-[0.04] rounded-full blur-[100px] translate-x-1/2 -translate-y-1/2"></div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-glass-white backdrop-blur-md rounded-full text-sm font-secondary text-primary-sage font-medium shadow-soft">
              <Sparkles className="w-4 h-4" />
              Nossa Missão
            </span>

            <h2 className="font-primary text-3xl md:text-4xl font-light text-text-primary leading-relaxed">
              Estar presente nos momentos mais significativos das famílias e empresas, oferecendo{' '}
              <span className="text-secondary-rose font-normal">biscoitos artesanais</span> que carregam o cuidado de um lar e a sofisticação de um presente feito à mão.
            </h2>
          </div>
        </div>
      </section>
    </div>
  )
}
