'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import { motion } from 'framer-motion'
import confetti from 'canvas-confetti'
import { Brain, Mail, Lock, User, ArrowRight, Eye, EyeOff, Shield, Check, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'

export default function SignupPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [agreed, setAgreed] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [authError, setAuthError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !email || !password || !confirmPassword) {
      setAuthError('Please fill in all required fields')
      return
    }
    if (password !== confirmPassword) {
      setAuthError('Passwords don\'t match')
      return
    }
    if (password.length < 8) {
      setAuthError('Password must be at least 8 characters')
      return
    }
    if (!agreed) {
      setAuthError('You must agree to the Terms of Service and Privacy Policy')
      return
    }

    setIsLoading(true)
    setAuthError('')

    try {
      const registerRes = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      })

      const registerData = await registerRes.json()

      if (!registerRes.ok) {
        setAuthError(registerData.error || 'Registration failed. Please try again.')
        setIsLoading(false)
        return
      }

      // Auto sign in
      const signInResult = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })

      if (signInResult?.error) {
        router.push('/login')
      } else if (signInResult?.ok) {
        // Celebrate! 🎉
        const duration = 1500
        const end = Date.now() + duration
        const colors = ['#059669', '#10B981', '#34D399', '#6EE7B7', '#A7F3D0']

        ;(function frame() {
          confetti({
            particleCount: 3,
            angle: 60,
            spread: 55,
            origin: { x: 0 },
            colors,
          })
          confetti({
            particleCount: 3,
            angle: 120,
            spread: 55,
            origin: { x: 1 },
            colors,
          })
          if (Date.now() < end) {
            requestAnimationFrame(frame)
          }
        })()

        router.push('/app')
      }
    } catch {
      setAuthError('An unexpected error occurred. Please try again.')
      setIsLoading(false)
    }
  }

  const passwordChecks = [
    { label: '8+ characters', met: password.length >= 8 },
    { label: 'Uppercase letter', met: /[A-Z]/.test(password) },
    { label: 'Number', met: /[0-9]/.test(password) },
    { label: 'Special character', met: /[^A-Za-z0-9]/.test(password) },
  ]

  return (
    <div className="min-h-screen flex flex-col bg-white">
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
              Start building your<br />
              <span className="gradient-text">team&apos;s memory.</span>
            </h1>
            <p className="text-[#475569] leading-relaxed mb-8">
              Create your account and start capturing knowledge, building connections, and getting AI-powered insights. Free to start.
            </p>

            {/* Benefits */}
            <div className="space-y-3">
              {[
                'Structured knowledge graph that grows with your team',
                'AI-powered recall with sources and confidence',
                'Morning digest so nothing falls through the cracks',
                'Multi-region consistency with Aurora DSQL',
              ].map((text, i) => (
                <motion.div
                  key={text}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.1, duration: 0.4 }}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[#F9FAFB] border border-[#E5E7EB]"
                >
                  <div className="w-6 h-6 rounded-md bg-emerald-100 flex items-center justify-center shrink-0">
                    <Check className="w-3.5 h-3.5 text-emerald-600" strokeWidth={2.5} />
                  </div>
                  <span className="text-sm text-[#0F172A] font-medium">{text}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right — Signup Form */}
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
              <h1 className="text-2xl font-extrabold text-[#0F172A]">Create your account</h1>
              <p className="text-sm text-[#475569] mt-1">Get started with Lore for free</p>
            </div>

            <Card className="border-[#E5E7EB] shadow-sm rounded-2xl">
              <CardHeader className="hidden lg:block pb-2">
                <CardTitle className="text-2xl font-bold text-[#0F172A]">Create your account</CardTitle>
                <CardDescription className="text-[#475569]">Get started with Lore for free</CardDescription>
              </CardHeader>
              <CardContent className="pt-4 lg:pt-2">
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Full Name */}
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-[#0F172A] text-sm font-medium">Full Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        id="name"
                        type="text"
                        placeholder="Jane Smith"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="pl-10 h-11 rounded-xl border-[#E5E7EB] bg-[#F9FAFB] focus:bg-white"
                        required
                      />
                    </div>
                  </div>

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
                    <Label htmlFor="password" className="text-[#0F172A] text-sm font-medium">Password</Label>
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
                    {/* Password strength checks */}
                    {password.length > 0 && (
                      <div className="grid grid-cols-2 gap-2 pt-1">
                        {passwordChecks.map((check) => (
                          <div key={check.label} className="flex items-center gap-1.5">
                            <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center ${check.met ? 'bg-emerald-500' : 'bg-gray-200'}`}>
                              {check.met && <Check className="w-2 h-2 text-white" />}
                            </div>
                            <span className={`text-[11px] font-medium ${check.met ? 'text-emerald-600' : 'text-gray-400'}`}>
                              {check.label}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Confirm Password */}
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="text-[#0F172A] text-sm font-medium">Confirm Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? 'text' : 'password'}
                        placeholder="••••••••"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className={`pl-10 pr-10 h-11 rounded-xl border-[#E5E7EB] bg-[#F9FAFB] focus:bg-white ${
                          confirmPassword && confirmPassword !== password ? 'border-red-200' : ''
                        }`}
                        required
                      />
                      {confirmPassword && confirmPassword === password && (
                        <Check className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-500" />
                      )}
                      {!confirmPassword && (
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                          {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      )}
                    </div>
                    {confirmPassword && confirmPassword !== password && (
                      <p className="text-[11px] text-red-500 font-medium">Passwords don&apos;t match</p>
                    )}
                  </div>

                  {/* Terms checkbox */}
                  <div className="flex items-start gap-3 pt-1">
                    <Checkbox
                      id="terms"
                      checked={agreed}
                      onCheckedChange={(checked) => setAgreed(checked === true)}
                      className="mt-0.5 data-[state=checked]:bg-emerald-600 data-[state=checked]:border-emerald-600"
                    />
                    <label htmlFor="terms" className="text-sm text-[#475569] leading-relaxed cursor-pointer">
                      I agree to the{' '}
                      <Link href="/terms" className="font-medium text-emerald-600 hover:text-emerald-500 transition-colors">Terms of Service</Link>
                      {' '}and{' '}
                      <Link href="/privacy" className="font-medium text-emerald-600 hover:text-emerald-500 transition-colors">Privacy Policy</Link>
                    </label>
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
                    disabled={isLoading || !agreed}
                    className="w-full h-11 rounded-xl text-sm font-semibold bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-md shadow-emerald-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                        Creating account...
                      </>
                    ) : (
                      <>
                        Create Account
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

                {/* Sign in link */}
                <p className="text-center text-sm text-[#475569] mt-6">
                  Already have an account?{' '}
                  <Link href="/login" className="font-semibold text-emerald-600 hover:text-emerald-500 transition-colors">
                    Sign in
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
