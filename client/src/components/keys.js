import React, { useState } from 'react';
import { Step } from './step';
import { Scale } from '@tonaljs/tonal';
import { v4 } from 'uuid';
import '../style/keys.scss';
import '../assets/svg/play.svg';
const cMaj = Scale.get('C major').notes;
const cMaj4Oct = Scale.rangeOf('C major')('C2', 'C6');

export function Keys () {

  const [numSteps, setNumSteps] = useState(32);

  function handleNoteClick (note) {
    console.log(note);
  }

  function renderSteps (num) {
    console.log(cMaj4Oct);
    const arr = [];
    for (let i = 0; i < num; i++) {
      arr.push(<Step
        handleNoteClick={handleNoteClick}
        stepNum={i}
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
          <svg className="play-icon" xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd"><path className="play-icon-path" d="M23 12l-22 12v-24l22 12zm-21 10.315l18.912-10.315-18.912-10.315v20.63z" /></svg>
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
          {renderSteps(1)}
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