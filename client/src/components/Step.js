import React from 'react';
import '../style/variables.scss';
import '../style/step.scss';
import { v4 } from 'uuid'
import { Note } from './note.js';


export function Step ({ noteNames, stepNum, handleNoteClick, shape }) {

  function renderButtons () {
    console.log(noteNames);
    const buttons = [];
    for (let i = 0; i < noteNames.length; i++) {
      buttons.push(<Note
        name={noteNames[i]}
        shape={shape}
        stepNum={stepNum}
        position={i}
        numOfNotes={noteNames.length}
        handleNoteClick={handleNoteClick}
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