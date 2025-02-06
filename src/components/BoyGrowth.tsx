'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useChat } from 'ai/react';

interface BoyGrowthProps {
  tokenId: string;
  imageUrl: string;
  metadata: {
    name: string;
    level: number;
    mood: string;
    lastFed: string;
    lastPlayed: string;
  };
}

export default function BoyGrowth({ tokenId, imageUrl, metadata }: BoyGrowthProps) {
  const [stats, setStats] = useState({
    age: 0,
    care: 100,
    mood: 100,
    hunger: 100,
    energy: 100,
    hygiene: 100,
    love: 0,
    lastFed: new Date(),
    lastInteraction: new Date(),
    stage: 'baby',
    weeklyGrowth: [],
    personality: {
      shyness: 0,
      playfulness: 0,
      curiosity: 0,
    }
  });

  const [isGrowing, setIsGrowing] = useState(false);
  const [actionCooldown, setActionCooldown] = useState<Record<string, boolean>>({});
  const [showReward, setShowReward] = useState(false);
  const [rewardText, setRewardText] = useState('');
  const [showVideo, setShowVideo] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const { messages, input, handleInputChange, handleSubmit, setMessages } = useChat({
    api: '/api/chat',
    initialMessages: [
      {
        id: '1',
        role: 'system',
        content: `You are a cute baby boy named ${metadata.name}. You are level ${metadata.level}. 
        Your current mood is ${metadata.mood}. You were last fed at ${metadata.lastFed} and 
        last played with at ${metadata.lastPlayed}. You speak in a very cute baby way, using 
        simple words and lots of emojis. You often mention wanting attention from your mom 
        and express your current needs based on your metadata.`
      }
    ],
  });

  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll chat to bottom when new messages arrive
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  // Simulate time passing and boy needs
  useEffect(() => {
    setStats(prev => ({
      ...prev,
      personality: {
        shyness: Math.random() * 100,
        playfulness: Math.random() * 100,
        curiosity: Math.random() * 100,
      }
    }));
  }, []);

  // Weekly growth check
  useEffect(() => {
    const weeklyCheck = setInterval(() => {
      setStats((prev: any) => ({
        ...prev,
        age: prev.age + 1,
        weeklyGrowth: [...prev.weeklyGrowth, {
          age: prev.age,
          care: prev.care,
          mood: prev.mood,
          date: new Date()
        }]
      }));
      setIsGrowing(true);
    }, 604800000); // Every week

    return () => clearInterval(weeklyCheck);
  }, []);

  // Simulate natural stat decay
  useEffect(() => {
    const decay = setInterval(() => {
      setStats(prev => ({
        ...prev,
        hunger: Math.max(0, prev.hunger - 2),
        energy: Math.max(0, prev.energy - 1.5),
        hygiene: Math.max(0, prev.hygiene - 1),
        mood: Math.max(0, prev.mood - 1),
      }));
    }, 60000); // Every minute

    return () => clearInterval(decay);
  }, []);

  // Watch for love score changes
  useEffect(() => {
    if (stats.love >= 100 && !showVideo) {
      setShowVideo(true);
    }
  }, [stats.love]);

  // Handle video end
  const handleVideoEnd = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = videoRef.current.duration;
    }
  };

  const careActions = [
    {
      id: 'feed',
      name: 'Feed',
      emoji: '🍼',
      color: 'bg-yellow-100',
      hoverColor: 'hover:bg-yellow-200',
      textColor: 'text-yellow-800',
      cooldown: 120000, // 2 minutes
      action: () => {
        setStats(prev => ({
          ...prev,
          hunger: Math.min(100, prev.hunger + 30),
          mood: Math.min(100, prev.mood + 10),
          love: prev.love + 5
        }));
        return "Yummy! Baby is happy! 🍼✨";
      }
    },
    {
      id: 'sleep',
      name: 'Sleep',
      emoji: '😴',
      color: 'bg-blue-100',
      hoverColor: 'hover:bg-blue-200',
      textColor: 'text-blue-800',
      cooldown: 300000, // 5 minutes
      action: () => {
        setStats(prev => ({
          ...prev,
          energy: Math.min(100, prev.energy + 40),
          mood: Math.min(100, prev.mood + 15),
          love: prev.love + 10
        }));
        return "Sweet dreams! Baby is resting! 😴💫";
      }
    },
    {
      id: 'play',
      name: 'Play',
      emoji: '🧸',
      color: 'bg-green-100',
      hoverColor: 'hover:bg-green-200',
      textColor: 'text-green-800',
      cooldown: 180000, // 3 minutes
      action: () => {
        setStats(prev => ({
          ...prev,
          mood: Math.min(100, prev.mood + 25),
          energy: Math.max(0, prev.energy - 10),
          love: prev.love + 15
        }));
        return "Wheee! Baby loves playing! 🧸✨";
      }
    },
    {
      id: 'clean',
      name: 'Clean',
      emoji: '🛁',
      color: 'bg-purple-100',
      hoverColor: 'hover:bg-purple-200',
      textColor: 'text-purple-800',
      cooldown: 240000, // 4 minutes
      action: () => {
        setStats(prev => ({
          ...prev,
          hygiene: Math.min(100, prev.hygiene + 35),
          mood: Math.min(100, prev.mood + 10),
          love: prev.love + 8
        }));
        return "Splish splash! Baby is clean! 🛁✨";
      }
    }
  ];

  const handleCareAction = async (action: typeof careActions[0]) => {
    if (actionCooldown[action.id]) return;

    // Execute action and get result
    const result = action.action();
    setRewardText(result);
    setShowReward(true);
    setTimeout(() => setShowReward(false), 2000);

    // Create the messages
    const actionMessage = {
      id: Date.now().toString(),
      role: 'user' as const,
      content: `*Mommy ${action.name.toLowerCase()}s ${metadata.name}* ${result}`
    };

    // Add message to chat and trigger AI response
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages: [
          ...messages,
          actionMessage,
          {
            role: 'user',
            content: `You were just ${action.name.toLowerCase()}ed by your mommy. How do you feel?`
          }
        ]
      }),
    });

    const data = await response.json();
    
    // Update messages with both action and AI response
    setMessages([
      ...messages,
      actionMessage,
      {
        id: (Date.now() + 1).toString(),
        role: 'assistant' as const,
        content: data.choices[0].message.content
      }
    ]);

    // Set cooldown
    setActionCooldown(prev => ({ ...prev, [action.id]: true }));
    setTimeout(() => {
      setActionCooldown(prev => ({ ...prev, [action.id]: false }));
    }, action.cooldown);
  };

  const getBabyResponse = (actionId: string, stats: any) => {
    switch(actionId) {
      case 'feed':
        return stats.hunger > 80 
          ? "Mmm! Tank you mommy! My tummy is so happy now! 🍼💕"
          : "Yummy yummy! More pwease! Still hungwy! 🍼🥺";
      case 'sleep':
        return stats.energy > 80
          ? "Not sweepy anymore! Wanna pway! 😊💫"
          : "Yaaawn~ Nap time with my favowite mommy! 😴💤";
      case 'play':
        return stats.mood > 80
          ? "Weeeee! Best mommy ever! So much fun! 🎈💝"
          : "Yay! Pway time with mommy! Make me happy! 🧸✨";
      case 'clean':
        return stats.hygiene > 80
          ? "So fwesh and clean! Feel like a pwince! 🛁✨"
          : "Spwash spwash! Love bath time with mommy! 🫧💕";
      default:
        return "Love you mommy! 💖";
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Side - Stats */}
        <div className="space-y-4">
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg">
            <h3 className="text-lg font-semibold text-black mb-4">Boy Stats</h3>
            <div className="space-y-4">
              <div>
                <div className="text-sm text-gray-600">Hunger</div>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div 
                    className="bg-yellow-400 rounded-full h-2 transition-all duration-300"
                    style={{ width: `${stats.hunger}%` }}
                  />
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Energy</div>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div 
                    className="bg-blue-400 rounded-full h-2 transition-all duration-300"
                    style={{ width: `${stats.energy}%` }}
                  />
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Hygiene</div>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div 
                    className="bg-purple-400 rounded-full h-2 transition-all duration-300"
                    style={{ width: `${stats.hygiene}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg">
            <div className="text-lg font-semibold text-black mb-2">Love Score</div>
            <div className="text-3xl font-bold text-pink-500">{stats.love}</div>
          </div>
        </div>

        {/* Center - Boy Display and Growth */}
        <div className="lg:col-span-1">
          <div className="relative h-[400px] w-full">
            <AnimatePresence>
              <motion.div
                className={`relative h-full ${isGrowing ? 'animate-pulse' : ''}`}
                animate={isGrowing ? { scale: [1, 1.1, 1] } : {}}
                onAnimationComplete={() => setIsGrowing(false)}
              >
                {showVideo ? (
                  <video
                    ref={videoRef}
                    className="w-full h-[400px] object-cover rounded-xl shadow-lg"
                    autoPlay
                    onEnded={handleVideoEnd}
                  >
                    <source src="/boyVideo.mp4" type="video/mp4" />
                  </video>
                ) : (
                  <img 
                    src={imageUrl} 
                    alt="Your Boy" 
                    className="w-full h-[400px] object-cover rounded-xl shadow-lg"
                  />
                )}
                <div className="absolute top-4 right-4 bg-pink-400 text-white px-4 py-2 rounded-full">
                  Week {stats.age}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Right Side - Chat */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg">
          <div className="h-[400px] flex flex-col">
            <div 
              ref={chatContainerRef}
              className="flex-1 overflow-y-auto mb-4 scroll-smooth"
            >
              {messages.map((message) => (
                message.role !== 'system' && (
                  <div
                    key={message.id}
                    className={`mb-2 ${message.role === 'assistant' ? 'text-right' : ''}`}
                  >
                    <div className={`inline-block px-4 py-2 rounded-lg ${
                      message.role === 'assistant'
                        ? 'bg-pink-100 text-pink-800'
                        : 'bg-purple-100 text-purple-800'
                    }`}>
                      {message.role === 'assistant' && (
                        <span className="text-sm font-bold block mb-1">
                          {metadata.name} 👶
                        </span>
                      )}
                      {message.content}
                    </div>
                  </div>
                )
              ))}
            </div>
            <form onSubmit={handleSubmit} className="flex gap-2">
              <input
                value={input}
                onChange={handleInputChange}
                className="flex-1 border rounded-lg px-4 py-2 bg-white text-black"
                placeholder="Talk to your Boy..."
              />
              <button
                type="submit"
                className="bg-pink-400 text-white px-4 py-2 rounded-lg hover:bg-pink-500 transition-colors"
              >
                💝
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Bottom Actions Bar - Fixed at bottom */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm shadow-lg p-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-4 gap-4">
            {careActions.map(action => (
              <button
                key={action.id}
                onClick={() => handleCareAction(action)}
                disabled={actionCooldown[action.id]}
                className={`relative p-4 ${action.color} ${action.hoverColor} rounded-lg transition-all transform hover:scale-105 ${
                  actionCooldown[action.id] ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                <div className="text-center text-black">
                  <span className="text-2xl text-black">{action.emoji}</span>
                  <p className={`mt-1 font-medium text-black ${action.textColor} text-sm`}>{action.name}</p>
                </div>
                {actionCooldown[action.id] && (
                  <div className="absolute inset-0 bg-gray-500 bg-opacity-20 rounded-lg flex items-center justify-center">
                    <span className="text-xs text-white">Cooldown...</span>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Reward Animation */}
      <AnimatePresence>
        {showReward && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed bottom-24 right-4 bg-white rounded-lg shadow-lg p-4 text-black"
          >
            {rewardText}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}