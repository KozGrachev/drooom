import React, { useState } from 'react';
// import { Circle } from './Circle'
// import './style/Step.scss'
import { Step } from './Step'
import './style/drums.scss'
import * as Tone from 'tone';
import { Sampler } from 'tone';
import { v4 } from 'uuid'
import kick from './assets/kick.mp3'
import snare from './assets/snare.mp3'
import hho from './assets/hho.mp3'
import hhc from './assets/hhc.mp3'
import rim from './assets/rim.mp3'
// import { Tone } from 'tone/build/esm/core/Tone';

export function Drums () {
  const [step, setStep] = useState(0);
  const steps = [1, 0, 0, 1, 0, 0, 1, 0, 1, 0, 0, 1, 0, 0, 1, 0];

  const [sampler, setSampler] = useState(new Tone.Sampler({
    urls: {
      A1: kick,
      B1: snare,
      C1: hhc,
      D1: hho,
      E1: rim,
    },
    onload: () => console.log('DRUMS LOADED')
  }).toDestination());

  // Consider creating the sequencer here and receiving active/inactive
  // events from Notes
  // Pass the handleClick function down to notes

  function handleNoteClick (note) {
    console.log('Clicked: ', note.name, note.stepNum, note.active);
  }

  function createDrumMachine () {
    console.log('CLICKED DRUM MACHINE');

    Tone.Transport.scheduleRepeat(playStep, '16n');
    Tone.Transport.start();

    let stp = 0;


    function playStep () {

      kick.start(0);
      // console.log('KICK');
      // let thsstp = stp % 16;
      // if (steps[thsstp]) kick.start(0);
      // stp++;

    }
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
      <button onClick={() => sampler.triggerAttack('A1')}>KICK</button>
      <button onClick={() => sampler.triggerAttack('B1')}>SNARE</button>
      <button onClick={() => sampler.triggerAttack('C1')}>HHO</button>
      <button onClick={() => sampler.triggerAttack('D1')}>HHC</button>
      <button onClick={() => sampler.triggerAttack('E1')}>RIM</button>
    </>
  )
}