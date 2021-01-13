import React, { useEffect, useState } from 'react';
import { Step } from './Step';
import { KeysModesList } from './KeysModesList'
import { noteIDs } from '../helpers';
import { Scale, Note } from '@tonaljs/tonal';
import * as Tone from 'tone';
import { v4 } from 'uuid';
import '../style/lead.scss';
import '../assets/svg/play.svg';
const synth = new Tone.PolySynth().toDestination();
synth.volume.value = -15;

let scale = {}
Scale.rangeOf('C major')('C2', 'C6').forEach((note, i) => {
  scale[noteIDs[i]] = note;
});

export function Lead ({ passUpLoop, playPause }) {
  console.log('\n\n');

  const [numSteps, setNumSteps] = useState(32);

  const [pattern, setPattern] = useState(
    localStorage.getItem('droom-keys-pattern')
      ? JSON.parse(localStorage.getItem('droom-keys-pattern'))
      : Array.from({ length: numSteps }, Object)
  );

  useEffect(() => {
    console.log('THIS IS THE NEW SCALE STATE::: ', scale)
  }, [scale]);

  useEffect(() => {
    // createAndPassUpLoop();
  }, [scale]);

  function createAndPassUpLoop () {
    const repEvent = new Tone.ToneEvent((time) => repeat(time));
    repEvent.loop = true;
    repEvent.loopEnd = '16n';
    passUpLoop(repEvent, 'keys');
  }
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
      let thisNoteName = scale[note];// pattern[count][note].name;
      if (Note.pitchClass(thisNoteName) === 'Cb') {
        thisNoteName = Note.transpose(thisNoteName, '8P');
      }
      synth.triggerAttackRelease(`${Scale.scaleNotes([thisNoteName]) === 'Cb'
        ? Note.transpose(thisNoteName, '8P')
        : thisNoteName
        }`, '16n', time + 0.03);
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
    element.classList.add('triggered');
    setTimeout(() => {
      element.classList.remove('triggered');
    }, 100)
  }

  function renderSteps (num, noSequence) {
    const arr = [];
    for (let i = 0; i < num; i++) {
      arr.push(<Step
        handleNoteClick={handleNoteClick}
        pattern={pattern}
        stepNum={noSequence ? -1 : i}
        shape="grid"
        noteNames={Object.values(scale)}
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
    // setOldScale(newScale);
    const thisScale = {};
    newScale.forEach((note, i) => {
      thisScale[noteIDs[i]] = note;
    });
    scale = thisScale;
    // setScale(thisScale);
    console.log('thisScale', thisScale);
    createAndPassUpLoop();
  }

  return (
    <div>
      <div className="container">
        <div className="top-panel">
          <div className="play-button" onMouseDown={() => {
            playPause('keys');
          }
          }>
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
            <KeysModesList setNewScale={setNewScale} />
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