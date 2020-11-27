import React, { useState } from 'react';
// import { Circle } from './Circle'
// import './style/Step.scss'
import { Step } from './Step'
import './style/drums.scss'
import * as Tone from 'tone';
import { Sampler } from 'tone';
import { v4 } from 'uuid'
import kick from './assets/kick.mp3'
// import { Tone } from 'tone/build/esm/core/Tone';

export function Drums () {
  const [step, setStep] = useState(0);
  const steps = [1, 0, 0, 1, 0, 0, 1, 0, 1, 0, 0, 1, 0, 0, 1, 0];

  // Consider creating the sequencer here and receiving active/inactive
  // events from Notes
  // Pass the handleClick function down to notes

  function handleNoteClick (note) {
    console.log('Clicked: ', note.name, note.stepNum, note.active);
  }

  function createDrumMachine () {
    console.log('CLICKED DRUM MACHINE');

    const kick = new Tone.Player('../assets/kick.wav').toDestination();
    // const snare = new Tone.Player('../assets/snare.wav').toDestination();
    // const hhc = new Tone.Player('../assets/hhc.wav').toDestination();
    // const hho = new Tone.Player('../assets/hho.wav').toDestination();
    // const rim = new Tone.Player('../assets/rim.wav').toDestination();

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
      {/* { renderButtons()} */}
      {/* <div className="drums-container" >
      </div> */}
      {renderSteps()}
      <div onClick={() => {
        console.log('CLICKED');
        const sampler = new Tone.Sampler({
          urls: {
            A1: kick,
          },
          onload: () => {
            sampler.triggerAttackRelease("A1", 0.5);
          }
        }).toDestination();
      }}>START</div>


    </>
  )
}