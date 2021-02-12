import React, { useContext, useEffect, useState } from 'react'
import * as Brain from '../tone/brain'
import { v4 } from 'uuid';
import '../style/timeLine.scss'
import Pattern from './Pattern'
import SocketAPIContext, { socket } from '../api'


function TimeLine ({instrument}) {

  const [patterns, setPatterns] = useState(Brain.instrumentState[instrument].patterns);
  const [selected, setSelected] = useState(0);
  const [activated, setActivated] = useState(0);
  const roomId = useContext(SocketAPIContext);

  useEffect(() => {
    socket.on('pattern-action', ([inst, patN, act]) => {
      if (inst === instrument && act === 'add') {
        setPatterns((pats) => {
          return [...pats, Brain.createEmptyPattern()];
        });
      }
    });
  }, []);

  useEffect(() => {
    Brain.instrumentState[instrument].patterns = patterns;
  }, [patterns]);

  useEffect(() => {
    Brain.displayPattern(instrument, selected);
  }, [selected])

  useEffect(() => {
    Brain.handlePatternAction(instrument, activated, 'activate');
  },[activated])

  function renderPatterns () {
    return patterns.map((pat, i) => {
      return <Pattern selected={i === selected} handleTimelineAction={handleTimelineAction} instrument={instrument} pattern={pat} numOfPatterns={patterns.length} patNum={i} key={ v4() }/>
    })
  }

  function handleTimelineAction (action, patNum) {
    switch (action) {
      case 'delete':
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
        }
        if (patNum === 0 && selected === 0) {
          setSelected(0); //!
          Brain.displayPattern(instrument, 1);
          Brain.instrumentState[instrument].playingPattern = 0;
          Brain.instrumentState[instrument].visiblePattern = 0;
        }

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
        setSelected(patNum);
        break;

      case 'activate':
        setActivated(patNum);
        break;

      case 'clear':
        Brain.handlePatternAction(instrument, patNum, 'clear');
        setSelected(patNum);
        break;

      case 'add':
        setPatterns((pats) => {
          const newPats = [...pats, Brain.createEmptyPattern()];
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
      <div className="add-pattern" onClick={() => {
        handleTimelineAction('add');
        socket.emit('pattern-action', [instrument, '_', 'add', roomId]);
      }}>
        <svg width="24" height="24" xmlns="http://www.w3.org/2000/svg" fillRule="evenodd" clipRule="evenodd"><path d="M11 11v-11h1v11h11v1h-11v11h-1v-11h-11v-1h11z" /></svg>
      </div>
    </div>
  )
}

export default TimeLine
