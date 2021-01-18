import React, { useEffect, useState } from 'react'
import * as Brain from '../tone/main'
import { v4 } from 'uuid';
import '../style/timeLine.scss'
import Pattern from './Pattern'
import { socket } from '../api'


function TimeLine ({instrument}) {

  const [patterns, setPatterns] = useState(Brain.synthPatterns[instrument]);
  // const [willDisplayPattern, setWillDisplayPattern] = useState();
  const [selected, setSelected] = useState(0);
  const [activated, setActivated] = useState(0);

  useEffect(() => {
    console.log('Synth patterns on init:', Brain.synthPatterns);
    socket.on('create-pattern', (inst) => {
      if (inst === instrument) {
        console.log('inst === instrument');
        setPatterns((pats) => {
          return [...pats, Brain.createEmptyPattern()];
        });
        // setWillDisplayPattern(false);
      }
    });
  }, []);

  useEffect(() => {
    Brain.synthPatterns[instrument] = patterns;
    console.log(`Number of patterns:`, patterns.length, Brain.synthPatterns[instrument].length);
    // if (willDisplayPattern) Brain.displayPattern(instrument, patterns.length - 1);
  }, [patterns]);

  // useEffect(() => {
  //   if (willDisplayPattern) Brain.displayPattern(instrument, patterns.length - 1);
  // }, [willDisplayPattern])

  useEffect(() => {
    console.log('New selected: ', selected);
    Brain.displayPattern(instrument, selected);
  }, [selected])

  useEffect(() => {
    Brain.handlePatternAction(instrument, activated, 'activate');
  },[activated])

  function renderPatterns () {
    console.log(instrument, ' PATTERNS in Brain', Brain.synthPatterns[instrument] )
    return patterns.map((pat, i) => {
      return <Pattern selected={i === selected} handleTimelineAction={handleTimelineAction} instrument={instrument} pattern={pat} numOfPatterns={patterns.length} patNum={i} key={ v4() }/>
    })
  }

  //! Add logic to play selected patterns in sequence
  //! Use GSAP Draggable to set order


  // function handleClickAddPattern () {
  //   //* create empty pattern
  //   //* select empty pattern
  //   //* redraw pattern in sequencer from brain

  //   socket.emit('create-pattern', instrument);
  //   // const newPats = [...patterns, Brain.createEmptyPattern()]
  //   // console.log('newPats', newPats);
  //   setPatterns((pats) => {
  //     const newPats = [...pats, Brain.createEmptyPattern()];
  //     // Brain.synthPatterns[instrument] = newPats;
  //     return newPats;
  //   });

  //   setWillDisplayPattern(true);
  //   // Brain.synthPatterns[instrument] = newPats;
  //   // Brain.displayPattern(instrument, patterns.length - 1);
  //   // Brain.selectPattern();
  // }

  function handleTimelineAction (action, patNum) {
    switch (action) {
      case 'delete':
        console.log('Deleting... ', instrument, patNum, ' length:',patterns.length);
        Brain.deactivateAllNotes(instrument, patNum);
        setPatterns((pats) => {
          const newPats = [...pats];
          newPats.splice(patNum, 1);

          return newPats;
        })

        if (activated >= patNum && activated > 0) {
          setActivated((actv) => actv - 1);
        }
        if (selected >= patNum && selected > 0) {
          setSelected((sel) => sel - 1);
        } else if (patNum === 0 && selected === 0) Brain.displayPattern(instrument, 1);
        //activated === patterns.length - 1 ) { //! When implementing chained pattern playback, change activated to nowPlaying
          // setSelected( patNum -1);//patNum === patterns.length-1 ? patNum-2 : patNum === 0 && patterns.length > 1 ? patNum : patNum - 1);// : patNum > 0 ? patNum - 1 );
          // setActivated(activated - 2);
        // }

        break;

      case 'duplicate':
        setPatterns((pats) => {
          const newPats = [...pats];
          const clonedPatArray = JSON.parse(JSON.stringify(pats[patNum]));
          newPats.splice(patNum, 0, clonedPatArray);
          return newPats;
        })
        break;

      case 'select':
        console.log('SELECT!!')
        setSelected(patNum);
        break;

      case 'activate':
        setActivated(patNum);
        break;

      case 'clear':
        Brain.handlePatternAction(instrument, patNum, 'clear');
        break;

      case 'add':
        setPatterns((pats) => {
          const newPats = [...pats, Brain.createEmptyPattern()];
          // Brain.synthPatterns[instrument] = newPats;
          setSelected(patterns.length);
          return newPats;
        });
        break;

      default:
        break;
    }
  }

  return (
    <div className="timeline-container">
      {renderPatterns()}
      <div className="add-pattern" onClick={()=> handleTimelineAction('add')}>
        <svg width="24" height="24" xmlns="http://www.w3.org/2000/svg" fillRule="evenodd" clipRule="evenodd"><path d="M11 11v-11h1v11h11v1h-11v11h-1v-11h-11v-1h11z" /></svg>
      </div>
    </div>
  )
}

export default TimeLine
