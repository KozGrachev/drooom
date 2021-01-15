import React from 'react';
import '../style/variables.scss';
import '../style/step.scss';
import { v4 } from 'uuid'
import { Note } from './Note.js';


export function Step ({ pattern, noteNames, stepNum, handleNoteClick, shape, buttonColor }) {

  function renderButtons () {
    const buttons = [];
    for (let i = noteNames.length-1; i >= 0; i--) {
      buttons.push(<Note
        name={noteNames[i]}
        shape={shape}
        stepNum={stepNum}
        pattern={pattern}
        position={i}
        numOfNotes={noteNames.length}
        handleNoteClick={handleNoteClick}
        buttonColor={buttonColor}
        key={v4()}
      />);
    }
    return buttons
  }

  return (
    <div >
      <div
        className={`step ${stepNum} ${shape}`}
        style={shape === 'circle'
          ? { transform: `rotate(${stepNum * 22.5}deg)` }
          : {}
        }
      >
        {/* <p>{stepNum}</p> */}
        {renderButtons()}
      </div>
    </div>
  )
}