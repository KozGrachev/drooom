import React, { useContext, useEffect } from 'react';
import { Step } from './Step.js';
import * as Brain from '../tone/brain';
import '../style/drums.scss';
import { v4 } from 'uuid';
import SocketAPIContext, {socket} from '../api'
import PlayButton from './PlayButton.js';

export function Drums () {

  const roomId = useContext(SocketAPIContext);

  useEffect(() => {
    socket.on('pattern-change-drums', (note) => {
      Brain.changeDrumPattern(note);
      buttonToggleActive(note);
    });
  }, []);

  function buttonToggleActive (note) {
    const thisNote = document.querySelector(`.step${note.stepNum}.${note.name}.circle`);
    thisNote.classList.toggle('active');
    thisNote.classList.toggle('inactive');
  }

  function handleNoteClick (note) {
    socket.emit('pattern-change-drums', note, roomId);
    buttonToggleActive(note);
    Brain.changeDrumPattern(note);
  }


  function renderSteps () {
    const arr = [];
    for (let i = 0; i < 16; i++) {
      arr.push(<Step
        pattern={Brain.instrumentState.drums.patterns[0]}
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
      </div>
    </div>
  )
}