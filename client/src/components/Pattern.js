import { useControllableProp } from '@chakra-ui/react'
import React from 'react'
import { log } from 'tone/build/esm/core/util/Debug'
import '../style/pattern.scss'
import * as Brain from '../tone/main'


function Pattern ({ instrument, pattern, patNum }) {
  return (
    <div className="pattern-container" id={`pattern${patNum}`} onClick={() => {
      Brain.displayPattern(instrument, patNum)
      // console.log(Brain.synthPatterns[instrument]);
    }
    }>
      Pattern {patNum}
      <input className={`play-pattern`} type="button" value="Play" onClick={() => {
        //* set playing pattern to this instrument and pattern number

        // Brain.playingPattern[instrument] = patNum;
      }}/>
    </div>
  )
}

export default Pattern
