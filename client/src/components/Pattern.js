import React from 'react'
import '../style/pattern.scss'
import * as Brain from '../tone/main'


function Pattern ({ instrument, pattern, patNum }) {
  return (
    <div className="pattern-container" onClick={() => {
      Brain.displayPattern(instrument, patNum)
      // console.log(Brain.synthPatterns[instrument]);
    }
    }>
      Pattern {patNum}
    </div>
  )
}

export default Pattern
