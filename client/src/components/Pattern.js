import React, { useEffect } from 'react'
import { socket } from '../api'
import '../style/pattern.scss'
import * as Brain from '../tone/main'


function Pattern ({ instrument, pattern, patNum }) {

  useEffect(() => {
    socket.on('activate-pattern', ([inst, patN]) => {
      if (patN === patNum && inst === instrument) {
        Brain.playingPatterns[instrument] = patNum;
      }
    });
  }, []);

  return (
    <div className="pattern-container" id={`pattern${patNum}`} onClick={() => {
      Brain.displayPattern(instrument, patNum)
      // console.log(Brain.synthPatterns[instrument]);
    }
    }>
      Pattern {patNum}
      {/* //! simplify css: create .container class */}
      <div className="pattern-actions-container">
        <input className={`pattern-action btn grid`} type="button" value="Play" onClick={() => {
          //* set playing pattern to this instrument and pattern number
          socket.emit('activate-pattern', [instrument, patNum])
          Brain.playingPatterns[instrument] = patNum;
        }} />
        <input className={`pattern-action btn grid`} type="button" value="Clear" onClick={() => {
          //* set playing pattern to this instrument and pattern number
          socket.emit('clear-pattern', [instrument, patNum])
          Brain.playingPatterns[instrument] = patNum;
        }} />
      </div>
    </div>
  )
}

export default Pattern
