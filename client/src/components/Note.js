import React, { useState, useEffect } from 'react';
import '../style/note.scss';
const numberString = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen'];


export function Note ({ name, stepNum, handleNoteClick, numOfNotes, position, shape }) {

  const [active, setActive] = useState(false, () => false);

  function handleClick (e) {
    const newActive = !active;
    setActive(newActive);
    const state = {
      name: name,
      active: newActive,
      stepNum: stepNum
    }

    handleNoteClick(state)
  }

  return (
    <div
      className={`button-wrapper ${shape}`}
      style={shape === 'circle'
        ? { width: (numOfNotes - position) * (360 / 16)}
        : { }
      } >
      {/* <input className={`${name} ${numberString[stepNum]} ${active ? 'active' : 'inactive'} btn`} */}
      <input className={
        `btn
        ${name}
        step${stepNum}
        ${shape}`}
        type="button"
        onClick={(e) => handleClick(e)}
        onKeyDown={(e) => e.preventDefault()}
        value={`${shape==='grid' ? name : ''}`}
      />
    </div>
  )
}