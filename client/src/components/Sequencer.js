import React, { useEffect, useState } from 'react'
import { Step } from './Step';
import '../style/sequencer.scss'
import * as Brain from '../tone/main';
import { v4 } from 'uuid';
import { socket } from '../api'

function Sequencer () {

  const [numSteps, setNumSteps] = useState(32);

  useEffect(() => {
    socket.on('pattern-change-lead', (note) => {
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
    } else Brain.leadSynth.triggerAttackRelease(Brain.scale[note.noteID], '16n');
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
    <div className="piano-roll">
      <div className="piano">
        {renderSteps(1, true)}
      </div>
      <div className="sequencer">
        {renderSteps(numSteps)}
      </div>
    </div>

  )
}

export default Sequencer
