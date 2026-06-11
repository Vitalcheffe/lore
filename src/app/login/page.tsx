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
import { Checkbox } from '@/components/ui/checkbox'

/* ── CSS keyframes for graph animation ── */
const graphStyles = `
@keyframes float1 { 0%,100%{ transform: translate(0,0) } 33%{ transform: translate(6px,-10px) } 66%{ transform: translate(-4px,6px) } }
@keyframes float2 { 0%,100%{ transform: translate(0,0) } 33%{ transform: translate(-8px,6px) } 66%{ transform: translate(5px,-8px) } }
@keyframes float3 { 0%,100%{ transform: translate(0,0) } 33%{ transform: translate(4px,8px) } 66%{ transform: translate(-6px,-5px) } }
@keyframes float4 { 0%,100%{ transform: translate(0,0) } 33%{ transform: translate(-5px,-7px) } 66%{ transform: translate(7px,4px) } }
@keyframes float5 { 0%,100%{ transform: translate(0,0) } 33%{ transform: translate(8px,3px) } 66%{ transform: translate(-3px,-9px) } }
@keyframes float6 { 0%,100%{ transform: translate(0,0) } 33%{ transform: translate(-3px,9px) } 66%{ transform: translate(6px,-4px) } }
@keyframes pulse-node { 0%,100%{ opacity:1 } 50%{ opacity:0.7 } }
@keyframes glow-ring { 0%,100%{ opacity:0.2; r:20 } 50%{ opacity:0.05; r:28 } }
@keyframes dot-float { 0%,100%{ transform:translateY(0) } 50%{ transform:translateY(-8px) } }

.login-input:focus {
  box-shadow: 0 0 0 3px rgba(16,185,129,0.15);
  border-color: #10B981 !important;
}
`

interface GraphNode {
  cx: number
  cy: number
  r: number
  fill: string
  label: string
  fontSize: number
  float: string
  duration: string
  ringDuration: string
}

const graphNodes: GraphNode[] = [
  { cx: 80, cy: 60, r: 16, fill: '#6EE7B7', label: 'API', fontSize: 8, float: 'float1', duration: '7s', ringDuration: '3.5s' },
  { cx: 200, cy: 90, r: 22, fill: '#34D399', label: 'Core', fontSize: 10, float: 'float2', duration: '8s', ringDuration: '4s' },
  { cx: 320, cy: 55, r: 14, fill: '#A7F3D0', label: 'DB', fontSize: 7, float: 'float3', duration: '6.5s', ringDuration: '3s' },
  { cx: 130, cy: 155, r: 15, fill: '#6EE7B7', label: 'Auth', fontSize: 7, float: 'float4', duration: '9s', ringDuration: '3.8s' },
  { cx: 280, cy: 150, r: 12, fill: '#A7F3D0', label: 'AI', fontSize: 6, float: 'float5', duration: '7.5s', ringDuration: '4.2s' },
  { cx: 200, cy: 30, r: 11, fill: '#6EE7B7', label: 'ML', fontSize: 6, float: 'float6', duration: '8.5s', ringDuration: '3.2s' },
]

const graphEdges = [
  { x1: 92, y1: 66, x2: 182, y2: 86 },
  { x1: 218, y1: 86, x2: 308, y2: 60 },
  { x1: 192, y1: 104, x2: 140, y2: 144 },
  { x1: 212, y1: 104, x2: 272, y2: 142 },
  { x1: 200, y1: 72, x2: 200, y2: 38 },
]

