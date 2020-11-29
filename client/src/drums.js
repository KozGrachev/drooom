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
import perc from './assets/rim.mp3'
// import { Tone } from 'tone/build/esm/core/Tone';

export function Drums () {
  const [kickPattern, setKickPattern] = useState(Array(16).fill(false));
  const [snarePattern, setSnarePattern] = useState(() => Array(16).fill(false));
  const [chhPattern, setChhPattern] = useState(() => Array(16).fill(false));
  const [ohhPattern, setOhhPattern] = useState(() => Array(16).fill(false));
  const [percPattern, setPercPattern] = useState(() => Array(16).fill(false));

  const [pattern, setPattern] = useState({
    kick: Array(16).fill(false),
    snare: Array(16).fill(false),
    chh: Array(16).fill(false),
    ohh: Array(16).fill(false),
    perc: Array(16).fill(false),
  });
  // const steps = [1, 0, 0, 1, 0, 0, 1, 0, 1, 0, 0, 1, 0, 0, 1, 0];

  const [playing, setPlaying] = useState(false);

  const drumMap = new Map();

  useEffect(() => {

    drumMap.set('kick', 'A1');
    drumMap.set('snare', 'B1');
    drumMap.set('chh', 'C1');
    drumMap.set('ohh', 'D1');
    drumMap.set('perc', 'E1');
  })

  const [sampler, setSampler] = useState(() => new Tone.Sampler({
    urls: {
      A1: kick,
      B1: snare,
      C1: chh,
      D1: ohh,
      E1: perc,
    },
    onload: () => console.log('DRUMS LOADED')
  }).toDestination());

  // Consider creating the sequencer here and receiving active/inactive
  // events from Notes
  // Pass the handleClick function down to notes

  function handleNoteClick (note) {
    const newPattern = kickPattern;
    if (note.name === 'kick') {
      newPattern[note.stepNum] = note.active
      setKickPattern(newPattern);
      console.log(newPattern);
    }

    const newPat = pattern;
    newPat[note.name][note.stepNum] = note.active;
    setPattern(newPat);
    console.log(newPat);
    console.log('Clicked: ', note.name, note.stepNum, note.active);
  }

  function playPause () {
    console.log('PLAYING: ', playing);
    Tone.Transport.bpm.value = 120;
    Tone.Transport.scheduleRepeat(playStep, '16n');
    Tone.start();
    const newPlaying = !playing;
    // setPlaying((pl) => !pl);
    // newPlaying ? Tone.Transport.start() : Tone.Transport.stop();
    let nextStep = prepNextStep(0);
    Tone.Transport.start()

    let stp = 0;
    function playStep () {
      let thsstp = stp % 16;


      sampler.triggerAttack(nextStep);
      // for (const drum in nextStep) {
      //   sampler.triggerAttack(drumMap.get(drum))
      // }
      stp++;
      thsstp = stp % 16;
      nextStep = prepNextStep(thsstp);
    }
  }

  function prepNextStep (stepNum) {
    const toPlay = [];

    for (const el in pattern) {
      if (pattern[el][stepNum]) toPlay.push(drumMap.get(el));
    }

    console.log(toPlay);
    return toPlay;
  }



  function renderSteps () {
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
    </>
  )
}