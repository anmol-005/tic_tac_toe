import React, { useState } from 'react';
import GameBoard from './components/GameBoard';
import ComputerGame from './components/ComputerGame';
import MultiplayerGame from './components/MultiplayerGame';

const App: React.FC = () => {
  const [gameMode, setGameMode] = useState<'menu' | 'computer' | 'multiplayer'>('menu');

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg">
        {gameMode === 'menu' ? (
          <div className="space-y-4">
            <h1 className="text-3xl font-bold text-center mb-8">Tic Tac Toe</h1>
            <button
              onClick={() => setGameMode('computer')}
              className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition"
            >
              Play vs Computer
            </button>
            <button
              onClick={() => setGameMode('multiplayer')}
              className="w-full bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition"
            >
              Play vs Friend
            </button>
          </div>
        ) : gameMode === 'computer' ? (
          <ComputerGame onBack={() => setGameMode('menu')} />
        ) : (
          <MultiplayerGame onBack={() => setGameMode('menu')} />
        )}
      </div>
    </div>
  );
};

export default App; 