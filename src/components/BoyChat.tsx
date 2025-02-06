'use client';

import { useChat } from 'ai/react';
import { useState } from 'react';

interface BoyMetadata {
  name: string;
  level: number;
  mood: string;
  lastFed: string;
  lastPlayed: string;
}

export default function BoyChat({ metadata }: { metadata: BoyMetadata }) {
  const { messages, input, handleInputChange, handleSubmit } = useChat({
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

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="flex flex-col space-y-4">
        <div className="flex flex-col space-y-4 max-h-[400px] overflow-y-auto">
          {messages.map((message) => (
            message.role !== 'system' && (
              <div
                key={message.id}
                className={`flex ${
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`${
                    message.role === 'user'
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-200 text-gray-800'
                  } rounded-lg px-4 py-2 max-w-[80%]`}
                >
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

        <form onSubmit={handleSubmit} className="flex gap-4">
          <input
            value={input}
            onChange={handleInputChange}
            placeholder="Talk to your boy..."
            className="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <button
            type="submit"
            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
          >
            Send 💝
          </button>
        </form>
      </div>
    </div>
  );
} 