import React, { useState, useEffect } from 'react';
const numberString = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen'];


export function Note (props) {

  const [active, setActive] = useState(false, () => false);

  function handleClick () {
    const newActive = !active;
    setActive(newActive);
    const state = {
      name: props.name,
      active: newActive,
      stepNum: props.stepNum
    }
    props.handleNoteClick(state)
  }

  return (
    <div className="button-wrapper" style={{width:(props.numOfInstruments - props.position) * (360 / 16)}} >
      <input className={`${props.name} ${numberString[props.stepNum]} ${active ? 'active' : 'inactive'} btn`}
        type="button"
        onClick={handleClick}
        onKeyDown={(e) => e.preventDefault()}
      />
    </div>
  )
}