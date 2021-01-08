import React, { useState } from 'react';
import '../style/note.scss';
import * as helpers from './helpers';


export function Note ({ pattern, name, stepNum, handleNoteClick, numOfNotes, position, shape }) {

  const [active, setActive] = useState(false, () => false);

  function handleClick (e) {
    if (shape === 'grid') console.log('FROM BUTTON: ',pattern[stepNum]);
    const newActive = !active;
    setActive(newActive);
    const state = {
      name: name,
      relativeName: helpers.relativeNoteNames[position],
      active: newActive,
      stepNum: stepNum,
      position: position
    }

    handleNoteClick(state)
  }

  // ${ pattern[stepNum].hasOwnProperty(name) ? active : '' }
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
          ${ stepNum >= 0 && pattern && pattern[stepNum].hasOwnProperty(helpers.relativeNoteNames[position]) ? 'active' : '' }
          btn
          ${helpers.relativeNoteNames[position]}
          step${stepNum}
          ${shape}`
        }
        type="button"
        onMouseDown={(e) => handleClick(e)}
        onKeyDown={(e) => e.preventDefault()}
        value={`${shape === 'grid' ? name : ''}`}
      />
    </div>
  )
}