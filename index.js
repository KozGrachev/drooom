const express = require('express');
const socketIo = require('socket.io');
const app = express();
// const PORT = 3000; //! socket.io port
const PORT = process.env.PORT || 3100;

// const path = require('path');
// const buildPath = path.join(__dirname, '..', 'build')
// app.use(express.static(buildPath));
// app.get('*', (req, res) => res.sendFile(path.join(buildPath, 'index.html')));

if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'))
}

const server = app.listen(PORT, () => {
  console.log('Server listening on port', PORT);
})

const io = socketIo(server,{ cors: true});

io.on('connection', (socket) => {
  console.log('A user has connected');
  socket.on('disconnect', () => console.log('User has disconnected'));

  socket.on('pattern-change', (note) => {
    console.log('event received!!', note);
    socket.broadcast.emit('pattern-change', (note));
  })
})


// const path = require('path');
// const express = require('express');
// const app = express();
// const publicPath = path.join(__dirname, '../build');
// const port = process.env.PORT || 3000;
// app.use(express.static(publicPath));
// app.get('*', (req, res) => {
//   res.sendFile(path.join(publicPath, 'index.html'));
// });
// app.listen(port, () => {
//   console.log('Server is up!');
// });