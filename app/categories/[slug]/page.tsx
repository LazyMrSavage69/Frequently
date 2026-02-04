import { notFound } from 'next/navigation';
export const dynamic = 'force-dynamic';
import { prisma } from '@/lib/prisma';
import { QuestionCard } from '@/components/QuestionCard';
import { Pagination } from '@/components/Pagination';
import { AdSlot } from '@/components/AdSlot';
import { Question } from '@/lib/types';
import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
}

const QUESTIONS_PER_PAGE = 12;

async function getCategoryData(slug: string, page: number = 1) {
  const category = await prisma.category.findFirst({
    where: { slug }
  });

  if (!category) {
    return null;
  }

  const skip = (page - 1) * QUESTIONS_PER_PAGE;

  const [questions, totalCount] = await Promise.all([
    prisma.question.findMany({
      where: {
        category_id: category.id,
        is_published: true
      },
      include: { category: true },
      orderBy: { created_at: 'desc' },
      skip,
      take: QUESTIONS_PER_PAGE
    }),
    prisma.question.count({
      where: {
        category_id: category.id,
        is_published: true
      }
    })
  ]);

  const totalPages = Math.ceil(totalCount / QUESTIONS_PER_PAGE);

  return { category, questions, totalCount, totalPages, currentPage: page };
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const data = await getCategoryData(slug);

  if (!data) {
    return {
      title: 'Catégorie introuvable'
    };
  }

  return {
    title: `Questions ${data.category.name}`,
    description: `Parcourez toutes les questions administratives de la catégorie ${data.category.name}. Trouvez rapidement les informations officielles dont vous avez besoin.`
  };
}

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const { slug } = await params;
  const { page: pageStr } = await searchParams;
  const page = parseInt(pageStr || '1', 10);
  const data = await getCategoryData(slug, page);

  if (!data) {
    notFound();
  }

  const { category, questions, totalCount, totalPages, currentPage } = data;

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `Questions ${category.name}`,
    description: `Questions administratives de la catégorie ${category.name}`,
    numberOfItems: totalCount
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Navigation */}
        <nav className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour à l'accueil
          </Link>
        </nav>

        {/* Header */}
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {category.name}
          </h1>
          <p className="text-gray-600">
            {totalCount} question{totalCount !== 1 ? 's' : ''} dans cette catégorie
          </p>
        </header>

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
              baseUrl={`/categories/${slug}`}
              searchParams={new URLSearchParams()}
            />
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              Aucune question publiée dans cette catégorie pour le moment.
            </p>
            <Link
              href="/questions"
              className="inline-block mt-4 text-blue-600 hover:text-blue-700 font-medium"
            >
              Voir toutes les questions →
            </Link>
          </div>
        )}
      </div>
    </>
  );
}