import './style/App.scss';
import { useEffect, useState } from 'react';
import { socket, } from './api'
import {
  BrowserRouter as Router,
  Switch, Route, Link
} from 'react-router-dom';
import Sandbox from './components/Sandbox';
import { v4 } from 'uuid';

function App () {

  const [roomId, setRoomId] = useState();

  useEffect(() => {
    // socket.on('connect', () => setRoomId(socket.id));
    // socket.on
    return () => {
      socket.disconnect();
      return socket.emit('leave-room', roomId);

    }
  }, [])


  return (
    // <Slider rows={2}>
    <Router>
      <Link to={`/room/${v4()}`}>Start new</Link>
      <Link>About</Link>
      <Link>Contact</Link>

      <Switch>
        <Route path="/about">
          "Fucking home page"
          </Route>
        <Route path="/room/:roomId">
          <Sandbox />
        </Route>
      </Switch>
    </Router>
    // </Slider>
  );
}

export default App;
