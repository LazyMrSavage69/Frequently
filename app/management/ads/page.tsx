'use client';

import { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2, ToggleLeft, ToggleRight } from 'lucide-react';
import Link from 'next/link';

interface AdSetting {
  id: number;
  provider: string;
  slot_id: string | null;
  position: string;
  is_active: boolean;
}

const POSITION_LABELS = {
  'header': 'En-tête',
  'sidebar': 'Barre latérale',
  'footer': 'Pied de page',
  'between_content': 'Entre les contenus'
};

const PROVIDER_LABELS = {
  'google_adsense': 'Google AdSense',
  'custom': 'Personnalisé',
  'amazon': 'Amazon Associates',
  'other': 'Autre'
};

export default function AdsPage() {
  const [ads, setAds] = useState<AdSetting[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchAds();
  }, []);

  const fetchAds = async () => {
    try {
      const response = await fetch('/api/admin/ads');
      if (response.ok) {
        const data = await response.json();
        setAds(data);
      }
    } catch (error) {
      console.error('Erreur lors du chargement:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleAdStatus = async (id: number, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/admin/ads/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_active: !currentStatus }),
      });

      if (response.ok) {
        setAds(ads.map(ad => 
          ad.id === id ? { ...ad, is_active: !currentStatus } : ad
        ));
      }
    } catch (error) {
      console.error('Erreur lors de la modification:', error);
    }
  };

  const deleteAd = async (id: number) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette publicité ?')) return;

    try {
      const response = await fetch(`/api/admin/ads/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setAds(ads.filter(ad => ad.id !== id));
      }
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
    }
  };

  const filteredAds = ads.filter(ad => 
    ad.provider.toLowerCase().includes(searchQuery.toLowerCase()) ||
    ad.position.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (ad.slot_id && ad.slot_id.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-gray-500">Chargement...</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-gray-900">Gestion des Publicités</h1>
          <Link
            href="/management/ads/new"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-4 w-4 mr-2" />
            Nouvelle Publicité
          </Link>
        </div>

        <div className="max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Rechercher une publicité..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fournisseur
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Position
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Slot ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredAds.map((ad) => (
                <tr key={ad.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {PROVIDER_LABELS[ad.provider as keyof typeof PROVIDER_LABELS] || ad.provider}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {POSITION_LABELS[ad.position as keyof typeof POSITION_LABELS] || ad.position}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500 font-mono">
                      {ad.slot_id || '-'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => toggleAdStatus(ad.id, ad.is_active)}
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium transition-colors cursor-pointer ${
                        ad.is_active 
                          ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                          : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                      }`}
                    >
                      {ad.is_active ? (
                        <>
                          <ToggleRight className="h-3 w-3 mr-1" />
                          Active
                        </>
                      ) : (
                        <>
                          <ToggleLeft className="h-3 w-3 mr-1" />
                          Inactive
                        </>
                      )}
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <Link
                        href={`/management/ads/edit/${ad.id}`}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <Edit className="h-4 w-4" />
                      </Link>
                      <button
                        onClick={() => deleteAd(ad.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredAds.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg">
              {searchQuery 
                ? 'Aucune publicité trouvée avec ce critère'
                : 'Aucune publicité configurée'}
            </div>
            {!searchQuery && (
              <Link
                href="/management/ads/new"
                className="mt-4 inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                <Plus className="h-4 w-4 mr-2" />
                Configurer la première publicité
              </Link>
            )}
          </div>
        )}
      </div>
      
      <div className="mt-6 space-y-4">
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-md">
          <div className="text-sm text-blue-800">
            <strong>Info :</strong> Les emplacements publicitaires sont définis dans le code. 
            Vous pouvez activer/désactiver les publicités et configurer leurs paramètres ici.
          </div>
        </div>
        
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md">
          <div className="text-sm text-yellow-800">
            <strong>Positions disponibles :</strong>
            <ul className="mt-2 list-disc list-inside">
              <li><strong>En-tête</strong> - Bannière en haut de chaque page</li>
              <li><strong>Barre latérale</strong> - Panel latéral (pas encore implémenté)</li>
              <li><strong>Pied de page</strong> - Bannière en bas de chaque page</li>
              <li><strong>Entre les contenus</strong> - Au milieu du contenu des pages</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}