const express = require('express');
const socketIo = require('socket.io');
const app = express();
// const PORT = 3000; //! socket.io port
const PORT = process.env.PORT || 3100;

const path = require('path');
const buildPath = path.resolve('client/build')
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(buildPath));
  app.get('*', (req, res) => res.sendFile(path.join(buildPath, 'index.html')));
}


const server = app.listen(PORT, () => {
  console.log('Server listening on port', PORT);
})

const io = socketIo(server, { cors: true });

io.on('connection', (socket) => {
  console.log('A user has connected');
  socket.on('disconnect', () => console.log('User has disconnected'));

  socket.on('pattern-change-drums', (note) => {
    console.log('Drums pattern change event received!!', note);
    socket.broadcast.emit('pattern-change-drums', note);
  })

  socket.on('pattern-change', ([instrument, patNum, note]) => {
    console.log(`${instrument} pattern change event received!! pattern`,patNum, note);
    socket.broadcast.emit('pattern-change', [instrument, patNum, note]);
  })

  socket.on('key-change', (key) => {
    console.log('key change event received!!', key);
    socket.broadcast.emit('key-change', key);
  })

  socket.on('mode-change', (mode) => {
    console.log('mode change event received!!', mode);
    socket.broadcast.emit('mode-change', mode);
  })

  socket.on('play-instrument', (instrument) => {
    console.log('play instrument event received!!', instrument);
    socket.broadcast.emit('play-instrument', instrument);
  })

  socket.on('pattern-action', ([instrument, patNum, action]) => {
    console.log('clear pattern event received!!', instrument, patNum, action);
    socket.broadcast.emit('pattern-action', [instrument, patNum, action]);
  })
})