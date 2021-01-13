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


function App () {

  const [loops, setLoops] = useState({});
  // const [startTime, setStartTime] = useState(0);

  async function playPause (name) {
    Tone.start();
    if (loops[name].state === 'started' && Tone.Transport.state === 'started') {
      for (const ev in loops) {
        if (ev !== name && Object.hasOwnProperty.call(loops, ev) && loops[ev].state === 'started') {
          console.log(`CASE #2: Transport and This event was 'started' and was not the only one. Stopping event ${name}`);
          loops[name].stop();
          return;
        }
      }
      console.log(`CASE #1: Transport was 'started' and no other loops were running. Stopping event ${name} and stopping and cancelling transport`);
      loops[name].stop();
      Tone.Transport.stop();
      Tone.Transport.cancel();
    } else if (loops[name].state === 'stopped' && Tone.Transport.state === 'started') {
      const nextHalfBar = Tone.Time('@2n').quantize('2n'); // .Transport.nextSubdivision('2n'); // .quantize('2n'); // - last;
      loops[name].start(nextHalfBar - startTime);
      loops[name].loop = true;
      loops[name].loopEnd = '16n';
      console.log(`CASE #3: Did not have the event but transport was playing. Adding the event ${name} id:${loops[name]}`);
    } else if (loops[name].state === 'stopped' && Tone.Transport.state === 'stopped') {
      // setStartTime(Tone.Time(Tone.now()).quantize('2n')); //! sets new time relative to when the transport is started
      startTime = Tone.Time(Tone.now()).quantize('2n');
      console.log('CASE #4: this event was not in the array and the transport was stopped. Starting transport and adding event');
      Tone.Transport.start(Tone.now())//'+0.1');
      loops[name].start();
    } else console.error('Unexpected condition! Check the start/stop if statements');
  }

  function replaceLoop (loop, name) {
    loops[name].stop();
    setLoops()
  }

  function addLoop (loop, name) {
    setLoops(loops => {
      // const newLoops = { ...loops, [name]: loop};
      // console.log(newLoops);
      // return newLoops;
      if (loops[name]) {
        console.log('Adding new loop: ', name);
        loops[name].stop();
        loops[name].dispose();
        loops[name] = loop;
        loops[name].start();
      } else {
        console.log('creating loop', name);
        loops[name] = loop;
      }
      return loops;
    });
  }

  return (
    <div className="app-container">
      <Lead playPause={playPause} passUpLoop={addLoop}/>
      <Drums playPause={playPause} passUpLoop={addLoop} />
    </div>
  );
}

export default App;
