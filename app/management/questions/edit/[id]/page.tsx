'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Save } from 'lucide-react';
import Link from 'next/link';

interface Category {
    id: number;
    name: string;
}

export default function EditQuestionPage() {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [driveUrl, setDriveUrl] = useState('');
    const [isPublished, setIsPublished] = useState(false);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [error, setError] = useState('');
    const router = useRouter();
    const params = useParams();
    const id = params.id;

    useEffect(() => {
        fetchCategories();
        if (id) {
            fetchQuestion();
        }
    }, [id]);

    const fetchCategories = async () => {
        try {
            const response = await fetch('/api/admin/categories');
            if (response.ok) {
                const data = await response.json();
                setCategories(data);
            }
        } catch (error) {
            console.error('Erreur categories:', error);
        }
    };

    const fetchQuestion = async () => {
        try {
            const response = await fetch('/api/admin/questions');
            if (response.ok) {
                const questions = await response.json();
                const question = questions.find((q: any) => q.id === parseInt(id as string));
                if (question) {
                    setTitle(question.title);
                    setContent(question.answer);
                    setCategoryId(question.category_id.toString());
                    setDriveUrl(question.drive_link || '');
                    setIsPublished(question.is_published);
                } else {
                    setError('Question non trouvée');
                }
            }
        } catch (error) {
            setError('Erreur lors du chargement');
        } finally {
            setFetching(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim() || !content.trim() || !categoryId) {
            setError('Veuillez remplir tous les champs obligatoires');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const response = await fetch(`/api/admin/questions/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title: title.trim(),
                    answer: content.trim(),
                    category_id: parseInt(categoryId),
                    is_published: isPublished,
                    drive_link: driveUrl.trim() || null,
                }),
            });

            if (response.ok) {
                router.push('/management/questions');
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
        <div className="max-w-4xl mx-auto">
            <div className="mb-6">
                <Link href="/management/questions" className="flex items-center text-gray-600 hover:text-gray-900 mb-4">
                    <ArrowLeft className="h-4 w-4 mr-1" /> Retour
                </Link>
                <h1 className="text-2xl font-bold text-gray-900">Modifier la Question</h1>
            </div>

            {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md text-red-600 text-sm">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="bg-white p-6 rounded-lg shadow space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Titre *</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Catégorie *</label>
                        <select
                            value={categoryId}
                            onChange={(e) => setCategoryId(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                            required
                        >
                            <option value="">Sélectionner une catégorie</option>
                            {categories.map((c) => (
                                <option key={c.id} value={c.id}>{c.name}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Réponse *</label>
                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            rows={10}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Lien Google Drive (PDF)</label>
                        <input
                            type="url"
                            value={driveUrl}
                            onChange={(e) => setDriveUrl(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                            placeholder="https://drive.google.com/..."
                        />
                    </div>
                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            id="published"
                            checked={isPublished}
                            onChange={(e) => setIsPublished(e.target.checked)}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label htmlFor="published" className="ml-2 text-sm font-medium text-gray-700">Publiée</label>
                    </div>
                </div>
                <div className="flex justify-end gap-3">
                    <Link href="/management/questions" className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md">Annuler</Link>
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
