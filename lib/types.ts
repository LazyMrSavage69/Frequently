export interface Question {
  id: number;
  title: string;
  slug: string;
  answer: string;
  category_id: number;
  is_published: boolean;
  drive_link?: string | null;
  views_count: number;
  created_at: Date;
  updated_at: Date;
  category: Category;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  created_at: Date;
  questions?: Question[];
}

export interface Admin {
  id: number;
  email: string;
  password: string;
  created_at: Date;
}

export interface AdsSettings {
  id: number;
  provider: string;
  slot_id: string | null;
  position: string;
  is_active: boolean;
}

export interface SearchFilters {
  query?: string;
  category?: string;
}

export type AdPosition = 'header' | 'sidebar' | 'footer' | 'between_content';