import React, { useEffect, useState } from 'react'
import { Step } from './Step';
import '../style/sequencer.scss'
import * as Brain from '../tone/main';
import { v4 } from 'uuid';
import { socket } from '../api'

function Sequencer ({buttonColor, instrument}) {

  const [numSteps, setNumSteps] = useState(32);

  useEffect(() => {
    socket.on(`pattern-change-${instrument}`, (note) => {
      Brain.changeSynthPattern(note, instrument, 0);
      buttonToggleActive(note);
    });
  }, []);

  function buttonToggleActive (note) {
    const thisNote = document.querySelector(`.${instrument} .step${note.stepNum}.${note.noteID.replace('#', '\\#')}`);
    thisNote.classList.toggle('active');
    thisNote.classList.toggle(buttonColor);
    thisNote.classList.toggle('inactive');
  }

  function handleNoteClick (note) {
    if (note.stepNum >= 0) {
      socket.emit(`pattern-change-${instrument}`, note);
      buttonToggleActive(note);
      Brain.changeSynthPattern(note, instrument, 0);
    } else Brain.leadSynth.triggerAttackRelease(Brain.scales[instrument][note.noteID], '16n');
  }

  function renderSteps (num, noSequence) {

    //!renders before scale is created
    const arr = [];
    for (let i = 0; i < num; i++) {
      arr.push(<Step
        handleNoteClick={handleNoteClick}
        pattern={Brain.currentSynthPatterns[instrument]}
        stepNum={noSequence ? -1 : i}
        shape="grid"
        noteNames={Object.values(Brain.scales[instrument])}
        buttonColor={buttonColor}
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
