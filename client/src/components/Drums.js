import React, { useEffect } from 'react';
import { Step } from './Step.js';
// import { VSlider } from "./VSlider";
import * as Brain from '../tone/main';
import '../style/drums.scss';
import * as Tone from 'tone';
import { v4 } from 'uuid';
import {socket} from '../api'
import PlayButton from './PlayButton.js';

export function Drums () {

  useEffect(() => {
    socket.on('pattern-change-drums', (note) => {
      Brain.changeDrumPattern(note);
      buttonToggleActive(note);
    });
  }, []);

  function buttonToggleActive (note) {
    // const thisNote = document.querySelector(`.step${note.stepNum}.${note.name}`);
    const thisNote = document.querySelector(`.step${note.stepNum}.${note.name}.circle`);
    thisNote.classList.toggle('active');
    thisNote.classList.toggle('inactive');
  }

  function handleNoteClick (note) {
    socket.emit('pattern-change-drums', note);
    buttonToggleActive(note);
    Brain.changeDrumPattern(note);
  }

  function setBpm (val) {
    Tone.Transport.bpm.value = val;
  }


  function renderSteps () {
    // console.log('RENDERING STEPS');
    const arr = [];
    for (let i = 0; i < 16; i++) {
      arr.push(<Step
        pattern={Brain.drumsPattern}
        handleNoteClick={handleNoteClick}
        stepNum={i} shape="circle"
        noteNames={Brain.drumNames}
        key={v4()} />);
    }
    return arr;
  }

  return (
    <div className="drums-container">
      <div className="drumpad-container">
        <div className="drumpad-wrapper">
          {renderSteps()}
        </div>
        <PlayButton shape="circle" instrument="drums" />

        <div className="drums-controls">
          <div className="slider-wrapper">
            {/* <VSlider handleChange={setBpm} className="slider" /> */}
          </div>
        </div>
      </div>
    </div>
  )
}