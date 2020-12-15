import React, { useState } from 'react';
const numberString = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen'];


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
    <div className="button-wrapper" style={{
      width:(props.numOfInstruments - props.position) * (360 / 16),
      }} >
      {/* <p>{arr[i]} </p> */}
      <input className={`${props.name} ${numberString[props.stepNum]} ${active ? 'active' : 'inactive'} btn`} type="button" onClick={handleClick} style={{
        // transform: `translate(-50%, ${props.position * -60}px) `,
        // width: (props.numOfInstruments - props.position) * (360 / 16),
        // background: `rgb(${(200 - colmult * props.position)} ${200 - colmult * props.position} ${200 - colmult * props.position})`,
        // height: 50
      }} />
    </div>
  )
}