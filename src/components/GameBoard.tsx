import React from 'react';

interface GameBoardProps {
  board: (string | null)[];
  onCellClick: (index: number) => void;
  disabled?: boolean;
}

const GameBoard: React.FC<GameBoardProps> = ({ board, onCellClick, disabled = false }) => {
  return (
    <div className="grid grid-cols-3 gap-2 bg-gray-200 p-2 rounded-lg">
      {board.map((cell, index) => (
        <button
          key={index}
          onClick={() => !disabled && onCellClick(index)}
          disabled={disabled || cell !== null}
          className={`w-20 h-20 bg-white rounded-lg text-4xl font-bold flex items-center justify-center
            ${cell === 'X' ? 'text-blue-500' : cell === 'O' ? 'text-red-500' : 'text-gray-400'}
            ${!disabled && cell === null ? 'hover:bg-gray-100 cursor-pointer' : 'cursor-not-allowed'}
            transition-colors`}
        >
          {cell}
        </button>
      ))}
    </div>
  );
};

export default GameBoard; 