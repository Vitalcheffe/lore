'use client'

import { useQuery } from '@tanstack/react-query'
import { useParams, useRouter } from 'next/navigation'
import ReactMarkdown from 'react-markdown'
import { ArrowLeft, Calendar, User, AlertCircle } from 'lucide-react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { GlassCard, LoadingSpinner } from '@/components/shared'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

export default function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>()
  const router = useRouter()
  const { data, isLoading, error } = useQuery({
    queryKey: ['blog', slug],
    queryFn: async () => {
      const res = await fetch(`/api/blog/${slug}`)
      if (!res.ok) throw new Error('Not found')
      return res.json()
    },
    enabled: !!slug,
  })

  const post = data?.data

  return (
    <div className="min-h-screen flex flex-col bg-[#0a0a0f]">
      <Navbar />
      <main className="flex-1 pt-24 pb-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <Button variant="ghost" className="text-white/60 hover:text-white hover:bg-white/5 mb-6" onClick={() => router.push('/blog')}>
            <ArrowLeft className="w-4 h-4 mr-2" />Back to Blog
          </Button>

          {isLoading ? (
            <LoadingSpinner size="lg" label="Loading post..." />
          ) : error || !post ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <AlertCircle className="w-16 h-16 text-white/20" />
              <h2 className="text-xl font-bold text-white">Post not found</h2>
              <p className="text-white/50">The blog post you&apos;re looking for doesn&apos;t exist.</p>
              <Button variant="outline" className="border-white/10 text-white hover:bg-white/5 mt-2" onClick={() => router.push('/blog')}>Browse all posts</Button>
            </div>
          ) : (
            <GlassCard hover={false} className="p-8 sm:p-10">
              <div className="flex flex-wrap gap-2 mb-4">
                {post.tags?.map((tag: string) => (
                  <Badge key={tag} variant="outline" className="border-white/10 text-white/50">{tag}</Badge>
                ))}
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold text-white leading-tight">{post.title}</h1>
              <div className="flex items-center gap-4 mt-4 text-sm text-white/50">
                <span className="flex items-center gap-1.5"><User className="w-4 h-4" />{post.authorName}</span>
                {post.publishedAt && <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" />{new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>}
              </div>
              <div className="mt-8 prose prose-invert prose-violet max-w-none
                prose-headings:text-white prose-p:text-white/70 prose-a:text-violet-400
                prose-strong:text-white prose-code:text-violet-300 prose-pre:bg-white/5">
                <ReactMarkdown>{post.content || ''}</ReactMarkdown>
              </div>
            </GlassCard>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}
