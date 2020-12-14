import React, { useState } from 'react';
import './style/variables.scss';
import './style/Step.scss';
import { v4 } from 'uuid'
import { Note } from './Note.js';


export function Step (props) {

  function renderButtons () {
    const names = ['kick', 'snare', 'ohh', 'chh', 'perc','a', 'b']

    return names.map((name, i) => {
      return (
        <Note name={name} stepNum={props.stepNum} position={i} numOfInstruments={names.length} handleNoteClick={props.handleNoteClick} key={v4()} />
      )
    })


  }

  return (
    <div >
      <div className={`step ${props.stepNum}`} style={{ transform: `rotate(${props.stepNum * 22.5}deg) ` }} >
        {/* <p>{props.stepNum}</p> */}
        {renderButtons()}
      </div>
    </div>
  )
}