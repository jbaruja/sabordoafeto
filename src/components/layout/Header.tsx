'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Menu, X, MessageCircle, ShoppingBag } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { useCartStore } from '@/stores/cartStore'

const navigation = [
  { name: 'Início', href: '/' },
  { name: 'Produtos', href: '/produtos' },
  { name: 'Sobre', href: '/sobre' },
  { name: 'Contato', href: '/contato' },
]

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const { getTotalItems, openCart } = useCartStore()

  useEffect(() => {
    setIsMounted(true)
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const whatsappLink = 'https://wa.me/5547991044121?text=Olá! Gostaria de fazer um pedido'
  const cartItemCount = isMounted ? getTotalItems() : 0

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${isScrolled
        ? 'bg-neutral-snow/80 backdrop-blur-xl shadow-soft-lg'
        : 'bg-neutral-snow/90 backdrop-blur-md'
        }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <h1 className="font-primary text-2xl md:text-3xl font-semibold text-secondary-rose hover:text-secondary-rose-dark transition-colors">
              Sabor do Afeto
            </h1>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="font-secondary text-sm font-medium text-text-primary hover:text-secondary-rose transition-colors"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-4">
            {/* Cart Button */}
            <Button
              variant="ghost"
              size="icon"
              className="relative text-text-primary hover:text-secondary-rose"
              onClick={openCart}
            >
              <ShoppingBag className="h-5 w-5" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-secondary-rose text-white text-xs flex items-center justify-center font-secondary font-bold">
                  {cartItemCount}
                </span>
              )}
            </Button>

            {/* WhatsApp Button */}
            <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
              <Button className="bg-gradient-to-b from-secondary-rose to-secondary-rose-dark hover:from-secondary-rose-dark hover:to-[#c99196] text-white">
                <MessageCircle className="mr-2 h-4 w-4" />
                WhatsApp
              </Button>
            </a>
          </div>

          {/* Mobile Menu */}
          <div className="flex md:hidden items-center gap-2">
            {/* Mobile Cart Icon */}
            <Button
              variant="ghost"
              size="icon"
              className="relative text-text-primary"
              onClick={openCart}
            >
              <ShoppingBag className="h-5 w-5" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-secondary-rose text-white text-xs flex items-center justify-center font-secondary font-bold">
                  {cartItemCount}
                </span>
              )}
            </Button>

            {/* Mobile WhatsApp Icon */}
            <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
              <Button size="icon" variant="ghost" className="text-secondary-rose">
                <MessageCircle className="h-5 w-5" />
              </Button>
            </a>

            {/* Mobile Menu Trigger */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-text-primary"
                >
                  {isOpen ? (
                    <X className="h-6 w-6" />
                  ) : (
                    <Menu className="h-6 w-6" />
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <SheetHeader>
                  <SheetTitle className="font-primary text-2xl text-secondary-rose">
                    Menu
                  </SheetTitle>
                </SheetHeader>
                <nav className="flex flex-col gap-6 mt-8">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className="font-secondary text-lg font-medium text-text-primary hover:text-secondary-rose transition-colors"
                    >
                      {item.name}
                    </Link>
                  ))}
                  <a
                    href={whatsappLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4"
                  >
                    <Button className="w-full bg-gradient-to-b from-secondary-rose to-secondary-rose-dark hover:from-secondary-rose-dark hover:to-[#c99196] text-white">
                      <MessageCircle className="mr-2 h-4 w-4" />
                      Falar no WhatsApp
                    </Button>
                  </a>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  )
}
