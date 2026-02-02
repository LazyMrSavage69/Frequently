import { AdSlot } from './AdSlot';

export function Footer() {
  return (
    <footer className="bg-gray-50 mt-12">
      <AdSlot position="footer" />
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="text-center text-gray-600">
          <p className="mb-2">
            © 2026 Admin Info - Informations administratives officielles
          </p>
          <p className="text-sm">
            Facilitez vos démarches administratives avec des réponses claires et officielles
          </p>
        </div>
      </div>
    </footer>
  );
}