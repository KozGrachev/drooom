import React, { useEffect, useState } from 'react';
import { Step } from './Step';
import { ScalesList } from './ScalesList'
import { Scale, Note } from '@tonaljs/tonal';
import * as Tone from 'tone';
import { v4 } from 'uuid';
import '../style/keys.scss';
import '../assets/svg/play.svg';
const synth = new Tone.PolySynth().toDestination();
synth.volume.value = -5;
// const noteID = [];


export function Keys ({ passUpLoop, playPause }) {
  console.log('\n\n');
  const [scale, setScale] = useState(Scale.rangeOf('C major')('C2', 'C6'));

  const [numSteps, setNumSteps] = useState(32);

  const [pattern, setPattern] = useState(
    localStorage.getItem('droom-keys-pattern')
      ? JSON.parse(localStorage.getItem('droom-keys-pattern'))
      : Array.from({ length: numSteps }, Object));
  useEffect(() => {
    // for (let i = 0; i < 30; i++) noteID.push(`note${i}`);
    const repEvent = new Tone.ToneEvent((time) => repeat(time));
    repEvent.loop = true;
    repEvent.loopEnd = '16n';
    passUpLoop(repEvent, 'keys');
  }, [])

  function buttonToggleActive (note) {
    const thisNote = document.querySelector(`.step${note.stepNum}.${note.noteID.replace('#', '\\#')}`);
    thisNote.classList.toggle('active');
    thisNote.classList.toggle('inactive');
  }

  function handleNoteClick (note) {

    console.log('pattern', pattern);
    if (note.stepNum >= 0) {
      buttonToggleActive(note); //!!!!!!!!
      changePattern(note);
    } else synth.triggerAttackRelease(note.name, '16n');
  }

  function changePattern (note) {

    setPattern(pat => {
      if (!pat[note.stepNum].hasOwnProperty(note.noteID)) {
        console.log('adding note:', note);
        pat[note.stepNum][note.noteID] = note;
      } else if (pat[note.stepNum].hasOwnProperty(note.noteID) || !note.active) {
        console.log('DELETING note:', note);
        delete pat[note.stepNum][note.noteID];
      }
      localStorage.setItem('droom-keys-pattern', JSON.stringify(pat));
      return pat;
    })
  }

  function repeat (time) {
    const count = getSixteenths(numSteps);
    for (let note in pattern[count]) {
      let thisNoteName = pattern[count][note].name;
      console.log('noteID:', note, 'actual note:', Note.pitchClass(pattern[count][note].name));
      if (Note.pitchClass(thisNoteName) === 'Cb') {
        thisNoteName = Note.transpose(thisNoteName, '8P');
      }
      synth.triggerAttackRelease(`${Scale.scaleNotes([thisNoteName]) === 'Cb'
          ? Note.transpose(thisNoteName, '8P')
          : thisNoteName
        }`, '16n', time);
    };
    //* Adds the triggered class to all active buttons in the current step
    //* and removes it from those in the previous step
    Tone.Draw.schedule(() => {
      for (const note in pattern[count]) {
        const pianoRollFeedback = document.querySelector(`.${note}.step-1`)
        const currentPlayingNote = document.querySelector(`.${note}.step${count}`)
        addTempClass(pianoRollFeedback);
        addTempClass(currentPlayingNote);
      }
    }, time);
  }

  function addTempClass (element) {
    // if (element) {
    element.classList.add('triggered');
    setTimeout(() => {
      element.classList.remove('triggered');
    }, 100)
    // } else {
    //   console.error('ELEMENT DOES NOT EXIST');
    // }
  }

  function renderSteps (num, noSequence) {
    const arr = [];
    for (let i = 0; i < num; i++) {
      arr.push(<Step
        handleNoteClick={handleNoteClick}
        pattern={pattern}
        stepNum={noSequence ? -1 : i}
        shape="grid"
        noteNames={scale}
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
    return (sixteenths + quarters * 4 + bars * 16) % num;
  }


  function setNewScale (newScale) {
    setScale(newScale);
  }

  return (
    <div>
      <div className="container">
        <div className="top-panel">
          <div className="play-button" onMouseDown={() => playPause('keys')}>
            <svg className="play-icon" xmlns="http://www.w3.org/2000/svg" fillRule="evenodd" clipRule="evenodd"><path className="play-icon-path" d="M23 12l-22 12v-24l22 12zm-21 10.315l18.912-10.315-18.912-10.315v20.63z" /></svg>
          </div>
          <div className="controls">
            <div className="third-height tempo"></div>
            <div className="third-height tempo-nudge"></div>
            <div className="third-height swing"></div>
          </div>
        </div>
        <div className="main-panel" >
          <div className="side-panel_left">
            <ScalesList setNewScale={setNewScale} />
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
      </div>
    </div>
  )
}