export default function LoginPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
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
    <div className="min-h-screen flex flex-col bg-white dark:bg-[#0F0F12]">
      <style dangerouslySetInnerHTML={{ __html: graphStyles }} />

      {/* Top nav spacer */}
      <div className="h-0" />

      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
        <div className="w-full max-w-5xl grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          {/* Left — Animated Branding Panel */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="hidden lg:flex flex-col justify-center relative rounded-3xl overflow-hidden p-10 bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-800 min-h-[580px]"
          >
            {/* Particle dot background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {Array.from({ length: 40 }).map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute rounded-full bg-white/10"
                  style={{
                    width: Math.random() * 4 + 1,
                    height: Math.random() * 4 + 1,
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                  }}
                  animate={{
                    y: [0, -(Math.random() * 20 + 5), 0],
                    opacity: [0.1, 0.35, 0.1],
                  }}
                  transition={{
                    duration: Math.random() * 4 + 3,
                    repeat: Infinity,
                    ease: 'easeInOut',
                    delay: Math.random() * 4,
                  }}
                />
              ))}
            </div>

            {/* Content */}
            <div className="relative z-10">
              <Link href="/" className="flex items-center gap-2.5 mb-8">
                <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg">
                  <Brain className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold tracking-tight text-white">LORE</span>
              </Link>
              <h1 className="text-3xl font-extrabold text-white leading-tight mb-3">
                Your team&apos;s memory,<br />
                <span className="text-emerald-200">always alive.</span>
              </h1>
              <p className="text-emerald-100/80 leading-relaxed mb-8">
                Sign in to access your knowledge graph, morning digest, and AI-powered recall. Lore keeps your team aligned, always.
              </p>

              {/* Animated Knowledge Graph */}
              <div className="rounded-2xl bg-white/10 backdrop-blur-sm border border-white/10 p-6">
                <svg viewBox="0 0 400 190" className="w-full h-auto" fill="none">
                  {/* Edges */}
                  {graphEdges.map((e, i) => (
                    <line
                      key={i}
                      x1={e.x1} y1={e.y1} x2={e.x2} y2={e.y2}
                      stroke="white"
                      strokeWidth="1.5"
                      opacity="0.2"
                    />
                  ))}

                  {/* Animated nodes */}
                  {graphNodes.map((n, i) => (
                    <g key={i} style={{ animation: `${n.float} ${n.duration} ease-in-out infinite` }}>
                      {/* Glow ring */}
                      <circle
                        cx={n.cx} cy={n.cy}
                        style={{ animation: `glow-ring ${n.ringDuration} ease-in-out infinite`, animationDelay: `${i * 0.3}s` }}
                        fill="none"
                        stroke="white"
                        strokeWidth="1"
                      />
                      {/* Node */}
                      <circle
                        cx={n.cx} cy={n.cy} r={n.r}
                        fill={n.fill}
                        opacity="0.9"
                        style={{ animation: `pulse-node ${n.ringDuration} ease-in-out infinite`, animationDelay: `${i * 0.3}s` }}
                      />
                      <text x={n.cx} y={n.cy + n.fontSize / 3} textAnchor="middle" fill="#065F46" fontSize={n.fontSize} fontWeight="700">
                        {n.label}
                      </text>
                    </g>
                  ))}
                </svg>
              </div>
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
                <span className="text-lg font-bold tracking-tight text-[#0F172A] dark:text-[#FAFAFA]">LORE</span>
              </Link>
              <h1 className="text-2xl font-extrabold text-[#0F172A] dark:text-[#FAFAFA]">Welcome back</h1>
              <p className="text-sm text-[#475569] dark:text-[#A1A1AA] mt-1">Sign in to your Lore account</p>
            </div>

            <Card className="border-[#E5E7EB] dark:border-[rgba(255,255,255,0.08)] shadow-sm rounded-2xl bg-white dark:bg-[#0F0F12]">
              <CardHeader className="hidden lg:block pb-2">
                <CardTitle className="text-2xl font-bold text-[#0F172A] dark:text-[#FAFAFA]">Welcome back</CardTitle>
                <CardDescription className="text-[#475569] dark:text-[#A1A1AA]">Sign in to your Lore account</CardDescription>
              </CardHeader>
              <CardContent className="pt-4 lg:pt-2">
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Email */}
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-[#0F172A] dark:text-[#FAFAFA] text-sm font-medium">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="login-input pl-10 h-11 rounded-xl border-[#E5E7EB] dark:border-[rgba(255,255,255,0.08)] bg-[#F9FAFB] dark:bg-[#09090B] focus:bg-white dark:focus:bg-[#0F0F12] transition-all duration-200"
                        required
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password" className="text-[#0F172A] dark:text-[#FAFAFA] text-sm font-medium">Password</Label>
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
                        className="login-input pl-10 pr-10 h-11 rounded-xl border-[#E5E7EB] dark:border-[rgba(255,255,255,0.08)] bg-[#F9FAFB] dark:bg-[#09090B] focus:bg-white dark:focus:bg-[#0F0F12] transition-all duration-200"
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

                  {/* Remember me */}
                  <div className="flex items-center gap-2.5">
                    <Checkbox
                      id="remember"
                      checked={rememberMe}
                      onCheckedChange={(checked) => setRememberMe(checked === true)}
                      className="data-[state=checked]:bg-emerald-600 data-[state=checked]:border-emerald-600"
                    />
                    <label htmlFor="remember" className="text-sm text-[#475569] dark:text-[#A1A1AA] cursor-pointer select-none">
                      Remember me
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
                  <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}>
                    <Button
                      type="submit"
                      disabled={isLoading || !email || !password}
                      className="w-full h-11 rounded-xl text-sm font-semibold bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-md shadow-emerald-500/20 hover:shadow-lg hover:shadow-emerald-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-md"
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
                  </motion.div>
                </form>

                {/* Divider */}
                <div className="flex items-center gap-4 my-6">
                  <div className="flex-1 h-px bg-[#E5E7EB] dark:bg-[rgba(255,255,255,0.08)]" />
                  <span className="text-xs text-gray-400 font-medium uppercase tracking-wider">or</span>
                  <div className="flex-1 h-px bg-[#E5E7EB] dark:bg-[rgba(255,255,255,0.08)]" />
                </div>

                {/* Google OAuth — more prominent */}
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full h-12 rounded-xl text-sm font-semibold border-[#E5E7EB] dark:border-[rgba(255,255,255,0.08)] bg-white dark:bg-[#0F0F12] hover:bg-[#F9FAFB] dark:hover:bg-[#18181B] hover:border-gray-300 dark:hover:border-[rgba(255,255,255,0.12)] hover:shadow-md transition-all duration-200"
                    onClick={() => signIn('google', { callbackUrl: '/app' })}
                  >
                    <svg className="w-5 h-5 mr-2.5" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                    Continue with Google
                  </Button>
                </motion.div>

                {/* Sign up link */}
                <p className="text-center text-sm text-[#475569] dark:text-[#A1A1AA] mt-6">
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

            {/* Social proof — trusted by teams */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="mt-8 text-center"
            >
              <p className="text-[11px] text-gray-400 font-medium uppercase tracking-wider mb-3">
                Trusted by teams at
              </p>
              <div className="flex items-center justify-center flex-wrap gap-2">
                {['Acme Corp', 'NovaTech', 'Meridian', 'Apex Labs', 'Vantage AI'].map((name) => (
                  <span
                    key={name}
                    className="inline-flex items-center px-3 py-1.5 rounded-lg bg-[#F9FAFB] dark:bg-[#18181B] border border-[#E5E7EB] dark:border-[rgba(255,255,255,0.08)] text-[11px] font-semibold text-gray-500 dark:text-gray-400 tracking-tight"
                  >
                    {name}
                  </span>
                ))}
              </div>
              <p className="mt-3 text-xs text-gray-400 font-medium">
                Join <span className="text-emerald-600 font-bold">2,000+</span> knowledge workers
              </p>
            </motion.div>
          </motion.div>
        </div>
      </main>
    </div>
  )
}
