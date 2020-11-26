import React, { useState } from 'react';


export function Note (props) {

  const [active, setActive] = useState(false);

  //?? COULD POSSIBLY USE AS A STATE OBJECT??
  // const [noteState, setNoteState] = useState({
  //   name: props.name,
  //   active: false,
  //   stepNum: props.stepNum
  // });

  function handleClick () {
    console.log(active);
    setActive((act) => !act);
    const state = {
      name: props.name,
      active: active,
      stepNum: props.stepNum
    }
    props.handleNoteClick(state)
  }

  return (
    <div >
      {/* <p>{arr[i]} </p> */}
      <input value={`${props.name} ${props.stepNum}`} className={`btn ${active ? 'active' : 'inactive'}`} type="button" onClick={handleClick} style={{
        transform: `translate(-50%, ${props.position * -60}px) `,
        width: (props.numOfInstruments - props.position) * (360 / 16),
        height: 50
      }} />
    </div>
  )
}