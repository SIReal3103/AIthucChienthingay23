"use client";

import { useState, useEffect } from 'react';
import storyData from '../../data/story.json';

// Define types for our story data to leverage TypeScript's features
interface Choice {
  imageUrl: string;
  altText: string;
  nextId: string;
  effects: {
    health?: number;
    knowledge?: number;
    obesity?: number;
    beauty?: number;
  };
  feedback: string;
}

interface StoryNode {
  introVideoUrl: string;
  scenarioText: string;
  choices: Choice[];
}

interface Story {
  startNodeId: string;
  nodes: Record<string, StoryNode>;
}

const GameScreen = ({ playerName }: { playerName: string }) => {
  const [currentNodeId, setCurrentNodeId] = useState<string>((storyData as Story).startNodeId);
  const [playerStats, setPlayerStats] = useState({ health: 100, knowledge: 0, obesity: 0, beauty: 50 });
  const [showFeedback, setShowFeedback] = useState<string | null>(null);
  const [isVideoPlaying, setIsVideoPlaying] = useState(true);
  const [nextSceneId, setNextSceneId] = useState<string | null>(null);

  const currentNode = (storyData as Story).nodes[currentNodeId];

  useEffect(() => {
    setIsVideoPlaying(true);
  }, [currentNodeId]);

  const handleChoice = (choice: Choice) => {
    const { effects } = choice;
    let feedbackMessage = choice.feedback;
    const effectsDescriptions = [];

    if (effects.health) {
      effectsDescriptions.push(`sức khỏe ${effects.health > 0 ? '+' : ''}${effects.health}`);
    }
    if (effects.obesity) {
      effectsDescriptions.push(`béo phì ${effects.obesity > 0 ? '+' : ''}${effects.obesity}`);
    }
    if (effects.beauty) {
      effectsDescriptions.push(`sắc đẹp ${effects.beauty > 0 ? '+' : ''}${effects.beauty}`);
    }

    if (effectsDescriptions.length > 0) {
      feedbackMessage += `\nVì lựa chọn này, mascot của bạn đã bị ảnh hưởng: ${effectsDescriptions.join(', ')}.`;
    }
    
    // Update player stats
    setPlayerStats(prevStats => ({
      health: prevStats.health + (effects.health || 0),
      knowledge: prevStats.knowledge + (effects.knowledge || 0),
      obesity: prevStats.obesity + (effects.obesity || 0),
      beauty: prevStats.beauty + (effects.beauty || 0),
    }));

    // Show feedback
    setShowFeedback(feedbackMessage);
    setNextSceneId(choice.nextId);
  };

  const handleContinue = () => {
    setShowFeedback(null);
    if (nextSceneId) {
      setCurrentNodeId(nextSceneId);
      setNextSceneId(null);
    }
  };

  const handleVideoEnd = () => {
    setIsVideoPlaying(false);
  };

  const handleVideoError = () => {
    console.error("Lỗi tải video:", currentNode.introVideoUrl);
    setIsVideoPlaying(false); // Bỏ qua video và hiển thị lựa chọn
  };

  const getMascotImage = (health: number) => {
    if (health >= 100) {
      return '/images/masco/state1.png';
    } else if (health > 80) {
      return '/images/masco/state2.png';
    } else {
      return '/images/masco/state3.png';
    }
  };

  if (!currentNode) {
    return (
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">Hết game!</h2>
        <p>Cảm ơn {playerName} đã chơi.</p>
        <p>Chỉ số cuối cùng của bạn:</p>
        <p>Sức khỏe: {playerStats.health}</p>
        <p>Kiến thức: {playerStats.knowledge}</p>
      </div>
    );
  }

  return (
    <div className="flex w-full">
      {/* Player Stats */}
      <div className="w-1/3 bg-gray-100 p-4 rounded-lg shadow mr-4">
        <div className="flex flex-col items-center">
          <img src={getMascotImage(playerStats.health)} alt="Mascot" className="w-32 h-32 mb-4" />
          <h3 className="font-bold text-xl mb-2">{playerName}</h3>
          <p>❤️ Sức khỏe: {playerStats.health}</p>
          <p>💡 Kiến thức: {playerStats.knowledge}</p>
          <p>⚖️ Béo phì: {playerStats.obesity}</p>
          <p>💅 Sắc đẹp: {playerStats.beauty}</p>
        </div>
      </div>

      {/* Game Content */}
      <div className="w-2/3 relative">
        {isVideoPlaying ? (
          <video
            key={currentNode.introVideoUrl}
            src={currentNode.introVideoUrl}
            autoPlay
            playsInline
            onEnded={handleVideoEnd}
            onError={handleVideoError}
            className="w-full rounded-t-lg bg-black" // Thêm nền đen phòng khi video không load được
          />
        ) : (
          <div className="p-4 flex flex-col items-center">
            <h2 className="text-xl font-semibold text-center mb-4">{currentNode.scenarioText}</h2>
            
            {/* Choices */}
            <div className="w-full space-y-4">
              {currentNode.choices.map((choice, index) => (
                <button
                  key={index}
                  onClick={() => handleChoice(choice)}
                  className="w-full border-2 border-transparent rounded-lg overflow-hidden hover:border-green-500 focus:border-green-500 focus:outline-none transition-all shadow-md"
                  disabled={!!showFeedback}
                >
                  <img src={choice.imageUrl} alt={choice.altText} className="w-full h-auto object-cover" />
                  <p className="p-2 bg-gray-50">{choice.altText}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Feedback Overlay */}
        {showFeedback && (
          <div className="absolute inset-0 bg-black bg-opacity-70 flex flex-col items-center justify-center p-4 rounded-lg">
            <p className="text-white text-center text-xl whitespace-pre-line mb-4">{showFeedback}</p>
            <button
              onClick={handleContinue}
              className="bg-green-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-green-700 transition-colors"
            >
              Tiếp tục
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default GameScreen;
