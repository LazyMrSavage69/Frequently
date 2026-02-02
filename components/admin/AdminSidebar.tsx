'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  FileText,
  FolderOpen,
  Settings,
  BarChart3,
  ExternalLink
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

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <div className="fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg">
      <div className="flex h-16 items-center justify-center border-b border-gray-200">
        <Link href="/management/dashboard" className="text-xl font-bold text-blue-600">
          🏛️ Admin Info
        </Link>
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
                className={cn(
                  'group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors',
                  isActive
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                )}
              >
                <Icon 
                  className={cn(
                    'mr-3 h-5 w-5',
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
            className="group flex items-center px-3 py-2 text-sm font-medium text-gray-600 rounded-md hover:bg-gray-50 hover:text-gray-900 transition-colors"
          >
            <ExternalLink className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500" />
            Voir le site public
          </Link>
        </div>
      </nav>
    </div>
  );
}