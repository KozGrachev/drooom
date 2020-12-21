const express = require('express');
const socketIo = require('socket.io');
const app = express();
const PORT = 3101;

// app.use((require('cors'))())

const server = app.listen(PORT, () => {
  console.log('Server listening on port', PORT);
})

const io = socketIo(server, {
  cors: true,
  origins:['http://localhost:3100']
});

io.on('connection', (socket) => {
  console.log('A user has connected');
  socket.on('disconnect', () => console.log('User has disconnected'));

  socket.on('pattern-change', (note) => {
    console.log('event received!!', note);
    socket.broadcast.emit('pattern-change', (note));
  })
})