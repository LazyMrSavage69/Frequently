import Link from 'next/link';
import { Search } from 'lucide-react';
import { SearchForm } from './SearchForm';
import { AdSlot } from './AdSlot';

export function Header() {
  return (
    <header className="bg-white shadow-sm border-b">
      <AdSlot position="header" />
      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-blue-600">
            Admin Info
          </Link>
        </div>
      </div>
    </header>
  );
}