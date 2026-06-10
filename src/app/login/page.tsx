'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import { motion } from 'framer-motion'
import { Brain, Mail, Lock, ArrowRight, Eye, EyeOff, Shield, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'

export default function LoginPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [authError, setAuthError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) return
    setIsLoading(true)
    setAuthError('')
    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })
      if (result?.error) {
        setAuthError(result.error === 'CredentialsSignin' ? 'Invalid email or password' : result.error)
        setIsLoading(false)
      } else if (result?.ok) {
        router.push('/app')
      }
    } catch {
      setAuthError('An unexpected error occurred. Please try again.')
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Top nav spacer */}
      <div className="h-0" />

      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
        <div className="w-full max-w-5xl grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          {/* Left — Branding */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="hidden lg:flex flex-col justify-center"
          >
            <Link href="/" className="flex items-center gap-2.5 mb-8">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-md shadow-emerald-500/20">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold tracking-tight text-[#0F172A]">LORE</span>
            </Link>
            <h1 className="text-3xl font-extrabold text-[#0F172A] leading-tight mb-3">
              Your team&apos;s memory,<br />
              <span className="gradient-text">always alive.</span>
            </h1>
            <p className="text-[#475569] leading-relaxed mb-8">
              Sign in to access your knowledge graph, morning digest, and AI-powered recall. Lore keeps your team aligned, always.
            </p>
            {/* Illustration */}
            <div className="rounded-2xl bg-[#F9FAFB] border border-[#E5E7EB] p-6">
              <svg viewBox="0 0 300 160" className="w-full h-auto" fill="none">
                <line x1="60" y1="50" x2="150" y2="80" stroke="#D1FAE5" strokeWidth="2" />
                <line x1="150" y1="80" x2="240" y2="45" stroke="#D1FAE5" strokeWidth="2" />
                <line x1="150" y1="80" x2="100" y2="130" stroke="#D1FAE5" strokeWidth="2" />
                <line x1="150" y1="80" x2="210" y2="125" stroke="#D1FAE5" strokeWidth="2" />
                <circle cx="60" cy="50" r="14" fill="#10B981" opacity="0.9" />
                <circle cx="150" cy="80" r="18" fill="#059669" opacity="0.95" />
                <circle cx="240" cy="45" r="12" fill="#34D399" opacity="0.8" />
                <circle cx="100" cy="130" r="13" fill="#0D9488" opacity="0.85" />
                <circle cx="210" cy="125" r="10" fill="#14B8A6" opacity="0.75" />
                <text x="60" y="54" textAnchor="middle" fill="white" fontSize="8" fontWeight="600">API</text>
                <text x="150" y="84" textAnchor="middle" fill="white" fontSize="9" fontWeight="700">Core</text>
                <text x="240" y="49" textAnchor="middle" fill="white" fontSize="7" fontWeight="600">DB</text>
                <text x="100" y="134" textAnchor="middle" fill="white" fontSize="7" fontWeight="600">Auth</text>
                <text x="210" y="129" textAnchor="middle" fill="white" fontSize="6" fontWeight="600">AI</text>
              </svg>
            </div>
          </motion.div>

          {/* Right — Login Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="w-full max-w-md mx-auto lg:mx-0"
          >
            {/* Mobile branding */}
            <div className="lg:hidden text-center mb-6">
              <Link href="/" className="inline-flex items-center gap-2.5 mb-4">
                <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-md">
                  <Brain className="w-4 h-4 text-white" />
                </div>
                <span className="text-lg font-bold tracking-tight text-[#0F172A]">LORE</span>
              </Link>
              <h1 className="text-2xl font-extrabold text-[#0F172A]">Welcome back</h1>
              <p className="text-sm text-[#475569] mt-1">Sign in to your Lore account</p>
            </div>

            <Card className="border-[#E5E7EB] shadow-sm rounded-2xl">
              <CardHeader className="hidden lg:block pb-2">
                <CardTitle className="text-2xl font-bold text-[#0F172A]">Welcome back</CardTitle>
                <CardDescription className="text-[#475569]">Sign in to your Lore account</CardDescription>
              </CardHeader>
              <CardContent className="pt-4 lg:pt-2">
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Email */}
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-[#0F172A] text-sm font-medium">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10 h-11 rounded-xl border-[#E5E7EB] bg-[#F9FAFB] focus:bg-white"
                        required
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password" className="text-[#0F172A] text-sm font-medium">Password</Label>
                      <Link href="/forgot-password" className="text-xs font-medium text-emerald-600 hover:text-emerald-500 transition-colors">
                        Forgot password?
                      </Link>
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-10 pr-10 h-11 rounded-xl border-[#E5E7EB] bg-[#F9FAFB] focus:bg-white"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Error */}
                  {authError && (
                    <motion.div
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center gap-2 px-4 py-3 rounded-xl bg-red-50 border border-red-100"
                    >
                      <Shield className="w-4 h-4 text-red-500 shrink-0" />
                      <span className="text-sm text-red-600 font-medium">{authError}</span>
                    </motion.div>
                  )}

                  {/* Submit */}
                  <Button
                    type="submit"
                    disabled={isLoading || !email || !password}
                    className="w-full h-11 rounded-xl text-sm font-semibold bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-md shadow-emerald-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                        Signing in...
                      </>
                    ) : (
                      <>
                        Sign In
                        <ArrowRight className="w-4 h-4 ml-1" />
                      </>
                    )}
                  </Button>
                </form>

                {/* Divider */}
                <div className="flex items-center gap-4 my-6">
                  <div className="flex-1 h-px bg-[#E5E7EB]" />
                  <span className="text-xs text-gray-400 font-medium uppercase tracking-wider">or</span>
                  <div className="flex-1 h-px bg-[#E5E7EB]" />
                </div>

                {/* Google OAuth */}
                <Button
                  type="button"
                  variant="outline"
                  className="w-full h-11 rounded-xl text-sm font-medium border-[#E5E7EB] bg-white hover:bg-[#F9FAFB]"
                  onClick={() => signIn('google', { callbackUrl: '/app' })}
                >
                  <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                  Continue with Google
                </Button>

                {/* Sign up link */}
                <p className="text-center text-sm text-[#475569] mt-6">
                  Don&apos;t have an account?{' '}
                  <Link href="/signup" className="font-semibold text-emerald-600 hover:text-emerald-500 transition-colors">
                    Sign up
                  </Link>
                </p>
              </CardContent>
            </Card>

            {/* Trust indicators */}
            <div className="flex items-center justify-center gap-4 mt-5">
              <div className="flex items-center gap-1.5 text-[11px] text-gray-400 font-medium">
                <Shield className="w-3.5 h-3.5 text-emerald-500" />
                Privacy by design
              </div>
              <div className="flex items-center gap-1.5 text-[11px] text-gray-400 font-medium">
                <Lock className="w-3.5 h-3.5 text-emerald-500" />
                End-to-end encrypted
              </div>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  )
}
