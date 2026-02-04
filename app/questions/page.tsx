import Link from 'next/link';
import { Suspense } from 'react';
import { prisma } from '@/lib/prisma';
import { QuestionCard } from '@/components/QuestionCard';
import { Pagination } from '@/components/Pagination';
import { AdSlot } from '@/components/AdSlot';
import { Question } from '@/lib/types';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Questions administratives',
  description: 'Parcourez toutes nos questions administratives officielles pour trouver les informations dont vous avez besoin.'
};

interface SearchParams {
  q?: string;
  category?: string;
  page?: string;
}

interface QuestionsPageProps {
  searchParams: Promise<SearchParams>;
}

const QUESTIONS_PER_PAGE = 12;

async function getQuestionsData(resolvedSearchParams: SearchParams) {
  const { q, category, page = '1' } = resolvedSearchParams;
  const currentPage = parseInt(page, 10);
  const skip = (currentPage - 1) * QUESTIONS_PER_PAGE;

  const where = {
    is_published: true,
    ...(q && {
      OR: [
        { title: { contains: q, mode: 'insensitive' as const } },
        { answer: { contains: q, mode: 'insensitive' as const } }
      ]
    }),
    ...(category && {
      category: { slug: category }
    })
  };

  const [questions, totalCount, categories] = await Promise.all([
    prisma.question.findMany({
      where,
      include: { category: true },
      orderBy: { created_at: 'desc' },
      skip,
      take: QUESTIONS_PER_PAGE
    }),
    prisma.question.count({ where }),
    prisma.category.findMany({
      include: {
        _count: {
          select: { questions: { where: { is_published: true } } }
        }
      }
    })
  ]);

  const totalPages = Math.ceil(totalCount / QUESTIONS_PER_PAGE);

  return { questions, totalCount, totalPages, currentPage, categories };
}

export default async function QuestionsPage({ searchParams }: QuestionsPageProps) {
  const resolvedSearchParams = await searchParams;
  const { questions, totalCount, totalPages, currentPage, categories } = await getQuestionsData(resolvedSearchParams);
  const { q, category } = resolvedSearchParams;

  const selectedCategory = categories.find(cat => cat.slug === category);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          {selectedCategory ? `Questions - ${selectedCategory.name}` : 'Toutes les questions'}
        </h1>
        {q && (
          <p className="text-gray-600 mb-4">
            Résultats pour « <span className="font-semibold">{q}</span> » : {totalCount} question{totalCount !== 1 ? 's' : ''}
          </p>
        )}
      </div>

      {/* Filtres par catégorie */}
      <div className="mb-8">
        <div className="flex flex-wrap gap-2">
          <Link
            href="/questions"
            replace={true}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${!category
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
          >
            Toutes
          </Link>
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/questions?category=${cat.slug}`}
              replace={true}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${category === cat.slug
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
            >
              {cat.name} ({cat._count.questions})
            </Link>
          ))}
        </div>
      </div>

      <AdSlot position="between_content" className="mb-8" />

      {/* Liste des questions */}
      {questions.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {questions.map((question, index) => (
              <div key={question.id}>
                <QuestionCard question={question as Question} />
                {index === 4 && <AdSlot position="between_content" className="mt-6" />}
              </div>
            ))}
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            baseUrl="/questions"
            searchParams={new URLSearchParams(
              Object.entries(resolvedSearchParams)
                .filter(([_, value]) => value !== undefined && typeof value === 'string')
                .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {} as Record<string, string>)
            )}
          />
        </>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">
            {q || category
              ? 'Aucune question trouvée pour ces critères.'
              : 'Aucune question disponible pour le moment.'}
          </p>
        </div>
      )}
    </div>
  );
}