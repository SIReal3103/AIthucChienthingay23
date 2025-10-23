"use client";

import { useState, useEffect } from 'react';
import GameScreen from './components/GameScreen';
import storyData from '../data/story.json';

export default function Home() {
  const [gameStarted, setGameStarted] = useState(false);
  const [playerName, setPlayerName] = useState('');

  // Preload all images when the component mounts to improve performance
  useEffect(() => {
    const imageUrls: string[] = [];
    Object.values(storyData.nodes).forEach(node => {
      node.choices.forEach(choice => {
        if (choice.imageUrl) {
          imageUrls.push(choice.imageUrl);
        }
      });
    });

    console.log('Preloading images:', imageUrls);
    imageUrls.forEach(url => {
      const img = new Image();
      img.src = url;
    });
  }, []);

  const handleStartGame = () => {
    if (playerName.trim()) {
      setGameStarted(true);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-green-100">
      <div className={`w-full ${!gameStarted ? 'max-w-md text-center' : 'max-w-4xl'} mx-auto bg-white rounded-2xl shadow-lg p-8`}>
        {!gameStarted ? (
          <div>
            <h1 className="text-3xl font-bold text-green-700 mb-4">Vệ Sĩ Thực Phẩm</h1>
            <p className="text-gray-600 mb-6">Chào mừng bạn đến với cuộc phiêu lưu bảo vệ sức khỏe!</p>
            <img src="/images/masco/state1.png" alt="Mascot" className="w-32 h-32 mx-auto mb-6" />
            <input
              type="text"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              placeholder="Nhập tên của bạn"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <button
              onClick={handleStartGame}
              disabled={!playerName.trim()}
              className="w-full bg-green-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-green-700 disabled:bg-gray-400 transition-colors"
            >
              Bắt đầu cuộc phiêu lưu
            </button>
          </div>
        ) : (
          <GameScreen playerName={playerName} />
        )}
      </div>
    </main>
  );
}
