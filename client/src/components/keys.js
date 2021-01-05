import React, { useEffect, useState } from 'react';
import { Step } from './step';
import { Scale } from '@tonaljs/tonal';
import * as Tone from 'tone';
import { v4 } from 'uuid';
import '../style/keys.scss';
import '../assets/svg/play.svg';
const cMaj4Oct = Scale.rangeOf('C major')('C2', 'C6');
const synth = new Tone.PolySynth().toDestination();
synth.volume.value = -5;


export function Keys ({ passUpLoop, playPause }) {

  const [numSteps, setNumSteps] = useState(32);
  const [pattern, setPattern] = useState(Array.from({ length: numSteps }, Object));

  useEffect(() => {
    const repEvent = new Tone.ToneEvent((time) => repeat(time));
    repEvent.loop = true;
    repEvent.loopEnd = '16n';
    passUpLoop(repEvent, 'keys');
  }, [])

  function buttonToggleActive (note) {
    const thisNote = document.querySelector(`.step${note.stepNum}.${note.name}`);
    thisNote.classList.toggle('active');
    thisNote.classList.toggle('inactive');
  }

  function handleNoteClick (note) {
    // console.log(note);
    if (note.stepNum >= 0) {
      buttonToggleActive(note)
      changePattern(note);
    }
    // synth.triggerAttackRelease(note.name, 0.3); //! toggle on/off for note feedback
  }

  function changePattern (note) {
    setPattern(pat => {

      // const newPat = [...pat];
      if (note.active && !pat[note.stepNum].hasOwnProperty(note.name)) {
        pat[note.stepNum][note.name] = note;
      } else if (!note.active && pat[note.stepNum].hasOwnProperty(note.name)) {
        delete pat[note.stepNum][note.name];
      } else {
        throw new Error(`Note active status is ${note.active} but property ${pat[note.stepNum].hasOwnProperty(note.name) ? 'already exists' : 'does not exist'} in this step object`)
      }
      console.log(note);
      console.log(pat);
      return pat
    })
  }

  function repeat (time) {
    const count = getSixteenths(numSteps);
    for (let key in pattern[count]) {
      synth.triggerAttackRelease(key, '16n', time);
    }
    //* Adds the triggered class to all active buttons in the current step
    //* and removes it from those in the previous step
    Tone.Draw.schedule(() => {
      for (let i = 0; i < cMaj4Oct.length; i++) {
        let current = document.querySelector(`.${cMaj4Oct[i]}.step${count}.active`);
        if (current) {
          current.classList.add('triggered');
          setTimeout(() => {
            current.classList.remove('triggered');
          },100)
        }
      }
    }, time);
  }

  function renderSteps (num, noSequence) {
    const arr = [];
    for (let i = 0; i < num; i++) {
      arr.push(<Step
        handleNoteClick={handleNoteClick}
        stepNum={noSequence ? -1 : i}
        shape="grid"
        noteNames={cMaj4Oct}
        key={v4()} />);
    }
    return arr;
  }

  //! PUT INTO HELPER FUNCTIONS!!
  function getSixteenths (num) {
    const pos = Tone.Transport.position;
    const sixteenths = parseInt(pos.split(':')[2], 10);
    const quarters = parseFloat(pos.split(':')[1], 10);
    const bars = parseFloat(pos.split(':')[0], 10);
    console.log(pos);
    return (sixteenths + quarters * 4 + bars * 16) % num;
  }

  return (
    <div className="container">
      <div className="top-panel">
        <div className="play-button" onClick={() => playPause('keys')}>
          <svg className="play-icon" xmlns="http://www.w3.org/2000/svg" fillRule="evenodd" clipRule="evenodd"><path className="play-icon-path" d="M23 12l-22 12v-24l22 12zm-21 10.315l18.912-10.315-18.912-10.315v20.63z" /></svg>
        </div>
        <div className="controls">
          <div className="third-height tempo"></div>
          <div className="third-height tempo-nudge"></div>
          <div className="third-height swing"></div>
        </div>
        <div className="scales"></div>
      </div>
      <div className="piano-roll">
        <div className="piano">
          {renderSteps(1, true)}
        </div>
        <div className="sequencer"
        // style={{
        //   grid
        // }}
        >
          {renderSteps(numSteps)}
        </div>
      </div>
    </div>
  )
}