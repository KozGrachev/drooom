import React, { useState } from 'react';
import './style/Step.scss'
import { uuidv4 } from 'uuidv4'


export function Step (props) {
  const [clicked, setClicked] = useState(false);
  // const [notes, setNotes] = useState([]);

  // function handleClick (event) {
  //   setClicked(!clicked);
  //   console.log('Clicked: ', clicked, event.target)
  // }

  function renderButtons () {
    return (
      <div className={`rot-cont `} key={uuidv4} style={{ transform: `rotate(${props.stepNum * 22.5}deg)` }} >
        <input className="btn" type="button" onClick={(event) => props.handleClick()} />
      </div>
    )
  }

  return (
    <div className="circle" >
      {renderButtons()}

    </div>
  )
}