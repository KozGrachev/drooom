import React, { useState, useEffect } from 'react'
import { Scale, Mode } from '@tonaljs/tonal';
import { v4 } from 'uuid';
import '../style/keysModesList.scss'

export function KeysModesList ({ setNewScale }) {

  const [scale, setScale] = useState(localStorage.getItem('droom-keys-scale') || 'C');
  const [mode, setMode] = useState(localStorage.getItem('droom-keys-mode') ||'ionian');

  console.log('====> Db ionian', Scale.rangeOf('Db ionian')('Db2', 'Db6'))

  useEffect(() => {
    // console.log('scale: ', scale, '   mode: ', mode)
    setNewScale(Scale.rangeOf(`${scale} ${mode}`)(`${scale}2`, `${scale}6`));
  }, [scale, mode]);

  function renderScales (arr) {
    return arr.map((note) => {
      return <input
        className={`list-item grid ${note === scale ? 'active' : ''}`}
        type="button" value={note}
        onClick={() => handleScaleClick(note)}
        key={v4()} />
    })
  }

  function renderModes (arr) {
    return arr.map((note) => {
      return <input
        className={`list-item grid ${note === mode ? 'active' : ''}`}
        type="button" value={note}
        onClick={()=>handleModeClick(note)}
        key={v4()} />
    })
  };

  function handleScaleClick (note) {
    setScale(note);
    localStorage.setItem('droom-keys-scale', note);
  }

  function handleModeClick (note) {
    setMode(note);
    localStorage.setItem('droom-keys-mode', note);
  }

  return (
    <div className="scales-container">
      <div className="scales-modes-container">
        <div className="scales list-grid">
          {renderScales(Scale.scaleNotes(Scale.rangeOf('C chromatic')('C1', 'B1')), 'scale')}
        </div>
        <div className="modes list-grid">
          {renderModes(Mode.names(), 'mode')}
        </div>
      </div>
      <div className="scales-tab">Select key / mode</div>
    </div>
  )
}
