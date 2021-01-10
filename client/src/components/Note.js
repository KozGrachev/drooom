import React, { useEffect, useState } from 'react';
import * as helpers from './helpers';
import '../style/note.scss';
let noteID = helpers.generateNoteIDs(40);


export function Note ({ pattern, name, stepNum, handleNoteClick, numOfNotes, position, shape }) {

  const [active, setActive] = useState(false, () => false);


  function handleClick () {
    if (shape === 'grid') console.log('FROM BUTTON: ', pattern[stepNum]);
    else console.log('THIS STEP IS :',name, pattern[name][stepNum]);
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

  //${stepNum >= 0 && pattern && pattern[stepNum].hasOwnProperty(noteID[position]) ? 'active' : ''}
  return (
    <div
      className={`button-wrapper ${shape}`}
      style={shape === 'circle'
        ? { width: (numOfNotes - position) * (360 / 16) }
        : {}
      } >
      {/* <input className={`${name} ${numberString[stepNum]} ${active ? 'active' : 'inactive'} btn`} */}
      <input
        className={`
          ${isActive() ? 'active' : ''}
          btn
          ${shape === 'circle' ? name : noteID[position]}
          step${stepNum}
          ${shape}`
        }
        type="button"
        onMouseDown={() => handleClick()}
        onKeyDown={(e) => e.preventDefault()}
        value={`${shape === 'grid' ? name + ' ' + noteID[position].replace('note', '') : ''}`}
      />
    </div>
  )
}