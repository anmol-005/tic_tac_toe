const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const path = require('path');

const app = express();

// Configure CORS for Express
app.use(cors({
  origin: ['https://tic-tac-toe-frontend.onrender.com', 'http://localhost:3000'],
  methods: ['GET', 'POST', 'OPTIONS'],
  credentials: true
}));

// Serve static files from the React app
const buildPath = path.join(__dirname, 'build');
app.use(express.static(buildPath));

// Handle React routing, return all requests to React app
app.get('*', (req, res) => {
  res.sendFile(path.join(buildPath, 'index.html'));
});

const server = http.createServer(app);

// Configure CORS for Socket.IO
const io = new Server(server, {
  cors: {
    origin: ['https://tic-tac-toe-frontend.onrender.com', 'http://localhost:3000'],
    methods: ['GET', 'POST'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization']
  }
});

const rooms = new Map();

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('createRoom', () => {
    const roomId = Math.random().toString(36).substring(2, 8);
    rooms.set(roomId, { players: [socket.id], board: Array(9).fill(null) });
    socket.join(roomId);
    socket.emit('roomCreated', roomId);
  });

  socket.on('joinRoom', (roomId) => {
    const room = rooms.get(roomId);
    if (room && room.players.length < 2) {
      room.players.push(socket.id);
      socket.join(roomId);
      io.to(roomId).emit('gameStart', room.board);
    } else {
      socket.emit('error', 'Room is full or does not exist');
    }
  });

  socket.on('makeMove', ({ roomId, index, symbol }) => {
    const room = rooms.get(roomId);
    if (room && room.board[index] === null) {
      room.board[index] = symbol;
      io.to(roomId).emit('boardUpdate', room.board);
      
      // Check for winner
      const winner = checkWinner(room.board);
      if (winner) {
        io.to(roomId).emit('gameOver', { winner });
      } else if (!room.board.includes(null)) {
        io.to(roomId).emit('gameOver', { winner: 'draw' });
      }
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    rooms.forEach((room, roomId) => {
      if (room.players.includes(socket.id)) {
        io.to(roomId).emit('playerDisconnected');
        rooms.delete(roomId);
      }
    });
  });
});

function checkWinner(board) {
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
}

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Build path: ${buildPath}`);
}); 