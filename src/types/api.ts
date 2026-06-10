// ═══════════════════════════════════════════════════════════
// ClearPath AI — API Types
// ═══════════════════════════════════════════════════════════

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  hasNext: boolean;
}

export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface NewsletterFormData {
  email: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  coverImage: string | null;
  authorId: string;
  authorName: string;
  published: boolean;
  publishedAt: string | null;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface FeedbackData {
  classificationId: string;
  rating: number;
  comment?: string;
}
