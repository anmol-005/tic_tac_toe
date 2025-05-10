import React, { useState, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';
import GameBoard from './GameBoard';

interface MultiplayerGameProps {
  onBack: () => void;
}

const SOCKET_URL = process.env.NODE_ENV === 'production'
  ? 'https://your-backend-url.onrender.com'
  : 'http://localhost:5000';

const MultiplayerGame: React.FC<MultiplayerGameProps> = ({ onBack }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [board, setBoard] = useState<(string | null)[]>(Array(9).fill(null));
  const [roomId, setRoomId] = useState<string>('');
  const [isHost, setIsHost] = useState(false);
  const [isMyTurn, setIsMyTurn] = useState(false);
  const [winner, setWinner] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [gameStarted, setGameStarted] = useState(false);

  useEffect(() => {
    const newSocket = io(SOCKET_URL);
    setSocket(newSocket);

    newSocket.on('roomCreated', (id: string) => {
      setRoomId(id);
      setIsHost(true);
      setIsMyTurn(true);
    });

    newSocket.on('gameStart', (initialBoard: (string | null)[]) => {
      setBoard(initialBoard);
      setGameStarted(true);
    });

    newSocket.on('boardUpdate', (newBoard: (string | null)[]) => {
      setBoard(newBoard);
      setIsMyTurn(true);
    });

    newSocket.on('gameOver', ({ winner }: { winner: string }) => {
      setWinner(winner);
    });

    newSocket.on('error', (message: string) => {
      setError(message);
    });

    newSocket.on('playerDisconnected', () => {
      setError('Other player disconnected');
      setGameStarted(false);
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);

  const createRoom = () => {
    socket?.emit('createRoom');
  };

  const joinRoom = (id: string) => {
    socket?.emit('joinRoom', id);
    setIsHost(false);
    setIsMyTurn(false);
  };

  const handleCellClick = (index: number) => {
    if (board[index] === null && isMyTurn && !winner) {
      socket?.emit('makeMove', {
        roomId,
        index,
        symbol: isHost ? 'X' : 'O'
      });
      setIsMyTurn(false);
    }
  };

  if (!gameStarted) {
    return (
      <div className="space-y-4">
        <button
          onClick={onBack}
          className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600 transition"
        >
          Back to Menu
        </button>
        <div className="space-y-4">
          <button
            onClick={createRoom}
            className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition"
          >
            Create New Game
          </button>
          <div className="flex space-x-2">
            <input
              type="text"
              placeholder="Enter Room ID"
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
              className="flex-1 p-2 border rounded"
            />
            <button
              onClick={() => joinRoom(roomId)}
              className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition"
            >
              Join Game
            </button>
          </div>
          {error && <p className="text-red-500">{error}</p>}
          {roomId && isHost && (
            <p className="text-center">
              Share this room ID with your friend: <span className="font-bold">{roomId}</span>
            </p>
          )}
        </div>
      </div>
    );
  }

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
            : isMyTurn
            ? "Your Turn"
            : "Opponent's Turn"}
        </h2>
      </div>
      <GameBoard
        board={board}
        onCellClick={handleCellClick}
        disabled={!isMyTurn || !!winner}
      />
      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
};

export default MultiplayerGame; 