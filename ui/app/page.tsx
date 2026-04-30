'use client';

import { useState } from 'react';
import { InputCard } from '@/components/InputCard';
import { LoadingState } from '@/components/LoadingState';
import { UserProfile } from '@/components/UserProfile';
import { RecommendationCard } from '@/components/RecommendationCard';
import { ProfileModal } from '@/components/ProfileModal';
import { ErrorCard } from '@/components/ErrorCard';
import { useToast } from '@/hooks/use-toast';


interface UserProfileType {
  user_id: number;
  name: string;
  username: string;
  email: string;
  title: string;
  company: string;
  city: string;
  country: string;
  bio: string;
  skills: string[];
  connections: number;
  avatar: string;
}

interface RecommendationType {
  user_id: string;
  score: number;
  profiles: UserProfileType;
}

interface ApiResponse {
  user: string;
  user_profile: UserProfileType;
  pymk: RecommendationType[];
}


export default function Home() {
  const [user, setUser] = useState<UserProfileType | null>(null);
  const [recommendations, setRecommendations] = useState<RecommendationType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedProfile, setSelectedProfile] = useState<RecommendationType | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [connectedIds, setConnectedIds] = useState<Set<string>>(new Set());
  const { toast } = useToast();


  const handleSearch = async (userId: string) => {
    setIsLoading(true);
    setError(null);
    setUser(null);
    setRecommendations([]);

    const base_url = process.env.NEXT_PUBLIC_API_BASE_URL;

    try {
      const response = await fetch(
        `${base_url}/recommend/${userId}`
      );

      if (userId.toString() === '0' || !response.ok) {
        throw new Error('User not found. Try between 1 to 9999');
      }

      const data: ApiResponse = await response.json();

      setUser(data.user_profile);
      setRecommendations(data.pymk);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch recommendations!');
    } finally {
      setIsLoading(false);
    }
  };


  const handleViewProfile = (rec: RecommendationType) => {
    setSelectedProfile(rec);
    setIsModalOpen(true);
  };

  const handleConnect = (userId: string) => {
    if (!connectedIds.has(userId)) {
      setConnectedIds((prev) => new Set(prev).add(userId));

      toast({
        title: 'Success',
        description: 'Connection request sent!',
      });
    }
  };

  const handleModalConnect = () => {
    if (selectedProfile) {
      handleConnect(selectedProfile.user_id);
      setIsModalOpen(false);
    }
  };


  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
            People You May Know
          </h1>
          <p className="text-gray-600 mt-2">
            Discover new professional connections powered by Linkedin-Style PYMK Recommendation System
          </p>
        </div>

        <InputCard onSubmit={handleSearch} isLoading={isLoading} />

        {error && !isLoading && (
          <div className="mb-8">
            <ErrorCard message={error} onRetry={() => handleSearch('')} />
          </div>
        )}

        {isLoading && <LoadingState />}

        {user && !isLoading && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              User Profile
            </h2>
            <UserProfile
                name={user.name}
                username={user.username}
                email={user.email}
                title={user.title}
                company={user.company}
                city={user.city}
                country={user.country}
                bio={user.bio}
                skills={user.skills}
                image={user.avatar}
            />

            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              People You May Know
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {recommendations.map((rec) => (
                <RecommendationCard
                  key={rec.user_id}
                  id={rec.user_id}
                  name={rec.profiles.name}
                  title={rec.profiles.title}
                  company={rec.profiles.company}
                  location={`${rec.profiles.city}, ${rec.profiles.country}`}
                  image={rec.profiles.avatar}
                  mutualConnections={Math.floor(Math.random() * 20)}
                  score={rec.score}
                  isConnected={connectedIds.has(rec.user_id)}
                  onViewProfile={() => handleViewProfile(rec)}
                  onConnect={() => handleConnect(rec.user_id)}
                />
              ))}
            </div>

            <div className="text-center">
              <p className="text-gray-600">
                You have{' '}
                <span className="font-bold text-blue-600">
                  {connectedIds.size}
                </span>{' '}
                pending connection request
                {connectedIds.size !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
        )}

        {!user && !isLoading && !error && (
          <div className="text-center py-12 text-gray-500">
            Enter a user ID to get started
          </div>
        )}
      </div>

      <ProfileModal
        isOpen={isModalOpen}
        user={
          selectedProfile
            ? {
                name: selectedProfile.profiles.name,
                username: selectedProfile.profiles.username,
                email: selectedProfile.profiles.email,
                title: selectedProfile.profiles.title,
                company: selectedProfile.profiles.company,
                location: `${selectedProfile.profiles.city}, ${selectedProfile.profiles.country}`,
                image: selectedProfile.profiles.avatar,
                mutualConnections: Math.floor(Math.random() * 20),
                headline: selectedProfile.profiles.title,
                bio: selectedProfile.profiles.bio,
                skills: selectedProfile.profiles.skills,
              }
            : null
        }
        isConnected={
          selectedProfile
            ? connectedIds.has(selectedProfile.user_id)
            : false
        }
        onClose={() => setIsModalOpen(false)}
        onConnect={handleModalConnect}
      />
    </main>
  );
}
