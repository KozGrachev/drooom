import './style/App.scss';
import { Drums } from './components/drums'
import * as Tone from 'tone';
import { Keys } from './components/keys';
import { useState } from 'react';
Tone.Transport.bpm.value = 120;
Tone.Transport.swing = 0.15;
Tone.Transport.swingSubdivision = '16n';
let count = 0;
let drumLoop;
let keysLoop;

function App () {

  const [loops, setLoops] = useState({});

  async function playPause (name) {

    console.log('\n Play/Pause');
    //* when starting::
    if (loops[name].state === 'stopped') {
      console.log(`Loop ${name} was 'stopped'.`);
      Tone.start();
      //* if transport is playing, start this loop at the next bar
      if (Tone.Transport.state === 'started') {
        console.log(`Transport was 'started', starting loop ${name} (1m)`);
        loops[name].start('+1m');
      }
      //* if not, start transport and start this loop at (0)
      else {
        console.log(`Transport was 'stopped'. Starting transport and loop ${name} (0)`);
        Tone.Transport.start();
        loops[name].start(0);
      }
    } else { //* when stopping::
      console.log(`Loop ${name} was stopped. Checking if other loops are 'started'`);
      //* check if any other loops are playing
      for (const loop in loops) {
        if (loops[loop].state === 'started') { //! maybe check the state of the transport too?
          console.log(`Loop ${loop} state is ${loops[loop].state}. Stopping only loop ${name}`);
          //* if yes, stop this loop at next bar and shortcircuit
          loops[name].stop('+1m');
          return;
        }
      }
      console.log(`No other loops were 'started'. Stopping loop ${name} and transport.`);
      //* if not, stop and cancel the transport immediately and stop this loop
      loops[name].stop();
      Tone.Transport.stop();
      Tone.Transport.cancel();
    }
    // if (Tone.Transport.state === 'stopped') {
    //   Tone.Transport.start();
    //   Tone.Transport.scheduleRepeat(nextStep, '16n');
    //   Tone.start();
    // } else {
    //   Tone.Transport.stop();
    //   Tone.Transport.cancel();
    //   count = 0;
    // }
  }

  function nextStep (time) {
    drumLoop(time, count);
    keysLoop(time, count);
    count++;
  }

  function addLoop (loop, name) {
    setLoops(loops => {
      const newLoops = { ...loops, [name]: loop};
      console.log(newLoops);
      return newLoops;
    });
  }

  function setDrumLoop (cb) {
    drumLoop = cb;
  }
  function setKeysLoop (cb) {
    keysLoop = cb;
  }

  return (
    <div className="app-container">
      <Keys playPause={playPause} passUpLoop={addLoop}/>
      <Drums playPause={playPause} passUpLoop={addLoop} />
    </div>
  );
}

export default App;
