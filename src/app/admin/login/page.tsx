'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase-browser'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Lock, Mail, AlertCircle, Loader2 } from 'lucide-react'

export default function AdminLogin() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    console.log('🔐 Tentando fazer login com:', email)

    try {
      const supabase = createClient()

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      console.log('📦 Resposta do Supabase:', { data, error })

      if (error) {
        console.error('❌ Erro do Supabase:', error)
        throw error
      }

      if (data.session) {
        console.log('✅ Login bem-sucedido! Sessão criada:', data.session.user.email)
        console.log('⏳ Aguardando cookies serem salvos...')

        // Aguardar 500ms para garantir que os cookies sejam salvos
        await new Promise(resolve => setTimeout(resolve, 500))

        console.log('🔄 Redirecionando para dashboard...')

        // Usar window.location para forçar um reload completo
        // Isso garante que o middleware detecte a sessão
        window.location.href = '/admin/dashboard'
      } else {
        console.warn('⚠️ Login retornou sem sessão')
        throw new Error('Nenhuma sessão foi criada')
      }
    } catch (error: any) {
      console.error('💥 Erro capturado:', error)
      setError(error.message || 'Erro ao fazer login. Verifique suas credenciais.')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-neutral-snow flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-primary-sage opacity-[0.05] rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-secondary-rose opacity-[0.04] rounded-full blur-[100px] translate-x-1/3 translate-y-1/3"></div>

      <div className="w-full max-w-md relative z-10">
        {/* Card de Login */}
        <div className="bg-glass-white backdrop-blur-lg border-0 shadow-soft-lg rounded-modern-lg p-8 space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <h1 className="font-primary text-4xl font-light text-text-primary">
              <span className="text-secondary-rose">Sabor</span> do Afeto
            </h1>
            <p className="font-secondary text-sm text-text-secondary">
              Painel Administrativo
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            {/* Email */}
            <div className="space-y-2">
              <label className="font-secondary text-sm font-medium text-text-primary">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-light" />
                <Input
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 h-12 border-2"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            {/* Senha */}
            <div className="space-y-2">
              <label className="font-secondary text-sm font-medium text-text-primary">
                Senha
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-light" />
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 h-12 border-2"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <p className="font-secondary text-sm text-red-700">{error}</p>
              </div>
            )}

            {/* Botão de Login */}
            <Button
              type="submit"
              size="lg"
              className="w-full bg-gradient-to-b from-secondary-rose to-secondary-rose-dark hover:from-secondary-rose-dark hover:to-[#c99196] text-white shadow-soft"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Entrando...
                </>
              ) : (
                'Entrar'
              )}
            </Button>
          </form>

          {/* Footer */}
          <div className="pt-4 border-t border-primary-sage/10">
            <p className="font-secondary text-xs text-text-secondary text-center">
              Acesso restrito apenas para administradores
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
