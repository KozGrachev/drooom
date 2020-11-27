import './style/App.scss';
import { useState } from 'react';
import * as Tone from 'tone';
// import { Note, Scale } from "@tonaljs/tonal";
import { Drums } from './drums'

function App() {
  // const [note1, setNote1] = useState('c4');
  // const [notesSequence, setNoteSequence] = useState(() => {
  //   return Scale.scale('C pentatonic').notes;
  // });

  // function playSound() {
    //create a synth and connect it to the main output (your speakers)
    // const synthFM = new Tone.FMSynth().toDestination();
    // const synthAM = new Tone.AMSynth().toDestination();
    // const synthPoly = new Tone.PolySynth(Tone.Synth).toDestination();
    // const now = Tone.now();

    // synthPoly.triggerAttack("D4", now);
    // synthPoly.triggerAttack("F4", now + 0.5);
    // synthPoly.triggerAttack("A4", now + 1);
    // synthPoly.triggerAttack("C5", now + 1.5);
    // synthPoly.triggerAttack("E5", now + 2);
    // synthPoly.triggerRelease(["D4", "F4", "A4", "C5", "E5"], now + 4);

    // const loopA = new Tone.Loop(time => {
    //   synthFM.triggerAttackRelease('C2', '8n', time);
    // }, '4n').start(0);
    // const loopB = new Tone.Loop(time => {
    //   synthAM.triggerAttackRelease('C3', '8n', time);
    // });


    // Tone.Transport.start();
    // Tone.Transport.bpm.value = 200;

    //play a middle 'C' for the duration of an 8th note
    // synth.triggerAttackRelease("C4", "8n");
    // synth.triggerAttackRelease('c4', '8n', now);
    // synth.triggerAttackRelease('e4b', '8n', now + 0.5);
    // synth.triggerAttackRelease('g4', '8n', now + 1);
    // synth.triggerRelease(now + 1);
  // }

  // function stopSound() {
  //   Tone.Transport.stop();
  // }

  function playNote(event) {

  }

  // function renderKeys() {

  //   return notesSequence.map((note) => {

  //     return <div className="note" id={note} vaue={note} onClick={playNote}>{note}</div>

  //   })
  // }



  return (
    <div>
      {/* <div className="keyPad">
        {renderKeys}
      </div>
      <button onClick={playSound}>Play</button>
      <button onClick={stopSound}>Stop</button> */}
      <Drums />
    </div>
  );
}

export default App;
