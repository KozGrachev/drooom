import './style/App.scss';
import { Drums } from './components/drums'
import * as Tone from 'tone';
import { Keys } from './components/keys';
Tone.Transport.bpm.value = 120;
Tone.Transport.swing = 0.15;
Tone.Transport.swingSubdivision = '16n';
let count = 0;
let drumLoop;

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
    count = (count + 1) % 16;
  }

  function setDrumLoop (cb) {
    drumLoop = cb;
  }

  return (
    <div>
      {/* <Keys playPause={playPause}/> */}
      <Drums playPause={playPause} passUpLoop={setDrumLoop} />
    </div>
  );
}

export default App;
