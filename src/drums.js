import React, { useState, useEffect } from 'react';
import { Step } from './Step';
import './style/drums.scss';
import * as Tone from 'tone';
import { v4 } from 'uuid';
import kick from './assets/kick.mp3';
import snare from './assets/snare.mp3';
import ohh from './assets/hho.mp3';
import chh from './assets/hhc.mp3';
import perc from './assets/clap.mp3';
const notes = { 'A1': kick, 'B1': snare, 'C1': perc, 'D1': chh, 'E1': ohh };
const noteNames = { 'A1': 'kick', 'B1': 'snare', 'C1': 'perc', 'D1': 'chh', 'E1': 'ohh' };
const notesEntries = Object.entries(noteNames);
const sampler = new Tone.Sampler(notes).toDestination();

// let count = 0;


//* useEffect to rerender when Transport state changes (or on mount -->[])
//* restart count on play

export function Drums (props) {

  const [pattern, setPattern] = useState({
    kick: Array(16).fill(false),
    snare: Array(16).fill(false),
    chh: Array(16).fill(false),
    ohh: Array(16).fill(false),
    perc: Array(16).fill(false),
  });

  useEffect(() => {
    //* send the repeat function to the transport
    props.passUpLoop(repeat);
  }, []);

  function handleNoteClick (note) {
    setPattern((pat) => {
      pat[note.name][note.stepNum] = !pat[note.name][note.stepNum];
      return pat;
    })
    console.log(pattern[note.name][note.stepNum]);
  }

  function repeat (time, count) {
    for (const [note, drum] of notesEntries) {
      if (pattern[drum][count]) {
        //if checked, play
        sampler.triggerAttackRelease(note, '16n', time);
      }
    }
  }

  console.log('RERENDERED');

  function checkRerender () {
    console.log('RERENDERED');
  }

  function renderSteps () {
    console.log('RENDERING STEPS');
    const arr = [];
    for (let i = 0; i < 16; i++) {
      arr.push(<Step handleNoteClick={handleNoteClick} stepNum={i} key={v4()} >  </Step>);
    }
    return arr;
  }
  return (
    <>
      {renderSteps()}

      {checkRerender()}
    </>
  )
}