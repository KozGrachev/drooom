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
    // <Slider rows={2}>
    <div className="app-container">
      <section className="instrument-wrapper lead">
        <Synth instrument="lead" buttonColor="yellow" sideBar="keysModesList" />
      </section>
      <section className="instrument-wrapper bass">
        <Synth instrument="bass" buttonColor="red" sideBar="" />
      </section>
      <section className="instrument-wrapper drums">
        <Drums />
      </section>

    </div>
    // </Slider>
  );
}

export default App;
