import React, { useState } from 'react';
import * as helpers from '../helpers';
import '../style/note.scss';
let noteID = helpers.generateNoteIDs(40);


export function Note ({ pattern, name, stepNum, handleNoteClick, numOfNotes, position, shape, buttonColor }) {

  const [active, setActive] = useState(false, () => false);


  function handleClick () {
    if (shape === 'grid') console.log('FROM BUTTON: ', pattern[stepNum], pattern, stepNum);
    else console.log('THIS STEP IS :', name, pattern[name][stepNum]);
    const newActive = !active;
    setActive(newActive);
    const state = {
      name: name,
      noteID: noteID[position],
      active: newActive,
      stepNum: stepNum
    }
    handleNoteClick(state)
  }

  function isActive () {
    if (shape === 'grid'
      && stepNum >= 0
      && pattern[stepNum].hasOwnProperty(noteID[position])) {
      return true;
    }
    else if (shape === 'circle' && pattern[name][stepNum]) {
      return true
    }
    else return false;
  }

  return (
    <div
      className={`button-wrapper ${shape}`}
      style={shape === 'circle'
        ? { width: (numOfNotes - position) * (360 / 16) }
        : {}
      } >
      <input
        className={`
          ${isActive() ? 'active ' + buttonColor : ''}
          btn
          ${shape === 'circle' ? name : noteID[position]}
          step${stepNum}
          ${shape}
          ${buttonColor}`
        }
        type="button"
        onMouseDown={() => handleClick()}
        onKeyDown={(e) => e.preventDefault()}
      />
    </div>
  )
}