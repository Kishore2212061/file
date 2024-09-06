const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(cors());

io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.on('sendOffer', ({ offer, targetId }) => {
    io.to(targetId).emit('receiveOffer', { offer, fromId: socket.id });
  });

  socket.on('sendAnswer', ({ answer, targetId }) => {
    io.to(targetId).emit('receiveAnswer', answer);
  });

  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

const port = process.env.PORT || 5000;
server.listen(port, () => {
  console.log(`Signaling server running on port ${port}`);
});
