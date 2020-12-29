import './style/App.scss';
import { Drums } from './components/drums'
import * as Tone from 'tone';
import { Keys } from './components/keys';
Tone.Transport.bpm.value = 120;
Tone.Transport.swing = 0.15;
Tone.Transport.swingSubdivision = '16n';
let count = 0;
let drumLoop;
let keysLoop;

function App () {

  function playPause () {
    if (Tone.Transport.state === 'stopped') {
      Tone.Transport.toggle();
      Tone.Transport.scheduleRepeat(nextStep, '16n');
      Tone.start();
    } else {
      Tone.Transport.stop();
      Tone.Transport.cancel();
      count = 0;
    }
  }

  function nextStep (time) {
    drumLoop(time, count);
    keysLoop(time, count);
    count++;
  }

  function setDrumLoop (cb) {
    drumLoop = cb;
  }
  function setKeysLoop (cb) {
    keysLoop = cb;
  }

  return (
    <div className="app-container">
      <Keys playPause={playPause} passUpLoop={setKeysLoop}/>
      <Drums playPause={playPause} passUpLoop={setDrumLoop} />
    </div>
  );
}

export default App;
