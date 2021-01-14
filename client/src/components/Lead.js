import React, { useEffect, useState } from 'react';
import { Step } from './Step';
import { KeysModesList } from './KeysModesList'
import * as Brain from '../tone/main';
import { v4 } from 'uuid';
import { socket } from '../api'
import '../style/lead.scss';
import '../assets/svg/play.svg';

export function Lead () {
  console.log('\n\n');

  const [numSteps, setNumSteps] = useState(32);

  useEffect(() => {
    socket.on('pattern-change-lead', (note) => {
      console.log('HELLO YOU CUNT');
      Brain.changeLeadPattern(note);
      buttonToggleActive(note);
    });
  }, []);



  function buttonToggleActive (note) {
    const thisNote = document.querySelector(`.step${note.stepNum}.${note.noteID.replace('#', '\\#')}`);
    thisNote.classList.toggle('active');
    thisNote.classList.toggle('inactive');
  }

  function handleNoteClick (note) {
    if (note.stepNum >= 0) {
      socket.emit('pattern-change-lead', note);
      buttonToggleActive(note); //!!!!!!!!
      Brain.changeLeadPattern(note);
    } else Brain.leadSynth.triggerAttackRelease(note.name, '16n');
  }

  function renderSteps (num, noSequence) {
    const arr = [];
    for (let i = 0; i < num; i++) {
      arr.push(<Step
        handleNoteClick={handleNoteClick}
        pattern={Brain.leadPattern}
        stepNum={noSequence ? -1 : i}
        shape="grid"
        noteNames={Object.values(Brain.scale)}
        key={v4()} />);
    }
    return arr;
  }

  return (
    <div>
      <div className="container">
        <div className="top-panel">
          <div className="play-button" onMouseDown={() => {
            Brain.playPause('keys');
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
            <KeysModesList />
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