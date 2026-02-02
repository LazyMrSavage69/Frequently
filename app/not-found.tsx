import Link from 'next/link';
import { SearchForm } from '@/components/SearchForm';
import { Home, ArrowLeft, Search } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16 text-center">
      <div className="mb-8">
        <div className="text-6xl font-bold text-gray-300 mb-4">404</div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Page introuvable
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Désolé, la page que vous recherchez n'existe pas ou a été déplacée.
        </p>
      </div>

      <div className="space-y-6">
        <div className="max-w-md mx-auto">
          <p className="text-sm text-gray-600 mb-2">
            Essayez de rechercher une question :
          </p>
          <SearchForm />
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Home className="h-4 w-4" />
            Retour à l'accueil
          </Link>
          
          <Link
            href="/questions"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Search className="h-4 w-4" />
            Voir toutes les questions
          </Link>
        </div>
      </div>

      <div className="mt-12 pt-8 border-t border-gray-200">
        <p className="text-sm text-gray-500">
          Si vous pensez qu'il s'agit d'une erreur, n'hésitez pas à nous contacter.
        </p>
      </div>
    </div>
  );
}