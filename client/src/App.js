import './style/App.scss';
import { Drums } from './components/Drums'
import { Synth } from './components/Synth';
import { useEffect } from 'react';
import { socket } from './api'

function App () {

  useEffect(() => {

    return () => socket.disconnect();
  }, []);

  return (
    <div className="app-container">
      <Synth  />
      <Drums  />
    </div>
  );
}

export default App;
