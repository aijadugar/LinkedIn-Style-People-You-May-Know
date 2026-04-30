'use client';

import { useEffect } from 'react';
import { Check } from 'lucide-react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface ProfileModalProps {
  isOpen: boolean;
  user: {
    name: string;
    username: string;
    email: string;
    title: string;
    company: string;
    location: string;
    image: string;
    mutualConnections: number;
    headline: string;
    bio: string;
    skills: string[];
  } | null;
  onClose: () => void;
  onConnect: () => void;
  isConnected?: boolean;
}

export function ProfileModal({ isOpen, user, onClose, onConnect, isConnected }: ProfileModalProps) {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
    }

    return () => {
      document.removeEventListener('keydown', handleEsc);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !user) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative bg-white w-full max-w-lg mx-4 rounded-2xl shadow-2xl animate-in fade-in zoom-in-95">

        <div className="flex justify-between items-center border-b px-6 py-4">
          <h2 className="text-lg font-semibold text-gray-900">Profile</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800 transition"
          >
            <X size={20} />
          </button>
        </div>

        <div className="px-6 py-6">

          <div className="relative w-24 h-24 mx-auto mb-4">
            <Image
              src={user.image}
              alt={user.name}
              fill
              className="rounded-full object-cover"
            />
          </div>

          <div className="text-center mb-6">
            <h3 className="text-xl font-bold text-gray-900">{user.name}</h3>
            <p className="text-gray-700 font-medium">{user.title}</p>
            <p className="text-gray-600 text-sm">{user.company}</p>
            <p className="text-gray-500 text-sm mt-1">📍 {user.location}</p>
          </div>

          <div className="mb-4">
            <p className="text-sm font-semibold text-gray-700">Headline</p>
            <p className="text-gray-600 text-sm">{user.headline}</p>
          </div>

          <div className="mb-4">
            <p className="text-sm font-semibold text-gray-700">About</p>
            <p className="text-gray-600 text-sm">{user.bio}</p>
          </div>

          <div className="mb-6">
            <p className="text-sm font-semibold text-gray-700 mb-1">Skills</p>
            <div className="flex flex-wrap gap-2">
              {user.skills.map((skill, index) => (
                <span
                  key={index}
                  className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          <div className="bg-blue-50 rounded-lg p-3 mb-6 text-center">
            <span className="font-semibold text-blue-600">
              {user.mutualConnections}
            </span>{' '}
            mutual connection{user.mutualConnections !== 1 ? 's' : ''}
          </div>

          <Button
  onClick={onConnect}
  disabled={isConnected}
  className={`w-full font-medium ${
    isConnected
      ? 'bg-green-600 hover:bg-green-600 cursor-not-allowed'
      : 'bg-blue-600 hover:bg-blue-700 text-white'
  }`}
>
  {isConnected ? (
    <>
      <Check size={14} />
      Connected
    </>
  ) : (
    'Send Connection Request'
  )}
</Button>
        </div>
      </div>
    </div>
  );
}