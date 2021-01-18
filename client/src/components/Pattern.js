import React, { useEffect } from 'react'
import { socket } from '../api'
import '../style/pattern.scss'
import * as Brain from '../tone/main'
import {buttonColor} from '../helpers'


function Pattern ({ selected, handleTimelineAction, instrument, pattern, patNum, numOfPatterns }) {

  useEffect(() => {
    // socket.on('activate-pattern', ([inst, patN]) => {
    //   if (patN === patNum && inst === instrument) {
    //     // Brain.playingPatterns[instrument] = patNum;
    //     Brain.handlePatternAction('activate')
    //   }
    // });
    // socket.on('clear-pattern', ([inst, patN]) => {
    //   if (patN === patNum && inst === instrument) {
    //     // Brain.clearPattern(instrument, patNum);
    //     Brain.handlePatternAction('clear')
    //   }
    // });
    socket.on('pattern-action', ([inst, patN, act]) => {
      if (patN === patNum && inst === instrument) {
        handleTimelineAction(act, patN);
      }
    })
  }, []);

  // function handleClickActivate () {
  //   //* set playing pattern to this instrument and pattern number
  //   socket.emit('activate-pattern', [instrument, patNum])
  //   Brain.playingPatterns[instrument] = patNum;
  // }

  // function handleClickClear () {
  //   //* set playing pattern to this instrument and pattern number
  //   socket.emit('clear-pattern', [instrument, patNum])
  //   Brain.clearPattern(instrument, patNum);
  // }

  function handleAction (action) {
    socket.emit('pattern-action', [instrument, patNum, action]);
    // Brain.handlePatternAction(action);
    handleTimelineAction(action, patNum);
  }

  return (
    <div className={`pattern-container ${selected ? buttonColor[instrument] : ''}`} id={`pattern${patNum}`} onClick={() => {
      handleAction('select');
      // console.log(Brain.synthPatterns[instrument]);
    }
    }>
      <p>Pattern {patNum}</p>
      {/* //! simplify css: create .container class */}
      <div className="pattern-actions-container">
        <input className={`pattern-action btn grid`} type="button" value="Play" onClick={(event) => {
          event.stopPropagation();
          handleAction('activate')
        }} />
        <input className={`pattern-action btn grid`} type="button" value="Clear" onClick={(event) => {
          event.stopPropagation();
          handleAction('clear')
        }} />
        <input className={`pattern-action btn grid`} type="button" value="x2" onClick={(event) => {
          event.stopPropagation();
          handleAction('duplicate')
        }} />
        <input disabled={patNum === 0 && numOfPatterns <= 1} className={`pattern-action btn grid`} type="button" value="Delete" onClick={(event) => {
          event.stopPropagation();
          handleAction('delete')
        }} />
      </div>
    </div>
  )
}

export default Pattern
