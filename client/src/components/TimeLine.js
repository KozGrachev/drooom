import React from 'react'
import * as Brain from '../tone/main'
import '../style/timeLine.scss'

function TimeLine ({instrument}) {

  function renderPatterns () {
    console.log('SYNTH PATTERNS', Brain.synthPatterns[instrument] )
    return Brain.synthPatterns[instrument].map((pat, i) => {
      return <div className="pattern-container">
        <p>Pattern {i}</p>

      </div>
    })
  }

  return (
    <div className="timeline-container">
      {renderPatterns()}
      <div className="add-pattern">+</div>
    </div>
  )
}

export default TimeLine
