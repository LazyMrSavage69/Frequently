'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save } from 'lucide-react';
import Link from 'next/link';

export default function NewCategoryPage() {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[àáäâ]/g, 'a')
      .replace(/[èéëê]/g, 'e')
      .replace(/[ìíïî]/g, 'i')
      .replace(/[òóöô]/g, 'o')
      .replace(/[ùúüû]/g, 'u')
      .replace(/[ç]/g, 'c')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      setError('Le nom de la catégorie est obligatoire');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/admin/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: name.trim(),
          slug: generateSlug(name),
        }),
      });

      if (response.ok) {
        router.push('/management/categories');
      } else {
        const data = await response.json();
        setError(data.error || 'Erreur lors de la création');
      }
    } catch (error) {
      setError('Erreur lors de la création de la catégorie');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <div className="flex items-center gap-2 lg:gap-4 mb-4">
          <Link
            href="/management/categories"
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            <span className="hidden sm:inline">Retour</span>
          </Link>
          <h1 className="text-xl lg:text-2xl font-bold text-gray-900">Nouvelle Catégorie</h1>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
          <div className="text-red-600 text-sm">{error}</div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white p-6 rounded-lg shadow space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Nom de la catégorie *
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Ex: État civil, Permis de conduire..."
              required
            />
            {name && (
              <p className="mt-1 text-sm text-gray-500">
                Le slug sera : <code className="bg-gray-100 px-1 rounded">{generateSlug(name)}</code>
              </p>
            )}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 sm:justify-between">
          <Link
            href="/management/categories"
            className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors text-center"
          >
            Annuler
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Save className="h-4 w-4 mr-2" />
            {loading ? 'Création...' : 'Créer la catégorie'}
          </button>
        </div>
      </form>

      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
        <div className="text-sm text-blue-800">
          <strong>Conseils :</strong>
          <ul className="mt-2 list-disc list-inside space-y-1">
            <li>Choisissez un nom court et descriptif</li>
            <li>Évitez les caractères spéciaux dans le nom</li>
            <li>Le slug est utilisé dans l'URL de la catégorie</li>
            <li>Une fois créée, vous pourrez ajouter des questions à cette catégorie</li>
          </ul>
        </div>
      </div>
    </div>
  );
}