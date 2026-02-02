'use client';

import { useRouter } from 'next/navigation';
import { LogOut, User, Menu } from 'lucide-react';
import { useState } from 'react';

interface AdminHeaderProps {
  onMenuClick: () => void;
}

export function AdminHeader({ onMenuClick }: AdminHeaderProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/management/login');
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <header className="bg-white border-b border-gray-200 px-4 lg:px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          {/* Mobile menu button */}
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-md text-gray-500 hover:text-gray-900 hover:bg-gray-100 mr-4"
          >
            <Menu className="h-6 w-6" />
          </button>
          
          <div>
            <h1 className="text-lg font-semibold text-gray-900">
              Panel d'administration
            </h1>
            <p className="text-sm text-gray-600 hidden sm:block">
              Gestion des questions et réponses administratives
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2 lg:gap-4">
          <div className="hidden sm:flex items-center gap-2 text-sm text-gray-600">
            <User className="h-4 w-4" />
            <span>Administrateur</span>
          </div>
          
          <button
            onClick={handleLogout}
            disabled={isLoading}
            className="inline-flex items-center gap-2 px-2 lg:px-3 py-2 border border-transparent text-xs lg:text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">
              {isLoading ? 'Déconnexion...' : 'Se déconnecter'}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}