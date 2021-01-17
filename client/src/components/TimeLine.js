import React, { useEffect, useState } from 'react'
import * as Brain from '../tone/main'
import { v4 } from 'uuid';
import '../style/timeLine.scss'
import Pattern from './Pattern'
import { socket } from '../api'


function TimeLine ({instrument}) {

  const [patterns, setPatterns] = useState(Brain.synthPatterns[instrument]);

  useEffect(() => {
    console.log('Synth patterns on init:', Brain.synthPatterns);
    socket.on('create-pattern', (inst) => {
      if (inst === instrument) {
        setPatterns([...patterns, Brain.createEmptyPattern()]);
      }
    });
  }, []);

  useEffect(() => {
    console.log(instrument, ' patterns in Timeline: ', patterns);
    Brain.synthPatterns[instrument] = patterns;
    Brain.displayPattern(instrument, patterns.length - 1);
  }, [patterns]);

  function renderPatterns () {
    console.log(instrument, ' PATTERNS in Brain', Brain.synthPatterns[instrument] )
    return patterns.map((pat, i) => {
      return <Pattern instrument={instrument} pattern={pat} patNum={i} key={ v4() }/>
    })
  }

  //! Add logic to play selected patterns in sequence
  //! Use GSAP Draggable to set order

  function addPattern () {
    //* create empty pattern
    //* select empty pattern
    //* redraw pattern in sequencer from brain
    // socket.emit('create-pattern', instrument);
    const newPats = [...patterns, Brain.createEmptyPattern()]
    console.log('newPats', newPats);
    setPatterns([...patterns, Brain.createEmptyPattern()]);
    // Brain.selectPattern();

  }

  return (
    <div className="timeline-container">
      {renderPatterns()}
      <div className="add-pattern" onClick={() => {
        addPattern();

        console.log('INSTRUMENT:', instrument);
      }}>
        <svg width="24" height="24" xmlns="http://www.w3.org/2000/svg" fillRule="evenodd" clipRule="evenodd"><path d="M11 11v-11h1v11h11v1h-11v11h-1v-11h-11v-1h11z" /></svg>
      </div>
    </div>
  )
}

export default TimeLine
