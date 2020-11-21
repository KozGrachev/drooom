import React from 'react';
// import { Circle } from './Circle'
import { Step } from './Step'
import './style/drums.scss'
import { v4 } from 'uuid'

export function Drums () {

  function handleClick () {
    console.log('Clicked: ');
  }

  function renderCircles () {
    const arr = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

    return arr.map(el => {

      return (
        // <button>hello</button>
        <Step handleClick={handleClick} stepNum={el} key={v4()} > </Step>
      )
    });
    // for (let i = 0; i < 8; i++) {
    //   arr.push(<Step handleClick={handleClick} stepNum={i} key={v4()} >  </Step>);
    // }
    // return arr;

    // return
  }

  function handleClickButton (event) {
    console.log(event.target)
  }

  function renderButtons () {
    const arr = [0, 1, 2, 3, 4, 5];
    return (
      arr.map(el => <button onClick={handleClickButton} >{el}</button>)
    )
  }

  return (
    <>
      { renderButtons()}
      {/* <div className="drums-container" >
      </div> */}
      {renderCircles()}

    </>
  )
}