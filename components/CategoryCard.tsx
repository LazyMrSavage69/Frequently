import Link from 'next/link';
import { FileText } from 'lucide-react';
import { type Category } from '@/lib/types';

interface CategoryCardProps {
  category: Category & { questionsCount?: number };
}

export function CategoryCard({ category }: CategoryCardProps) {
  const questionsCount = category.questionsCount || category.questions?.length || 0;

  return (
    <Link 
      href={`/categories/${category.slug}`}
      className="group block bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md hover:border-blue-300 transition-all"
    >
      <div className="flex items-center gap-3">
        <div className="p-3 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
          <FileText className="h-6 w-6 text-blue-600" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
            {category.name}
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            {questionsCount} question{questionsCount !== 1 ? 's' : ''}
          </p>
        </div>
      </div>
    </Link>
  );
}