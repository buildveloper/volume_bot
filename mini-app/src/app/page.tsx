"use client";
import { useState, useEffect } from 'react';

export default function Home() {
  // We’ll add content here
  const [volume, setVolume] = useState(null);
  useEffect(() => {
    fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=bitcoin')
      .then((response) => response.json())
      .then((data) => setVolume(data[0].total_volume));
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold">Bitcoin Volume Tracker</h1>
      <p className="text-lg">Current Volume: {volume ? volume : 'Loading...'} USD</p>
    </div>
  );
};