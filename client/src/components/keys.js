import React from 'react';
import { Step } from './step';
import { Scale } from '@tonaljs/tonal';
import { v4 } from 'uuid';
import '../style/keys.scss'
const cMaj = Scale.get('C major').notes;

export function Keys () {
  function handleNoteClick (note) {
    console.log(note);
  }

  function renderSteps () {
    console.log(cMaj);
    const arr = [];
    for (let i = 0; i < 32; i++) {
      arr.push(<Step
        handleNoteClick={handleNoteClick}
        stepNum={i}
        shape="grid"
        noteNames={cMaj}
        key={v4()} />);
    }
    return arr;
  }

  return (
    <div className="container">
      <div className="top-panel">
        <div className="play-button">PLAY</div>
        <div className="controls">
          <div className="third-height tempo"></div>
          <div className="third-height tempo-nudge"></div>
          <div className="third-height swing"></div>
        </div>
        <div className="scales"></div>
      </div>
      <div className="piano-roll">
        <div className="piano"></div>
        <div className="sequencer">
          {renderSteps()}
        </div>
      </div>
    </div>
  )
}