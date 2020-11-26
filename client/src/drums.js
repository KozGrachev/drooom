import React from 'react';
// import { Circle } from './Circle'
// import './style/Step.scss'
import { Step } from './Step'
import './style/drums.scss'
import { v4 } from 'uuid'

export function Drums () {

  // Consider creating the sequencer here and receiving active/inactive
  // events from Notes
  // Pass the handleClick function down to notes

  function handleNoteClick ( note ) {
    console.log('Clicked: ', note.name, note.stepNum, note.active);
  }

  function renderSteps () {
    const arr = [];
    for (let i = 0; i < 16; i++) {
      arr.push(<Step handleNoteClick={handleNoteClick} stepNum={i} key={v4()} >  </Step>);
    }
    return arr;
  }
  return (
    <>
      {/* { renderButtons()} */}
      {/* <div className="drums-container" >
      </div> */}
      {renderSteps()}

    </>
  )
}