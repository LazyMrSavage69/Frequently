import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { AdSlot } from '@/components/AdSlot';
import { QuestionCard } from '@/components/QuestionCard';
import { formatDate } from '@/lib/utils';
import { Question } from '@/lib/types';
import { Metadata } from 'next';
import Link from 'next/link';
import { Eye, Calendar, ArrowLeft } from 'lucide-react';

interface QuestionPageProps {
  params: Promise<{ slug: string }>;
}

async function getQuestion(slug: string) {
  const question = await prisma.question.findFirst({
    where: {
      slug,
      is_published: true
    },
    include: {
      category: true
    }
  });

  if (!question) {
    return null;
  }

  // Incrémenter le nombre de vues
  await prisma.question.update({
    where: { id: question.id },
    data: { views_count: { increment: 1 } }
  });

  // Obtenir des questions similaires
  const relatedQuestions = await prisma.question.findMany({
    where: {
      is_published: true,
      category_id: question.category_id,
      id: { not: question.id }
    },
    include: { category: true },
    take: 3
  });

  return { question, relatedQuestions };
}

export async function generateMetadata({ params }: QuestionPageProps): Promise<Metadata> {
  const { slug } = await params;
  const data = await getQuestion(slug);

  if (!data) {
    return {
      title: 'Question introuvable'
    };
  }

  return {
    title: data.question.title,
    description: data.question.answer.substring(0, 160) + '...',
    openGraph: {
      title: data.question.title,
      description: data.question.answer.substring(0, 160) + '...',
      type: 'article'
    }
  };
}

export default async function QuestionPage({ params }: QuestionPageProps) {
  const { slug } = await params;
  const data = await getQuestion(slug);

  if (!data) {
    notFound();
  }

  const { question, relatedQuestions } = data;

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'QAPage',
    mainEntity: {
      '@type': 'Question',
      name: question.title,
      answerCount: 1,
      acceptedAnswer: {
        '@type': 'Answer',
        text: question.answer,
        author: {
          '@type': 'Organization',
          name: 'Admin Info'
        }
      },
      author: {
        '@type': 'Organization',
        name: 'Admin Info'
      }
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <article className="max-w-4xl mx-auto px-4 py-8">
        {/* Navigation */}
        <nav className="mb-6">
          <Link
            href="/questions"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour aux questions
          </Link>
        </nav>

        {/* Header */}
        <header className="mb-8">
          <div className="flex flex-wrap items-center gap-4 mb-4">
            <Link
              href={`/categories/${question.category.slug}`}
              className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 hover:bg-blue-200 transition-colors"
            >
              {question.category.name}
            </Link>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <Eye className="h-4 w-4" />
                <span>{question.views_count} vues</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>{formatDate(question.created_at)}</span>
              </div>
            </div>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
            {question.title}
          </h1>
        </header>

        <AdSlot position="between_content" className="mb-8" />

        {/* Réponse */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Réponse officielle</h2>
          <div
            className="prose prose-lg max-w-none text-gray-700 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: question.answer.replace(/\n/g, '<br>') }}
          />
        </div>

        <AdSlot position="between_content" className="mb-8" />

        {/* Questions similaires */}
        {relatedQuestions.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Questions similaires
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedQuestions.map((relatedQuestion) => (
                <QuestionCard key={relatedQuestion.id} question={relatedQuestion as Question} />
              ))}
            </div>
          </section>
        )}
      </article>
    </>
  );
}