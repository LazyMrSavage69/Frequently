'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Save } from 'lucide-react';
import Link from 'next/link';

export default function EditCategoryPage() {
    const [name, setName] = useState('');
    const [slug, setSlug] = useState('');
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [error, setError] = useState('');
    const router = useRouter();
    const params = useParams();
    const id = params.id;

    useEffect(() => {
        if (id) {
            fetchCategory();
        }
    }, [id]);

    const fetchCategory = async () => {
        try {
            const response = await fetch('/api/admin/categories');
            if (response.ok) {
                const categories = await response.json();
                const category = categories.find((c: any) => c.id === parseInt(id as string));
                if (category) {
                    setName(category.name);
                    setSlug(category.slug);
                } else {
                    setError('Catégorie non trouvée');
                }
            }
        } catch (error) {
            console.error('Erreur lors du chargement:', error);
            setError('Erreur lors du chargement de la catégorie');
        } finally {
            setFetching(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim() || !slug.trim()) {
            setError('Veuillez remplir tous les champs');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const response = await fetch(`/api/admin/categories/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, slug }),
            });

            if (response.ok) {
                router.push('/management/categories');
            } else {
                const data = await response.json();
                setError(data.error || 'Erreur lors de la modification');
            }
        } catch (error) {
            setError('Erreur lors de la modification');
        } finally {
            setLoading(false);
        }
    };

    if (fetching) return <div className="p-8 text-center">Chargement...</div>;

    return (
        <div className="max-w-2xl mx-auto">
            <div className="mb-6">
                <Link href="/management/categories" className="flex items-center text-gray-600 hover:text-gray-900 mb-4">
                    <ArrowLeft className="h-4 w-4 mr-1" /> Retour
                </Link>
                <h1 className="text-2xl font-bold text-gray-900">Modifier la Catégorie</h1>
            </div>

            {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md text-red-600 text-sm">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Nom de la catégorie</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Slug</label>
                    <input
                        type="text"
                        value={slug}
                        onChange={(e) => setSlug(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 font-mono"
                        required
                    />
                </div>
                <div className="flex justify-end gap-3">
                    <Link href="/management/categories" className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md">Annuler</Link>
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                    >
                        <Save className="h-4 w-4 mr-2" />
                        {loading ? 'Enregistrement...' : 'Enregistrer'}
                    </button>
                </div>
            </form>
        </div>
    );
}
