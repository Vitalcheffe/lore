// ═══════════════════════════════════════════════════════════
// ClearPath AI — Blog Posts API
// GET: List published blog posts with pagination
// ═══════════════════════════════════════════════════════════

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = Math.max(1, Number(searchParams.get('page')) || 1);
    const pageSize = Math.min(50, Math.max(1, Number(searchParams.get('pageSize')) || 20));

    const [posts, total] = await Promise.all([
      db.blogPost.findMany({
        where: { published: true },
        include: {
          author: {
            select: { name: true },
          },
        },
        orderBy: { publishedAt: 'desc' },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      db.blogPost.count({
        where: { published: true },
      }),
    ]);

    const hasNext = page * pageSize < total;

    const data = posts.map((post) => ({
      id: post.id,
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      coverImage: post.coverImage,
      authorName: post.author.name ?? 'ClearPath AI Team',
      publishedAt: post.publishedAt,
      tags: JSON.parse(post.tags || '[]'),
    }));

    return NextResponse.json({
      data,
      total,
      page,
      pageSize,
      hasNext,
    });
  } catch (error) {
    console.error('Blog list error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch blog posts' },
      { status: 500 }
    );
  }
}
