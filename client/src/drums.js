import React, { useEffect, useState } from 'react';
// import { Circle } from './Circle'
// import './style/Step.scss'
import { Step } from './Step'
import './style/drums.scss'
import * as Tone from 'tone';
import { Sampler } from 'tone';
import { v4 } from 'uuid'
import kick from './assets/kick.mp3'
import snare from './assets/snare.mp3'
import ohh from './assets/hho.mp3'
import chh from './assets/hhc.mp3'
import perc from './assets/clap.mp3'
// import { Tone } from 'tone/build/esm/core/Tone';
const notes = { 'A1': kick, 'B1': snare, 'C1': perc, 'D1': chh, 'E1': ohh };
const noteNames = { 'A1': 'kick', 'B1': 'snare', 'C1': 'perc', 'D1': 'chh', 'E1': 'ohh' };
// create an array to cycle iterate through
const notesEntries = Object.entries(noteNames);
// Create a Sampler with the notes object
const sampler = new Tone.Sampler(notes).toDestination();
Tone.Transport.bpm.value = 120;
Tone.Transport.swing = 0.08;

export function Drums () {

  const [pattern, setPattern] = useState({
    kick: Array(16).fill(false),
    snare: Array(16).fill(false),
    chh: Array(16).fill(false),
    ohh: Array(16).fill(false),
    perc: Array(16).fill(false),
  });
  // const steps = [1, 0, 0, 1, 0, 0, 1, 0, 1, 0, 0, 1, 0, 0, 1, 0];

  let count = 0;
  // const [sampler, setSampler] = useState(() => new Tone.Sampler(notes).toDestination());


  function handleNoteClick (note) {
    // console.log(note.name, note.stepNum, 'playing?', playing);
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
    let step = count % 16;
    // console.log('kick', pattern['kick'][step], 'snare', pattern['snare'][step], 'chh', pattern['chh'][step], 'ohh', pattern['ohh'][step], 'perc', pattern['perc'][step]);
    for (const [note, drum] of notesEntries) {
      // check each checkbox in each row by selecting the number corresponding to the step count
      // const drumName = '.' + drum.match(/[a-z]+/);
      if (pattern[drum][step]) {
        //if checked, play
        sampler.triggerAttackRelease(note, '16n', time);
      }
    }
    count++;
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

      <button onClick={() => playPause()}>PLAY PATTERN</button>
      <button onClick={() => sampler.triggerAttack('A1')}>KICK</button>
      <button onClick={() => sampler.triggerAttack('B1')}>SNARE</button>
      <button onClick={() => sampler.triggerAttack('C1')}>HHO</button>
      <button onClick={() => sampler.triggerAttack('D1')}>HHC</button>
      <button onClick={() => sampler.triggerAttack('E1')}>RIM</button>
      {checkRerender()}
    </>
  )
}