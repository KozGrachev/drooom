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

let users = [];
const states = {
  //! Create a state object for each instrument in tone/main
}

io.on('connection', (socket) => {
  console.log('A user has connected');
  socket.on('disconnect', () => console.log('User has disconnected'));

  socket.on('join-room', (username, roomId) => {
    const user = {
      username,
      id: socket.id,
    };
    console.log('User added!', users);
    users.push(user);
    socket.join(roomId);
    io.emit('new-user', users);
  })

  socket.on('leave-room', (roomId) => {
    socket.leave(roomId);
    console.log('Users before filter: ',users);
    users = users.filter((user) => user.id !== socket.id);
    console.log('Users after filter: ',users);
  });

  // socket.on('join-room', (roomName, cb) => {
  //   socket.join(roomName);
  //   // cb(states)
  // })

  // io.to(sessionId).emit('create-session-id', sessionId);


  socket.on('pattern-change-drums', (note, roomId) => {
    console.log('Drums pattern change event received!!', note, roomId);
    socket.to(roomId).emit('pattern-change-drums', note);
  })

  socket.on('pattern-change', ([instrument, patNum, note, roomId]) => {
    console.log(`${instrument} pattern change event received!! pattern`, patNum, note);
    socket.to(roomId).emit('pattern-change', [instrument, patNum, note]);
  })

  socket.on('key-change', (key, roomId) => {
    console.log('key change event received!!', key);
    socket.to(roomId).emit('key-change', key);
  })

  socket.on('mode-change', (mode, roomId) => {
    console.log('mode change event received!!', mode);
    socket.to(roomId).emit('mode-change', mode);
  })

  socket.on('play-instrument', (instrument, roomId) => {
    console.log('play instrument event received!!', instrument);
    socket.to(roomId).emit('play-instrument', instrument);
  })

  socket.on('pattern-action', ([instrument, patNum, action, roomId]) => {
    console.log('clear pattern event received!!', instrument, patNum, action);
    socket.to(roomId).emit('pattern-action', [instrument, patNum, action]);
  })
})