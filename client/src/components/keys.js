import React, { useEffect, useState } from 'react';
import { Step } from './step';
import { Scale } from '@tonaljs/tonal';
import * as Tone from 'tone';
import { v4 } from 'uuid';
import '../style/keys.scss';
import '../assets/svg/play.svg';
const cMaj = Scale.get('C major').notes;
const cMaj4Oct = Scale.rangeOf('C major')('C2', 'C6');
const synth = new Tone.PolySynth().toDestination();
synth.volume.value = -5;


export function Keys ({passUpLoop}) {

  const [numSteps, setNumSteps] = useState(32);
  const [pattern, setPattern] = useState(Array.from({ length: numSteps }, Object));

  useEffect(() => {
    passUpLoop(repeat);
    console.log(pattern);
  }, [])

  function buttonToggleActive (note) {
    const thisNote = document.querySelector(`.step${note.stepNum}.${note.name}`);
    thisNote.classList.toggle('active');
    thisNote.classList.toggle('inactive');
  }

  function handleNoteClick (note) {
    // console.log(note);
    buttonToggleActive(note)
    changePattern(note);
    synth.triggerAttackRelease(note.name, 0.3);
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

  function repeat (time, count) {
    for (let key in pattern[count]) {
      synth.triggerAttackRelease(key, '16n', time);
    }
    //* Adds the triggered class to all active buttons in the current step
    //* and removes it from those in the previous step
    // Tone.Draw.schedule(() => {
    //   for (let i = 0; i < notesEntries.length; i++) {
    //     let prevStep = count === 0 ? 15 : count - 1;
    //     let current = document.querySelector(`.${notesEntries[i][1]}.step${count}.active`);
    //     let previous = document.querySelector(`.${notesEntries[i][1]}.step${prevStep}.active`);

    //     if (current) current.classList.add('triggered');
    //     if (previous) previous.classList.remove('triggered');
    //   }
    // }, time)
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

  return (
    <div className="container">
      <div className="top-panel">
        <div className="play-button">
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