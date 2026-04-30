'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';

interface InputCardProps {
  onSubmit: (userId: string) => void;
  isLoading: boolean;
}

export function InputCard({ onSubmit, isLoading }: InputCardProps) {
  const [input, setInput] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!input.trim()) {
      setError('Please enter a user ID');
      return;
    }

    onSubmit(input.trim());
  };

  return (
    <div className="w-full max-w-md mx-auto mb-8">
      <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
        <h2 className="text-2xl font-bold text-gray-900 mb-2 text-balance">Find Your Network</h2>
        <p className="text-gray-600 text-sm mb-6">
          Enter a user ID to see people you may know
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="userId" className="block text-sm font-medium text-gray-700 mb-2">
              User ID
            </label>
            <input
              id="userId"
              type="text"
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                setError('');
              }}
              placeholder="Enter a user ID to get started (between 1-10000)"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={isLoading}
            />
            {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium"
          >
            {isLoading ? 'Searching...' : 'Find Connections'}
          </Button>
        </form>

        <p className="text-xs text-gray-500 mt-4">
          Try &quot;4561&quot; or &quot;971&quot;
        </p>
      </div>
    </div>
  );
}
