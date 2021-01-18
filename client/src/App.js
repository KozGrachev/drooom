import './style/App.scss';
import { Drums } from './components/Drums'
import { Synth } from './components/Synth';
import { useEffect, useRef, useState } from 'react';
import { socket, SocketAPIContextProvider } from './api'
import {SessionLink} from './components/SessionLink';

function App () {

  const [roomId, setRoomId] = useState();

  useEffect(() => {
    socket.on('create-session-id', (id) => setRoomId(id));
    return () => socket.disconnect();
  }, []);

  useEffect(() => {
    console.log("YAAAAY Your ID is: ", roomId);
  }, [roomId]);



  return (
    // <Slider rows={2}>
    <div className="app-container">
      <SocketAPIContextProvider value={roomId}>
        <section className="instrument-wrapper lead">
          <Synth instrument="lead" buttonColor="yellow" sideBar="keysModesList" />
        </section>
        <section className="instrument-wrapper bass">
          <Synth instrument="bass" buttonColor="red" sideBar="" />
        </section>
        <section className="instrument-wrapper drums">
          <SessionLink />
          <Drums />
        </section>
      </SocketAPIContextProvider>


    </div>
    // </Slider>
  );
}

export default App;
