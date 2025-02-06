'use client';

import { ConnectButton } from '@/components/ConnectButton';
import BoyGrowth from '@/components/BoyGrowth';
import { useAccount } from 'wagmi';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

// Mock data for the leaderboard
const topBoyMoms = [
  {
    id: 1,
    address: '0x1234...5678',
    boyName: 'Precious Angel',
    score: 2847,
    level: 12,
    imageUrl: '/boy8.jpg',
  },
  {
    id: 2,
    address: '0x8765...4321',
    boyName: 'Sweet Prince',
    score: 2456,
    level: 10,
    imageUrl: '/boy8.jpg',
  },
  {
    id: 3,
    address: '0x8765...4321',
    boyName: 'Sweet Prince',
    score: 2156,
    level: 10,
    imageUrl: '/boy8.jpg',
  },
  {
    id: 4,
    address: '0x8765...4321',
    boyName: 'Sweet Prince',
    score: 2016,
    level: 8,
    imageUrl: '/boy8.jpg',
  },
  {
    id: 5,
    address: '0x8765...4321',
    boyName: 'Sweet Prince',
    score: 1000,
    level: 6,
    imageUrl: '/boys.webp',
  },
  // ... existing code ...
];

export default function Home() {
  const { isConnected } = useAccount();
  const router = useRouter();

  const handleConnectClick = async () => {
    if (!isConnected) {
      // The ConnectButton component will handle the connection
    }
  };

  return (
    <div className="relative">
      {/* Background */}
      <div 
        className="fixed inset-0"
        style={{
          background: `
            linear-gradient(120deg, 
              rgb(255, 255, 255) 0%,
              rgb(240, 244, 255) 25%,
              rgb(220, 230, 255) 50%,
              rgb(190, 210, 255) 75%,
              rgb(160, 190, 255) 100%
            )
          `,
        }}
      />

      {/* Content */}
      <div className="relative min-h-screen">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          {/* Header with Connect Button and My Boy Button */}
          <header className="relative flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold text-gray-800">Boys Mom Leaderboard</h1>
              <p className="mt-2 text-gray-600">Top Boys Moms showing their love 💕</p>
            </div>
            <div className="flex items-center gap-4">
              {isConnected && (
                <button
                  onClick={() => router.push('/my-boy')}
                  className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
                >
                  <span>My Boy</span>
                  <span>👶</span>
                </button>
              )}
              <div>
                <ConnectButton />
              </div>
            </div>
          </header>

          {/* Welcome/CTA Section - Moved to top */}
          {!isConnected ? (
            <div className="mb-12 text-center p-8">
              <h2 className="text-2xl font-bold text-gray-800">
                Want to raise your own precious boy? 🥺
              </h2>
              <p className="mt-4 text-gray-600 mb-6">
                Connect your wallet to start your journey as a Boys Mom!
              </p>
              <div onClick={handleConnectClick}>
                <ConnectButton />
              </div>
            </div>
          ) : (
            <div className="mb-12 text-center p-8">
              <h2 className="text-2xl font-bold text-gray-800">
                Welcome back, Boys Mom! 💖
              </h2>
              <p className="mt-4 text-gray-600 mb-6">
                Your precious boy is waiting for you!
              </p>
              <button
                onClick={() => router.push('/my-boy')}
                className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                Go to My Boy 👶
              </button>
            </div>
          )}

          {/* Main Content */}
          <main>
            {/* Featured Boys Mom */}
            <div className="bg-white rounded-xl shadow-xl p-8 mb-12">
              <div className="flex items-center gap-8">
                <div className="relative w-64 h-64">
                  <Image
                    src={topBoyMoms[0].imageUrl}
                    alt={topBoyMoms[0].boyName}
                    fill
                    className="rounded-lg object-cover"
                  />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-4">
                    <h2 className="text-3xl font-bold text-gray-800">{topBoyMoms[0].boyName}</h2>
                    <span className="px-4 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-semibold">
                      Top Boys Mom 👑
                    </span>
                  </div>
                  <p className="text-gray-600 mt-2">Mom: {topBoyMoms[0].address}</p>
                  <div className="mt-4 flex gap-6">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-gray-800">{topBoyMoms[0].score}</p>
                      <p className="text-sm text-gray-600">Love Score</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-gray-800">Level {topBoyMoms[0].level}</p>
                      <p className="text-sm text-gray-600">Boy Growth</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Other Top Boys Moms */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {topBoyMoms.slice(1).map((mom) => (
                <div key={mom.id} className="bg-white rounded-lg shadow-md p-6 flex items-center gap-4">
                  <div className="relative w-24 h-24">
                    <Image
                      src={mom.imageUrl}
                      alt={mom.boyName}
                      fill
                      className="rounded-lg object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800">{mom.boyName}</h3>
                    <p className="text-sm text-gray-600">{mom.address}</p>
                    <div className="mt-2 flex gap-4">
                      <p className="text-sm text-gray-600">Score: {mom.score}</p>
                      <p className="text-sm text-gray-600">Level {mom.level}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}