import Link from 'next/link';
import { Eye, Calendar } from 'lucide-react';
import { type Question } from '@/lib/types';
import { formatDate, truncateText } from '@/lib/utils';

interface QuestionCardProps {
  question: Question;
}

export function QuestionCard({ question }: QuestionCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <Link 
            href={`/questions/${question.slug}`} 
            className="text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors line-clamp-2"
          >
            {question.title}
          </Link>
          <p className="text-gray-600 mt-2 line-clamp-2">
            {truncateText(question.answer, 150)}
          </p>
        </div>
      </div>
      
      <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
        <Link 
          href={`/categories/${question.category.slug}`}
          className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 hover:bg-blue-200 transition-colors"
        >
          {question.category.name}
        </Link>
        
        <div className="flex items-center gap-4 text-sm text-gray-500">
          <div className="flex items-center gap-1">
            <Eye className="h-4 w-4" />
            <span>{question.views_count}</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            <span>{formatDate(question.created_at)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}