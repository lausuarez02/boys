'use client';

import { useAccount } from 'wagmi';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import BoyGrowth from '@/components/BoyGrowth';

export default function MyBoyPage() {
  const { isConnected } = useAccount();
  const router = useRouter();

  // Redirect to home if not connected
  useEffect(() => {
    if (!isConnected) {
      router.push('/');
    }
  }, [isConnected, router]);

  return (
    <div className="relative min-h-screen">
      {/* Background */}
      <div className="fixed inset-0" style={{
        background: `linear-gradient(120deg, 
          rgb(255, 255, 255) 0%,
          rgb(240, 244, 255) 25%,
          rgb(220, 230, 255) 50%,
          rgb(190, 210, 255) 75%,
          rgb(160, 190, 255) 100%
        )`,
      }} />

      {/* Content */}
      <div className="relative">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          {/* Header */}
          <header className="mb-8">
            <h1 className="text-4xl font-bold text-gray-800">My Precious Boy 👶</h1>
            <p className="mt-2 text-gray-600">Take care of your little one and watch him grow!</p>
          </header>

          {/* Main Content */}
          <main>
            <BoyGrowth 
              tokenId="1" 
              imageUrl="/boy8.jpg" 
              metadata={{
                name: "Little Boy",
                level: 5,
                mood: "happy",
                lastFed: "2 hours ago",
                lastPlayed: "30 minutes ago"
              }}
            />
          </main>
        </div>
      </div>
    </div>
  );
}
