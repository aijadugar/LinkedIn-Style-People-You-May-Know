'use client';

import Image from 'next/image';
import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface RecommendationCardProps {
  id: string;
  name: string;
  title: string;
  company: string;
  location: string;
  image: string;
  mutualConnections: number;
  score: number;
  onViewProfile: () => void;
  onConnect: () => void;
  isConnected: boolean;
}

export function RecommendationCard({
  name,
  title,
  company,
  location,
  image,
  mutualConnections,
  score,
  onViewProfile,
  onConnect,
  isConnected
}: RecommendationCardProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col h-full">
      <div className="relative w-full h-40">
        <Image
          src={image}
          alt={name}
          fill
          className="object-cover"
        />
      </div>

      <div className="p-4 flex flex-col flex-grow">
        <h3 className="font-bold text-gray-900 text-sm line-clamp-2">{name}</h3>
        <p className="text-xs text-gray-600 mt-1 line-clamp-1">{title}</p>
        <p className="text-xs text-gray-500 line-clamp-1">{company}</p>

        <div className="mt-3 pt-3 border-t border-gray-100 space-y-1">
          <p className="text-xs text-gray-500 line-clamp-1">📍 {location}</p>
          <p className="text-xs text-gray-600 font-medium">
            {mutualConnections} mutual connection{mutualConnections !== 1 ? 's' : ''}
          </p>
          <p className="text-lg font-bold text-blue-600">Score: {score.toFixed(2)}</p>
        </div>

        <div className="mt-4 pt-3 border-t border-gray-100 flex gap-2">
          <button
            onClick={onViewProfile}
            className="flex-1 text-xs font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded py-2 transition-colors"
          >
            View
          </button>
          <Button
            onClick={onConnect}
            size="sm"
            disabled={isConnected}
            className={`flex-1 text-xs h-auto py-2 ${isConnected
                ? 'bg-green-600 hover:bg-green-600 cursor-not-allowed text-white'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
          >
            {isConnected ? (
    <>
      <Check size={14} />
      Connected
    </>
  ) : (
    'Connect'
  )}
          </Button>
        </div>
      </div>
    </div>
  );
}
