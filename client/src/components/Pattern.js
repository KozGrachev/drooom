import React, { useContext, useEffect } from 'react'
import SocketAPIContext, { socket } from '../api'
import '../style/pattern.scss'
import { buttonColor } from '../helpers'


function Pattern ({ selected, handleTimelineAction, instrument, patNum, numOfPatterns }) {

  const roomId = useContext(SocketAPIContext);

  useEffect(() => {

    socket.on('pattern-action', ([inst, patN, act]) => {
      if (patN === patNum && inst === instrument) {
        handleTimelineAction(act, patN);
      }
    })
  }, []);

  function handleAction (action) {
    socket.emit('pattern-action', [instrument, patNum, action, roomId]);
    handleTimelineAction(action, patNum);
  }

  return (
    <div className={`pattern-container ${selected ? buttonColor[instrument] : ''}`} id={`pattern${patNum}`} onClick={() => {
      handleTimelineAction('select', patNum);
    }
    }>
      <p>Pattern {patNum}</p>
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
