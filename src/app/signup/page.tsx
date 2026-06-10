'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import { motion, AnimatePresence } from 'framer-motion'
import confetti from 'canvas-confetti'
import { Brain, Mail, Lock, User, ArrowRight, Eye, EyeOff, Shield, Check, Loader2, Info, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip'

/* ── CSS keyframes for graph animation ── */
const graphStyles = `
@keyframes sfloat1 { 0%,100%{ transform: translate(0,0) } 33%{ transform: translate(5px,-8px) } 66%{ transform: translate(-3px,5px) } }
@keyframes sfloat2 { 0%,100%{ transform: translate(0,0) } 33%{ transform: translate(-7px,5px) } 66%{ transform: translate(4px,-7px) } }
@keyframes sfloat3 { 0%,100%{ transform: translate(0,0) } 33%{ transform: translate(3px,7px) } 66%{ transform: translate(-5px,-4px) } }
@keyframes sfloat4 { 0%,100%{ transform: translate(0,0) } 33%{ transform: translate(-4px,-6px) } 66%{ transform: translate(6px,3px) } }
@keyframes sfloat5 { 0%,100%{ transform: translate(0,0) } 33%{ transform: translate(7px,2px) } 66%{ transform: translate(-2px,-8px) } }
@keyframes sfloat6 { 0%,100%{ transform: translate(0,0) } 33%{ transform: translate(-2px,8px) } 66%{ transform: translate(5px,-3px) } }
@keyframes spulse-node { 0%,100%{ opacity:1 } 50%{ opacity:0.7 } }
@keyframes sglow-ring { 0%,100%{ opacity:0.2; r:20 } 50%{ opacity:0.05; r:28 } }

.signup-input:focus {
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
  { cx: 80, cy: 60, r: 16, fill: '#6EE7B7', label: 'API', fontSize: 8, float: 'sfloat1', duration: '7s', ringDuration: '3.5s' },
  { cx: 200, cy: 90, r: 22, fill: '#34D399', label: 'Core', fontSize: 10, float: 'sfloat2', duration: '8s', ringDuration: '4s' },
  { cx: 320, cy: 55, r: 14, fill: '#A7F3D0', label: 'DB', fontSize: 7, float: 'sfloat3', duration: '6.5s', ringDuration: '3s' },
  { cx: 130, cy: 155, r: 15, fill: '#6EE7B7', label: 'Auth', fontSize: 7, float: 'sfloat4', duration: '9s', ringDuration: '3.8s' },
  { cx: 280, cy: 150, r: 12, fill: '#A7F3D0', label: 'AI', fontSize: 6, float: 'sfloat5', duration: '7.5s', ringDuration: '4.2s' },
  { cx: 200, cy: 30, r: 11, fill: '#6EE7B7', label: 'ML', fontSize: 6, float: 'sfloat6', duration: '8.5s', ringDuration: '3.2s' },
]

const graphEdges = [
  { x1: 92, y1: 66, x2: 182, y2: 86 },
  { x1: 218, y1: 86, x2: 308, y2: 60 },
  { x1: 192, y1: 104, x2: 140, y2: 144 },
  { x1: 212, y1: 104, x2: 272, y2: 142 },
  { x1: 200, y1: 72, x2: 200, y2: 38 },
]

const benefits = [
  'Structured knowledge graph that grows with your team',
  'AI-powered recall with sources and confidence',
  'Morning digest so nothing falls through the cracks',
  'Multi-region consistency with Aurora DSQL',
]

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

  /* Profile strength: 0-100 based on filled fields */
  const profileStrength = useMemo(() => {
    let score = 0
    if (name.trim().length > 0) score += 25
    if (email.trim().length > 0) score += 25
    if (password.length >= 8) score += 25
    if (confirmPassword.length > 0 && confirmPassword === password) score += 25
    return score
  }, [name, email, password, confirmPassword])

  const strengthLabel = useMemo(() => {
    if (profileStrength === 0) return ''
    if (profileStrength <= 25) return 'Getting started'
    if (profileStrength <= 50) return 'Looking good'
    if (profileStrength <= 75) return 'Almost there'
    return 'Ready to go!'
  }, [profileStrength])

  const strengthColor = useMemo(() => {
    if (profileStrength <= 25) return '#F59E0B'
    if (profileStrength <= 50) return '#10B981'
    if (profileStrength <= 75) return '#059669'
    return '#0D9488'
  }, [profileStrength])

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

  const passwordStrength = passwordChecks.filter(c => c.met).length
  const passwordStrengthColor = passwordStrength <= 1 ? '#EF4444' : passwordStrength <= 2 ? '#F59E0B' : passwordStrength <= 3 ? '#10B981' : '#059669'
  const passwordStrengthLabel = passwordStrength <= 1 ? 'Weak' : passwordStrength <= 2 ? 'Fair' : passwordStrength <= 3 ? 'Strong' : 'Excellent'

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <style dangerouslySetInnerHTML={{ __html: graphStyles }} />

      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
        <div className="w-full max-w-5xl grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          {/* Left — Animated Branding Panel */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="hidden lg:flex flex-col justify-center relative rounded-3xl overflow-hidden p-10 bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-800 min-h-[620px]"
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
                Start building your<br />
                <span className="text-emerald-200">team&apos;s memory.</span>
              </h1>
              <p className="text-emerald-100/80 leading-relaxed mb-8">
                Create your account and start capturing knowledge, building connections, and getting AI-powered insights. Free to start.
              </p>

              {/* Animated Knowledge Graph */}
              <div className="rounded-2xl bg-white/10 backdrop-blur-sm border border-white/10 p-5 mb-8">
                <svg viewBox="0 0 400 190" className="w-full h-auto" fill="none">
                  {graphEdges.map((e, i) => (
                    <line key={i} x1={e.x1} y1={e.y1} x2={e.x2} y2={e.y2} stroke="white" strokeWidth="1.5" opacity="0.2" />
                  ))}
                  {graphNodes.map((n, i) => (
                    <g key={i} style={{ animation: `${n.float} ${n.duration} ease-in-out infinite` }}>
                      <circle
                        cx={n.cx} cy={n.cy}
                        style={{ animation: `sglow-ring ${n.ringDuration} ease-in-out infinite`, animationDelay: `${i * 0.3}s` }}
                        fill="none"
                        stroke="white"
                        strokeWidth="1"
                      />
                      <circle
                        cx={n.cx} cy={n.cy} r={n.r}
                        fill={n.fill}
                        opacity="0.9"
                        style={{ animation: `spulse-node ${n.ringDuration} ease-in-out infinite`, animationDelay: `${i * 0.3}s` }}
                      />
                      <text x={n.cx} y={n.cy + n.fontSize / 3} textAnchor="middle" fill="#065F46" fontSize={n.fontSize} fontWeight="700">
                        {n.label}
                      </text>
                    </g>
                  ))}
                </svg>
              </div>

              {/* Benefits with animated check marks */}
              <div className="space-y-3">
                {benefits.map((text, i) => (
                  <motion.div
                    key={text}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + i * 0.15, duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/10"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.7 + i * 0.15, type: 'spring', stiffness: 300, damping: 15 }}
                      className="w-6 h-6 rounded-md bg-white/20 flex items-center justify-center shrink-0"
                    >
                      <Check className="w-3.5 h-3.5 text-white" strokeWidth={2.5} />
                    </motion.div>
                    <span className="text-sm text-white/90 font-medium">{text}</span>
                  </motion.div>
                ))}
              </div>
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
                {/* Profile Strength Indicator */}
                <AnimatePresence>
                  {profileStrength > 0 && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mb-5 overflow-hidden"
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5" style={{ color: strengthColor }} />
                          <span className="text-xs font-semibold" style={{ color: strengthColor }}>
                            {strengthLabel}
                          </span>
                        </div>
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                          {profileStrength}% complete
                        </span>
                      </div>
                      <div className="h-1.5 w-full rounded-full bg-gray-100 overflow-hidden">
                        <motion.div
                          className="h-full rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${profileStrength}%` }}
                          transition={{ duration: 0.5, ease: 'easeOut' }}
                          style={{ backgroundColor: strengthColor }}
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

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
                        className="signup-input pl-10 h-11 rounded-xl border-[#E5E7EB] bg-[#F9FAFB] focus:bg-white transition-all duration-200"
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
                        className="signup-input pl-10 h-11 rounded-xl border-[#E5E7EB] bg-[#F9FAFB] focus:bg-white transition-all duration-200"
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
                        className="signup-input pl-10 pr-10 h-11 rounded-xl border-[#E5E7EB] bg-[#F9FAFB] focus:bg-white transition-all duration-200"
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
                    {/* Enhanced Password strength */}
                    {password.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="pt-2 overflow-hidden"
                      >
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                            Password strength
                          </span>
                          <motion.span
                            key={passwordStrengthLabel}
                            initial={{ opacity: 0, y: -4 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-[10px] font-bold uppercase tracking-wider"
                            style={{ color: passwordStrengthColor }}
                          >
                            {passwordStrengthLabel}
                          </motion.span>
                        </div>
                        {/* Multi-segment strength bar */}
                        <div className="flex gap-1 mb-3">
                          {[0, 1, 2, 3].map((i) => (
                            <motion.div
                              key={i}
                              className="h-1 flex-1 rounded-full"
                              initial={{ backgroundColor: '#E5E7EB' }}
                              animate={{
                                backgroundColor: i < passwordStrength ? passwordStrengthColor : '#E5E7EB',
                              }}
                              transition={{ duration: 0.3, ease: 'easeOut' }}
                            />
                          ))}
                        </div>
                        {/* Password checks */}
                        <div className="grid grid-cols-2 gap-2">
                          {passwordChecks.map((check) => (
                            <motion.div
                              key={check.label}
                              className="flex items-center gap-1.5"
                              animate={{ opacity: 1 }}
                            >
                              <motion.div
                                className="w-3.5 h-3.5 rounded-full flex items-center justify-center"
                                animate={{
                                  backgroundColor: check.met ? passwordStrengthColor : '#E5E7EB',
                                  scale: check.met ? [1, 1.2, 1] : 1,
                                }}
                                transition={{ duration: 0.3 }}
                              >
                                {check.met && (
                                  <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                                  >
                                    <Check className="w-2 h-2 text-white" />
                                  </motion.div>
                                )}
                              </motion.div>
                              <span className={`text-[11px] font-medium transition-colors duration-300 ${check.met ? 'text-emerald-600' : 'text-gray-400'}`}>
                                {check.label}
                              </span>
                            </motion.div>
                          ))}
                        </div>
                      </motion.div>
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
                        className={`signup-input pl-10 pr-10 h-11 rounded-xl border-[#E5E7EB] bg-[#F9FAFB] focus:bg-white transition-all duration-200 ${
                          confirmPassword && confirmPassword !== password ? 'border-red-200 focus:border-red-300!' : ''
                        }`}
                        required
                      />
                      {confirmPassword && confirmPassword === password && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                        >
                          <Check className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-500" />
                        </motion.div>
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
                      <motion.p
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-[11px] text-red-500 font-medium"
                      >
                        Passwords don&apos;t match
                      </motion.p>
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
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button type="button" className="mt-0.5 shrink-0 text-gray-400 hover:text-gray-600 transition-colors">
                          <Info className="w-3.5 h-3.5" />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent side="top" className="max-w-[260px] text-[11px] leading-relaxed bg-[#0F172A] text-white px-3 py-2 rounded-lg">
                        By signing up, you agree to our Terms of Service and Privacy Policy. We respect your data and never sell it to third parties.
                      </TooltipContent>
                    </Tooltip>
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
                      disabled={isLoading || !agreed}
                      className="w-full h-11 rounded-xl text-sm font-semibold bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-md shadow-emerald-500/20 hover:shadow-lg hover:shadow-emerald-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-md"
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
                  </motion.div>
                </form>

                {/* Divider */}
                <div className="flex items-center gap-4 my-6">
                  <div className="flex-1 h-px bg-[#E5E7EB]" />
                  <span className="text-xs text-gray-400 font-medium uppercase tracking-wider">or</span>
                  <div className="flex-1 h-px bg-[#E5E7EB]" />
                </div>

                {/* Google OAuth — more prominent */}
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full h-12 rounded-xl text-sm font-semibold border-[#E5E7EB] bg-white hover:bg-[#F9FAFB] hover:border-gray-300 hover:shadow-md transition-all duration-200"
                    onClick={() => signIn('google', { callbackUrl: '/app' })}
                  >
                    <svg className="w-5 h-5 mr-2.5" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                    Continue with Google
                  </Button>
                </motion.div>

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
