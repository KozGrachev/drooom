import React, { useState } from 'react';
import '../style/note.scss';


export function Note ({ pattern, name, stepNum, handleNoteClick, numOfNotes, position, shape }) {

  const [active, setActive] = useState(false, () => false);

  function handleClick (e) {
    console.log('FROM BUTTON: ',pattern[stepNum]);
    const newActive = !active;
    setActive(newActive);
    const state = {
      name: name,
      active: newActive,
      stepNum: stepNum
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
          ${ stepNum >= 0 && pattern && pattern[stepNum].hasOwnProperty(name) ? 'active' : '' }
          btn
          ${name}
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