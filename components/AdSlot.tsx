import { cn } from '@/lib/utils';
import { type AdPosition } from '@/lib/types';

interface AdSlotProps {
  position: AdPosition;
  className?: string;
}

export function AdSlot({ position, className }: AdSlotProps) {
  // Cette fonction sera connectée à la base de données pour vérifier si les ads sont actives
  const isAdActive = process.env.NODE_ENV === 'development'; // Pour le développement

  if (!isAdActive) return null;

  const getAdDimensions = (position: AdPosition) => {
    switch (position) {
      case 'header':
        return 'h-20 bg-gray-100';
      case 'sidebar':
        return 'w-64 h-96 bg-gray-100';
      case 'footer':
        return 'h-24 bg-gray-100';
      case 'between_content':
        return 'h-32 bg-gray-100';
      default:
        return 'h-20 bg-gray-100';
    }
  };

  return (
    <div className={cn(
      'flex items-center justify-center text-gray-500 text-sm rounded-lg border-2 border-dashed border-gray-200',
      getAdDimensions(position),
      className
    )}>
      <div className="text-center">
        <div className="font-semibold">Publicité</div>
        <div className="text-xs">Emplacement: {position}</div>
      </div>
    </div>
  );
}