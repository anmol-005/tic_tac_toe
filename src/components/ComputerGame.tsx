import React, { useState, useEffect } from 'react';
import GameBoard from './GameBoard';

interface ComputerGameProps {
  onBack: () => void;
}

const ComputerGame: React.FC<ComputerGameProps> = ({ onBack }) => {
  const [board, setBoard] = useState<(string | null)[]>(Array(9).fill(null));
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [winner, setWinner] = useState<string | null>(null);

  const checkWinner = (board: (string | null)[]): string | null => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
      [0, 4, 8], [2, 4, 6] // diagonals
    ];

    for (const [a, b, c] of lines) {
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return board[a];
      }
    }
    return null;
  };

  const makeComputerMove = () => {
    const emptyCells = board.reduce((acc: number[], cell, index) => {
      if (cell === null) acc.push(index);
      return acc;
    }, []);

    if (emptyCells.length > 0) {
      const randomIndex = emptyCells[Math.floor(Math.random() * emptyCells.length)];
      const newBoard = [...board];
      newBoard[randomIndex] = 'O';
      setBoard(newBoard);
      setIsPlayerTurn(true);

      const gameWinner = checkWinner(newBoard);
      if (gameWinner) {
        setWinner(gameWinner);
      } else if (!newBoard.includes(null)) {
        setWinner('draw');
      }
    }
  };

  useEffect(() => {
    if (!isPlayerTurn && !winner) {
      const timer = setTimeout(makeComputerMove, 500);
      return () => clearTimeout(timer);
    }
  }, [isPlayerTurn, winner]);

  const handleCellClick = (index: number) => {
    if (board[index] === null && isPlayerTurn && !winner) {
      const newBoard = [...board];
      newBoard[index] = 'X';
      setBoard(newBoard);
      setIsPlayerTurn(false);

      const gameWinner = checkWinner(newBoard);
      if (gameWinner) {
        setWinner(gameWinner);
      } else if (!newBoard.includes(null)) {
        setWinner('draw');
      }
    }
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setIsPlayerTurn(true);
    setWinner(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <button
          onClick={onBack}
          className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600 transition"
        >
          Back to Menu
        </button>
        <h2 className="text-xl font-bold">
          {winner
            ? winner === 'draw'
              ? "It's a Draw!"
              : `${winner} Wins!`
            : isPlayerTurn
            ? "Your Turn (X)"
            : "Computer's Turn (O)"}
        </h2>
      </div>
      <GameBoard
        board={board}
        onCellClick={handleCellClick}
        disabled={!isPlayerTurn || !!winner}
      />
      {winner && (
        <button
          onClick={resetGame}
          className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition"
        >
          Play Again
        </button>
      )}
    </div>
  );
};

export default ComputerGame; 