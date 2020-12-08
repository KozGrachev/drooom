import './style/App.scss';
import { useContext } from 'react';
import { Drums } from './drums'
import * as Tone from 'tone';
Tone.Transport.bpm.value = 120;
Tone.Transport.swing = 0.08;
// Tone.Transport.loop = true;
let count = 0;
let drumLoop;

function App () {


  function playPause () {
    console.log('playing? ', Tone.Transport.state)
    console.log('CLICKED');
    if (Tone.Transport.state === 'stopped') {
      console.log('STARTED');
      Tone.Transport.toggle();
      Tone.Transport.scheduleRepeat((time) => {
        drumLoop(time, count);
        count = (count + 1) % 16;
        console.log('count', count);
      }, '16n');
      Tone.start();
    } else {
      // console.log('Stopped');
      // setCount(0);
      Tone.Transport.stop();
      Tone.Transport.cancel();
      count = 0;
      console.log('STOPPED');
    }
    console.log('playing? ', Tone.Transport.state)
    console.log('------------------ \n');
  }

  function setDrumLoop (cb) {
    drumLoop = cb;
  }

  return (
    <div>
      <button id="playPause" onClick={() => playPause()}>PLAY PATTERN</button>
      <Drums passUpLoop={setDrumLoop} />
    </div>
  );
}

export default App;
