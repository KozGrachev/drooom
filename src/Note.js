import React, { useState } from 'react';

const colmult = 30;
export function Note (props) {

  const [active, setActive] = useState(false, () => false);

  function handleClick () {
    const newActive = !active
    setActive(newActive);
    const state = {
      name: props.name,
      active: newActive,
      stepNum: props.stepNum
    }
    props.handleNoteClick(state)
  }

  return (
    <div >
      {/* <p>{arr[i]} </p> */}
      <input  className={`btn ${active ? 'active' : 'inactive'}`} type="button" onClick={handleClick} style={{
        transform: `translate(-50%, ${props.position * -60}px) `,
        width: (props.numOfInstruments - props.position) * (360 / 16),
        // background: `rgb(${(200 - colmult * props.position)} ${200 - colmult * props.position} ${200 - colmult * props.position})`,
        height: 50
      }} />
    </div>
  )
}