import React, { useState, useEffect } from 'react'
import { Scale, Mode } from '@tonaljs/tonal';
import { v4 } from 'uuid';
import '../style/scalesList.scss'

export function ScalesList ({ setNewScale }) {

  const [scale, setScale] = useState('C');
  const [mode, setMode] = useState('ionian');

  useEffect(() => {
    // console.log('scale: ', scale, '   mode: ', mode)
    // setNewScale(Scale.rangeOf(`${scale} ${mode}`)(`${scale[0]}2`, `${scale[0]}6`));
  }, [scale, mode]);

  function renderScales (arr) {
    return arr.map((note) => {
      return <input
        className={`list-item grid ${note === scale ? 'active' : ''}`}
        type="button" value={note}
        onClick={() => {
          setScale(note);
          setNewScale(Scale.rangeOf(`${scale} ${mode}`)(`${scale[0]}2`, `${scale[0]}6`));
        }}
        key={v4()} />
    })
  }

  function renderModes (arr) {
    return arr.map((note) => {
      return <input
        className={`list-item grid ${note === mode ? 'active' : ''}`}
        type="button" value={note}
        onClick={() => {
          setMode(note);
          setNewScale(Scale.rangeOf(`${scale} ${mode}`)(`${scale[0]}2`, `${scale[0]}6`));
        }}
        key={v4()} />
    })
  };

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
