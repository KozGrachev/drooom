import openSocket from 'socket.io-client';
const socket = openSocket('http://localhost:3101');


  socket.broadcast.emit('pattern-change', pattern)

function subscribeTo (cb) {
  socket.on('pattern-change', timestamp => cb(null, timestamp));
  socket.emit('subscribeToTimer', 1000);
}