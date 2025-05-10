# Online Multiplayer Tic Tac Toe

A modern Tic Tac Toe game with both single-player (vs Computer) and multiplayer modes.

## Features

- Play against the computer
- Play against a friend online
- Real-time multiplayer using Socket.IO
- Modern UI with Tailwind CSS
- Responsive design

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

## Running the Game

1. Start the server:
   ```bash
   node server.js
   ```

2. In a new terminal, start the client:
   ```bash
   npm start
   ```

3. Open your browser and navigate to `http://localhost:3000`

## How to Play

### Single Player Mode
1. Click "Play vs Computer"
2. You'll play as X, and the computer will play as O
3. Click on any empty cell to make your move

### Multiplayer Mode
1. Click "Play vs Friend"
2. To create a new game:
   - Click "Create New Game"
   - Share the room ID with your friend
3. To join a game:
   - Enter the room ID shared by your friend
   - Click "Join Game"
4. The host plays as X, and the guest plays as O

## Technologies Used

- React
- TypeScript
- Socket.IO
- Tailwind CSS
- Node.js
- Express 