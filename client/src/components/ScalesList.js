import React, { useState } from 'react'
import { Scale, Mode } from '@tonaljs/tonal';
import { v4 } from 'uuid';
import '../style/scalesList.scss'
const allNotes = Scale.scaleNotes(Scale.rangeOf('C chromatic')('C1', 'B1'));

export function ScalesList ({ setNewScale }) {

  const [scale, setScale] = useState(Scale.rangeOf('C major')('C2, C6'));
  const [mode, setMode] = useState(Mode.names());

  function renderScales () {
    return allNotes.map((note) => {
      return <input className="list-item grid" type="button" value={note} key={v4()} />
    })
  }

  function renderModes () {
    return mode.map((note) => {
      return <input className="list-item grid" type="button" value={note} onMouseDown={() => {

        setNewScale(Scale.rangeOf(''))
      }} key={v4()} />
    })
  }

  return (
    <div className="scales-container">
      <div className="scales-modes-container">
        <div className="scales list-grid">
          {renderScales()}
        </div>
        <div className="modes list-grid">
          {renderModes()}
        </div>
      </div>
      <div className="scales-tab">Select key / mode</div>
    </div>
  )
}
