export interface Article {
  id: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  status: 'draft' | 'review' | 'published';
  authorId: string;
  authorName: string;
  createdAt: string;
  updatedAt: string;
  version: number;
  isClientVisible: boolean;
  viewCount: number;
}

export interface KnowledgeBase {
  id: string;
  name: string;
  description: string;
  type: 'admin' | 'client';
  clientId?: string;
  articles: Article[];
  categories: string[];
  settings: {
    allowClientEdit: boolean;
    requireApproval: boolean;
    enableVersioning: boolean;
  };
}

export interface SearchResult {
  article: Article;
  relevanceScore: number;
  matchedTerms: string[];
}

export interface BulkOperation {
  id: string;
  type: 'archive' | 'delete' | 'publish' | 'category_change';
  itemIds: string[];
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress: number;
  createdAt: string;
}