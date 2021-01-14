import './style/App.scss';
import { Drums } from './components/Drums'
import { Lead } from './components/Lead';
import { useEffect } from 'react';
import { socket } from './api'

function App () {

  useEffect(() => {

    return () => socket.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="app-container">
      <Lead  />
      <Drums  />
    </div>
  );
}

export default App;
