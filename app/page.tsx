import { Suspense } from 'react';
import { SearchForm } from '@/components/SearchForm';
import { QuestionCard } from '@/components/QuestionCard';
import { CategoryCard } from '@/components/CategoryCard';
import { AdSlot } from '@/components/AdSlot';
import { prisma } from '@/lib/prisma';
import { Question, Category } from '@/lib/types';
import Link from 'next/link';
import { FileSearch, Users, Book, Shield } from 'lucide-react';

async function getHomePageData() {
  const [popularQuestions, categories] = await Promise.all([
    prisma.question.findMany({
      where: { is_published: true },
      include: { category: true },
      orderBy: { views_count: 'desc' },
      take: 6
    }),
    prisma.category.findMany({
      include: {
        _count: {
          select: { questions: { where: { is_published: true } } }
        }
      },
      take: 8
    })
  ]);

  return { popularQuestions, categories };
}

export default async function HomePage() {
  const { popularQuestions, categories } = await getHomePageData();

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Section Hero */}
      <section className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          🏛️ Informations administratives
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
          Trouvez rapidement des réponses officielles à vos questions administratives.
          Démarches, documents, procédures - tout en un seul endroit.
        </p>
        <div className="max-w-2xl mx-auto">
          <SearchForm />
        </div>
      </section>

      {/* Statistiques */}
      <section className="mb-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center p-6 bg-white rounded-lg shadow-sm">
            <FileSearch className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">{popularQuestions.length}+</div>
            <div className="text-gray-600">Questions</div>
          </div>
          <div className="text-center p-6 bg-white rounded-lg shadow-sm">
            <Book className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">{categories.length}</div>
            <div className="text-gray-600">Catégories</div>
          </div>
          <div className="text-center p-6 bg-white rounded-lg shadow-sm">
            <Users className="h-8 w-8 text-purple-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">100%</div>
            <div className="text-gray-600">Gratuit</div>
          </div>
          <div className="text-center p-6 bg-white rounded-lg shadow-sm">
            <Shield className="h-8 w-8 text-red-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">Officiel</div>
            <div className="text-gray-600">Vérifié</div>
          </div>
        </div>
      </section>

      <AdSlot position="between_content" className="mb-12" />

      {/* Questions populaires */}
      <section className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Questions populaires</h2>
          <Link 
            href="/questions" 
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            Voir toutes →
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {popularQuestions.slice(0, 4).map((question) => (
            <QuestionCard key={question.id} question={question as Question} />
          ))}
        </div>
      </section>

      <AdSlot position="between_content" className="mb-12" />

      {/* Catégories */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Catégories</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {categories.map((category) => (
            <CategoryCard 
              key={category.id} 
              category={{
                ...category,
                questionsCount: category._count.questions
              } as Category & { questionsCount: number }} 
            />
          ))}
        </div>
      </section>
    </div>
  );
}
