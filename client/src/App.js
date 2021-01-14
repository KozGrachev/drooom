import './style/App.scss';
import { Drums } from './components/Drums'
import * as Tone from 'tone';
import { Lead } from './components/Lead';
import { useState } from 'react';
Tone.Transport.bpm.value = 120;
Tone.Transport.swing = 0.15;
Tone.Transport.swingSubdivision = '16n';
let startTime = 0;

//TODO: the loops should be instances of Tone.ToneEvent
//TODO: config file with exported objects containing the variables <-- for constants!
//TODO: global state for variables that change

const loops = {keys: [], drums: []};
let playing = {};

function App () {

  // const [loops, setLoops] = useState({});
  // const [startTime, setStartTime] = useState(0);
  function startLoop (name, time) {
    console.log('To stop loop from array ', name, loops[name].length, loops[name]);
    for (let i = loops[name].length - 1; i > 0; i--){
      loops[name][i].stop();
      loops[name][i].dispose();
    }
    loops[name] = loops[name].slice(0, 1);
    loops[name][0].start(time);
  }

  function stopLoop (name) {
    console.log('To stop loop from array ', name, loops[name].length, loops[name]);
    for (let i = loops[name].length - 1; i > 0; i--){
      loops[name][i].stop();
      loops[name][i].dispose();
    }
    loops[name] = loops[name].slice(0, 1);
    loops[name][0].stop();
  }

  async function playPause (name) {

    console.log('PLAY/PAUSE', loops);
    Tone.start();
    if (playing[name] && Tone.Transport.state === 'started') {
      for (const ev in playing) {
        if (ev !== name && playing[ev]) {
          console.log(`CASE #2: Transport and This event was 'started' and was not the only one. Stopping event ${name}`);

          stopLoop(name);
          // loops[name].forEach(el => {
          //   el.stop();
          //   // el.dispose()
          // });
          playing[name] = false;
          return;
        }
      }
      console.log(`CASE #1: Transport was 'started' and no other loops were running. Stopping event ${name} and stopping and cancelling transport`);
      stopLoop(name);
      playing[name] = false;
      Tone.Transport.stop();
      Tone.Transport.cancel();
    } else if (!playing[name] && Tone.Transport.state === 'started') {
      const nextHalfBar = Tone.Time('@2n').quantize('2n'); // .Transport.nextSubdivision('2n'); // .quantize('2n'); // - last;
      startLoop(name, nextHalfBar - startTime);
      playing[name] = true;
      console.log(`CASE #3: Did not have the event but transport was playing. Adding the event ${name} id:${loops[name]}`);
    } else if (!playing[name] && Tone.Transport.state === 'stopped') {
      // setStartTime(Tone.Time(Tone.now()).quantize('2n')); //! sets new time relative to when the transport is started
      startTime = Tone.Time(Tone.now()).quantize('2n');
      console.log('CASE #4: this event was not in the array and the transport was stopped. Starting transport and adding event');
      Tone.Transport.start(Tone.now())//'+0.1');
      startLoop(name);
      playing[name] = true;
    } else {
      console.error('Unexpected condition! Check the start/stop if statements');
      console.error('playing[name]:', name, playing[name])
      // console.error('loops[name]:', name, loops[name].state)
      console.error('Transport.state:', Tone.Transport.state)
    }
  }

  function addLoop (loop, name) {
    const prevLoop = loop[name];
    loops.loop = true;
    loops.loopEnd = '16n';
    loops[name].push(loop);

    // if (prevLoop) {
    //   prevLoop.stop();
    //   setTimeout(() => {
    //     prevLoop.dispose();
    //   }, 200);
    // }
  }


  return (
    <div className="app-container">
      <Lead playPause={playPause} passUpLoop={addLoop}  />
      <Drums playPause={playPause} passUpLoop={addLoop} />
    </div>
  );
}

export default App;
