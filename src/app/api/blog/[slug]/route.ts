// ═══════════════════════════════════════════════════════════
// ClearPath AI — Single Blog Post API
// GET: Retrieve a published blog post by slug
// ═══════════════════════════════════════════════════════════

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    const post = await db.blogPost.findUnique({
      where: { slug },
      include: {
        author: {
          select: { name: true },
        },
      },
    });

    if (!post || !post.published) {
      return NextResponse.json(
        { error: 'Blog post not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      data: {
        id: post.id,
        title: post.title,
        slug: post.slug,
        content: post.content,
        excerpt: post.excerpt,
        coverImage: post.coverImage,
        authorName: post.author.name ?? 'ClearPath AI Team',
        published: post.published,
        publishedAt: post.publishedAt,
        tags: JSON.parse(post.tags || '[]'),
        createdAt: post.createdAt,
        updatedAt: post.updatedAt,
      },
    });
  } catch (error) {
    console.error('Blog post fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch blog post' },
      { status: 500 }
    );
  }
}
