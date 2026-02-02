import Link from 'next/link';
import { Search } from 'lucide-react';
import { SearchForm } from './SearchForm';
import { AdSlot } from './AdSlot';

export function Header() {
  return (
    <header className="bg-white shadow-sm border-b">
      <AdSlot position="header" />
      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <SearchForm className="flex-1 max-w-md mx-auto md:mx-0" />
        </div>
      </div>
    </header>
  );
}