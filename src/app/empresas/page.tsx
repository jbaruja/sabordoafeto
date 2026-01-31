import Image from 'next/image'
import Link from 'next/link'
import { Building2, Brain, Users, Share2, Heart, Sparkles, MessageCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function EmpresasPage() {
    const benefits = [
        {
            icon: Brain,
            title: 'Presença na Memória',
            subtitle: 'Top of Mind',
            description:
                'Presentear um cliente ou colaborador com um produto artesanal tira a sua marca do "digital" e a coloca em um momento de pausa e prazer. Esse vínculo tátil e gustativo fixa a identidade da sua empresa na memória afetiva, criando uma conexão que vai muito além de uma transação comercial.',
        },
        {
            icon: Heart,
            title: 'Fidelização através da Experiência',
            subtitle: 'Do comum ao extraordinário',
            description:
                'A fidelidade de um cliente nasce do reconhecimento. Ao oferecer um biscoito feito à mão, você comunica que aquele relacionamento é único. É a transição do atendimento comum para o atendimento extraordinário, transformando clientes em defensores da sua marca.',
        },
        {
            icon: Share2,
            title: 'Expansão Orgânica',
            subtitle: 'Autoridade Social',
            description:
                'A beleza e o cuidado de nossas embalagens despertam o desejo de compartilhar. Quando um cliente recebe um presente Sabor do Afeto, o agradecimento frequentemente se transforma em publicidade espontânea nas redes sociais. Sua marca rompe "bolhas sociais" e alcança novos públicos de forma orgânica.',
        },
        {
            icon: Users,
            title: 'Fortalecimento da Cultura Interna',
            subtitle: 'Colaboradores que sentem cuidado',
            description:
                'Colaboradores que se sentem cuidados produzem com mais propósito. Leve o nosso afeto para as suas recepções, reuniões de diretoria ou celebrações internas e reforce o valor humano da sua cultura corporativa.',
        },
    ]

    const quotes = [
        'Sua marca presente nos momentos de pausa e conexão de quem move o seu negócio.',
        'Transforme o seu "muito obrigado" em uma experiência sensorial inesquecível.',
        'Branding artesanal: O cuidado que gera fidelidade e expande horizontes.',
    ]

    return (
        <div className="flex flex-col">
            {/* Hero Section - Verde (Sage) dominante */}
            <section className="relative bg-neutral-snow py-32 md:py-40 overflow-hidden">
                {/* Mesh Gradients - Mais verde */}
                <div className="absolute top-0 left-0 w-[700px] h-[700px] bg-primary-sage opacity-[0.12] rounded-full blur-[120px] -translate-x-1/3 -translate-y-1/3"></div>
                <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-primary-sage-light opacity-[0.15] rounded-full blur-[100px] translate-x-1/4 translate-y-1/4"></div>
                <div className="absolute top-1/2 right-1/4 w-[300px] h-[300px] bg-secondary-rose opacity-[0.04] rounded-full blur-[80px]"></div>

                <div className="container mx-auto px-4 relative z-10">
                    <div className="max-w-4xl mx-auto text-center space-y-6">
                        <div className="inline-block">
                            <span className="inline-flex items-center gap-2 px-4 py-2 bg-primary-sage/10 backdrop-blur-md rounded-full text-sm font-secondary text-primary-sage font-medium shadow-soft border border-primary-sage/20">
                                <Building2 className="w-4 h-4" />
                                Para Empresas
                            </span>
                        </div>

                        <h1 className="font-primary text-5xl md:text-7xl font-light text-text-primary">
                            Branding que se{' '}
                            <span className="text-primary-sage font-normal">saboreia</span>
                        </h1>

                        <p className="font-secondary text-lg md:text-xl text-text-secondary max-w-3xl mx-auto">
                            No mercado atual, a identidade de uma marca não se constrói apenas com logos, mas com experiências memoráveis.
                            Para empresas que desejam se destacar, o gesto de presentear é uma ferramenta poderosa de branding sensorial.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
                            <a
                                href="https://wa.me/5547991044121?text=Olá! Gostaria de saber mais sobre presentes corporativos."
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <Button
                                    size="lg"
                                    className="bg-primary-sage hover:bg-primary-sage-dark text-white shadow-soft"
                                >
                                    <MessageCircle className="w-5 h-5 mr-2" />
                                    Falar com Nossa Equipe
                                </Button>
                            </a>
                        </div>
                    </div>
                </div>

                {/* Decorative elements */}
                <div className="absolute top-10 left-10 opacity-15 z-10">
                    <Building2 className="w-12 h-12 text-primary-sage" />
                </div>
                <div className="absolute bottom-10 right-10 opacity-15 z-10">
                    <Sparkles className="w-16 h-16 text-primary-sage" />
                </div>
            </section>

            {/* Imagem com Quote */}
            <section className="py-24 bg-white relative">
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary-sage/20 to-transparent"></div>

                <div className="container mx-auto px-4">
                    <div className="max-w-6xl mx-auto">
                        <div className="grid md:grid-cols-2 gap-12 items-center">
                            {/* Imagem */}
                            <div className="relative rounded-modern-lg overflow-hidden shadow-soft-lg">
                                <Image
                                    src="/empresas/hero.png"
                                    alt="Caixa de presente corporativo com biscoitos artesanais personalizados"
                                    width={600}
                                    height={600}
                                    className="w-full h-auto object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-primary-sage/20 to-transparent"></div>
                            </div>

                            {/* Quote Destaque */}
                            <div className="space-y-8">
                                <div className="border-l-4 border-primary-sage pl-6">
                                    <blockquote className="font-primary text-2xl md:text-3xl font-light text-text-primary leading-relaxed">
                                        "{quotes[0]}"
                                    </blockquote>
                                </div>
                                <p className="font-secondary text-text-secondary">
                                    Cada presente Sabor do Afeto é uma oportunidade de criar conexões genuínas com quem importa para o seu negócio.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Benefícios - Cards verdes */}
            <section className="py-24 bg-primary-sage/5 relative">
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary-sage/20 to-transparent"></div>

                <div className="container mx-auto px-4">
                    <div className="max-w-6xl mx-auto">
                        <div className="text-center mb-16">
                            <h2 className="font-primary text-4xl md:text-5xl font-light text-text-primary mb-4">
                                Por que Presentear com <span className="text-primary-sage">Intenção</span>?
                            </h2>
                            <p className="font-secondary text-lg text-text-secondary max-w-2xl mx-auto">
                                Descubra como o branding sensorial transforma relacionamentos comerciais
                            </p>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                            {benefits.map((benefit, index) => (
                                <div
                                    key={benefit.title}
                                    className="bg-white backdrop-blur-lg border border-primary-sage/10 shadow-soft hover:shadow-float hover:-translate-y-1 transition-all duration-300 p-8 rounded-modern-lg"
                                >
                                    <div className="flex items-start gap-4">
                                        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary-sage/10 flex-shrink-0">
                                            <benefit.icon className="w-7 h-7 text-primary-sage" />
                                        </div>
                                        <div className="space-y-2">
                                            <div>
                                                <h3 className="font-primary text-xl font-light text-text-primary">
                                                    {benefit.title}
                                                </h3>
                                                <span className="font-secondary text-sm text-primary-sage font-medium">
                                                    {benefit.subtitle}
                                                </span>
                                            </div>
                                            <p className="font-secondary text-sm text-text-secondary leading-relaxed">
                                                {benefit.description}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Quotes Section */}
            <section className="py-24 bg-white relative overflow-hidden">
                <div className="absolute top-1/2 left-0 w-[400px] h-[400px] bg-primary-sage opacity-[0.06] rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2"></div>

                <div className="container mx-auto px-4 relative z-10">
                    <div className="max-w-4xl mx-auto">
                        <div className="grid md:grid-cols-3 gap-8">
                            {quotes.map((quote, index) => (
                                <div
                                    key={index}
                                    className="bg-primary-sage/5 p-6 rounded-modern-lg border border-primary-sage/10"
                                >
                                    <p className="font-secondary text-text-secondary italic leading-relaxed">
                                        "{quote}"
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Final */}
            <section className="py-32 bg-primary-sage relative overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-white rounded-full blur-[100px]"></div>
                    <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-white rounded-full blur-[80px]"></div>
                </div>

                <div className="container mx-auto px-4 relative z-10">
                    <div className="max-w-3xl mx-auto text-center space-y-8">
                        <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-md rounded-full text-sm font-secondary text-white font-medium">
                            <Sparkles className="w-4 h-4" />
                            Vamos Conversar?
                        </span>

                        <h2 className="font-primary text-3xl md:text-5xl font-light text-white leading-relaxed">
                            Transforme seus relacionamentos comerciais em{' '}
                            <span className="font-normal">experiências memoráveis</span>
                        </h2>

                        <p className="font-secondary text-lg text-white/80">
                            Entre em contato e descubra como podemos criar presentes únicos para a sua marca.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                            <a
                                href="https://wa.me/5547991044121?text=Olá! Represento uma empresa e gostaria de saber mais sobre presentes corporativos personalizados."
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <Button
                                    size="lg"
                                    className="bg-white text-primary-sage hover:bg-white/90 shadow-soft"
                                >
                                    <MessageCircle className="w-5 h-5 mr-2" />
                                    Solicitar Orçamento
                                </Button>
                            </a>
                            <Link href="/produtos">
                                <Button
                                    size="lg"
                                    variant="outline"
                                    className="border-2 border-white text-white hover:bg-white/10"
                                >
                                    Ver Nossos Produtos
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}
