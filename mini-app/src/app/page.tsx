"use client";
import { useState, useEffect } from 'react';

export default function VolumeCard() {
  // State and logic will go here
  const [volume, setVolume] = useState(null);
  const [countdown, setCountdown] = useState(120); // 60 seconds refresh

  useEffect(() => {
    const fetchVolume = async () => {
      try {
        const response = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=bitcoin');
        const data = await response.json();
        setVolume(data[0].total_volume);
      } catch (error) {
        console.error('Error fetching volume:', error);
        setVolume(null);
      }
    };
  
    fetchVolume(); // Initial fetch
  
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          fetchVolume(); // Refresh volume
          return 120; // Reset to 120 seconds
        }
        return prev - 1;
      });
    }, 1000); // Update every second
  
    return () => clearInterval(timer); // Cleanup
  }, []);
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-gradient-to-br from-indigo-600 to-purple-700 rounded-xl shadow-2xl p-6 text-white">
        <h1 className="text-2xl font-bold text-center mb-4">Meow Peow Peow Bitcoin Volume Card</h1>
        
        <div className="bg-white/10 rounded-lg p-4 mb-4">
          <p className="text-sm opacity-80">Current Volume</p>
          <p className="text-xl font-semibold">
            {volume ? `${(volume / 1000000).toFixed(2)}M USD` : 'Loading...'}
          </p>
        </div>
  
        <div className="bg-white/10 rounded-lg p-4 mb-4">
          <p className="text-sm opacity-80">Refresh In</p>
          <p className="text-xl font-semibold">{countdown} sec</p>
        </div>
        
        <div className="text-center text-sm opacity-70">
          Powered by CoinGecko
        </div>
      </div>
    </div>
  );
}