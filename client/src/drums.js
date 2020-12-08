import React, { useState } from 'react';
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
Tone.Transport.bpm.value = 120;
Tone.Transport.swing = 0.08;
let count = 0;

export function Drums () {

  const [pattern, setPattern] = useState({
    kick: Array(16).fill(false),
    snare: Array(16).fill(false),
    chh: Array(16).fill(false),
    ohh: Array(16).fill(false),
    perc: Array(16).fill(false),
  });

  function handleNoteClick (note) {
    setPattern((pat) => {
      pat[note.name][note.stepNum] = !pat[note.name][note.stepNum];
      return pat;
    })
    console.log(pattern[note.name][note.stepNum]);
  }

  function playPause () {
    console.log('playing? ', Tone.Transport.state)
    if (Tone.Transport.state === 'stopped') {
      console.log('PLAYING?');
      Tone.Transport.toggle();
      Tone.Transport.scheduleRepeat(repeat, '16n');
      Tone.start();
    } else {
      // console.log('Stopped');
      // setCount(0);
      Tone.Transport.stop();
      Tone.Transport.cancel();
      count = 0;
      console.log('playing? ', Tone.Transport.state)
    }
  }

  function repeat (time) {
    console.log(count);
    // count 0-15
    // console.log('kick', pattern['kick'][step], 'snare', pattern['snare'][step], 'chh', pattern['chh'][step], 'ohh', pattern['ohh'][step], 'perc', pattern['perc'][step]);
    for (const [note, drum] of notesEntries) {
      // check each checkbox in each row by selecting the number corresponding to the step count
      // const drumName = '.' + drum.match(/[a-z]+/);
      if (pattern[drum][count]) {
        //if checked, play
        sampler.triggerAttackRelease(note, '16n', time);
      }
    }
    count = (count + 1) % 16;
    // count++;
  }

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
      <button id="playPause" onClick={() => playPause()}>PLAY PATTERN</button>
      {checkRerender()}
    </>
  )
}