'use client';

import Image from 'next/image';

interface UserProfileProps {
  name: string;
  username: string;
  email: string;
  title: string;
  company: string;
  city: string;
  country: string;
  bio: string;
  skills: string[];
  image: string;
}

export function UserProfile({
  name,
  username,
  email,
  title,
  company,
  city,
  country,
  bio,
  skills,
  image
}: UserProfileProps) {
  return (
    <div className="mb-10 bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">

      <div className="flex flex-col md:flex-row items-start md:items-center gap-6 p-6">

        <div className="relative w-24 h-24 flex-shrink-0">
          <Image
            src={image}
            alt={name}
            fill
            className="rounded-full object-cover border"
            priority
          />
        </div>

        <div className="flex-1">
          <h2 className="text-2xl font-bold text-gray-900">{name}</h2>
          <p className="text-gray-600">@{username}</p>

          <p className="text-sm text-gray-500 mt-1">{email}</p>

          <p className="mt-2 font-medium text-gray-800">{title}</p>
          <p className="text-sm text-gray-600">{company}</p>

          <p className="text-sm text-gray-500 mt-1">
            {city}, {country}
          </p>
        </div>

      </div>

      <div className="px-6 pb-4">
        <p className="text-gray-700 text-sm leading-relaxed">{bio}</p>
      </div>

      <div className="px-6 pb-6">
        <div className="flex flex-wrap gap-2">
          {skills.map((skill, idx) => (
            <span
              key={idx}
              className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

    </div>
  );
}