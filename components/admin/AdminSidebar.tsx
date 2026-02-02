'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  FileText,
  FolderOpen,
  Settings,
  BarChart3,
  ExternalLink,
  X
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navigation = [
  {
    name: 'Tableau de bord',
    href: '/management/dashboard',
    icon: Home
  },
  {
    name: 'Questions',
    href: '/management/questions',
    icon: FileText
  },
  {
    name: 'Catégories',
    href: '/management/categories',
    icon: FolderOpen
  },
  {
    name: 'Publicités',
    href: '/management/ads',
    icon: BarChart3
  },
];

interface AdminSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AdminSidebar({ isOpen, onClose }: AdminSidebarProps) {
  const pathname = usePathname();

  return (
    <div className={cn(
      'fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-200 ease-in-out',
      'lg:translate-x-0',
      isOpen ? 'translate-x-0' : '-translate-x-full'
    )}>
      {/* Mobile close button */}
      <div className="flex h-16 items-center justify-between border-b border-gray-200 px-4 lg:justify-center">
        <Link href="/management/dashboard" className="text-xl font-bold text-blue-600">
          🏛️ Admin Info
        </Link>
        <button
          onClick={onClose}
          className="lg:hidden p-1 rounded-md text-gray-500 hover:text-gray-900 hover:bg-gray-100"
        >
          <X className="h-6 w-6" />
        </button>
      </div>
      
      <nav className="mt-6 px-3">
        <div className="space-y-1">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
            
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={onClose} // Close sidebar on mobile when clicking a link
                className={cn(
                  'group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors',
                  isActive
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                )}
              >
                <Icon 
                  className={cn(
                    'mr-3 h-5 w-5 flex-shrink-0',
                    isActive ? 'text-blue-700' : 'text-gray-400 group-hover:text-gray-500'
                  )} 
                />
                {item.name}
              </Link>
            );
          })}
        </div>
        
        <div className="mt-8 pt-6 border-t border-gray-200">
          <Link
            href="/"
            target="_blank"
            onClick={onClose} // Close sidebar on mobile
            className="group flex items-center px-3 py-2 text-sm font-medium text-gray-600 rounded-md hover:bg-gray-50 hover:text-gray-900 transition-colors"
          >
            <ExternalLink className="mr-3 h-5 w-5 flex-shrink-0 text-gray-400 group-hover:text-gray-500" />
            Voir le site public
          </Link>
        </div>
      </nav>
    </div>
  );
}