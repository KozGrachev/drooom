import React, { useState, useEffect } from 'react';
import { Step } from './Step.js';
import { VSlider } from "./vslider";
import '../style/drums.scss';
import * as Tone from 'tone';
import { v4 } from 'uuid';
import kick from '../assets/audio/kick.mp3';
import snare from '../assets/audio/snare.mp3';
import ohh from '../assets/audio/hho.mp3';
import chh from '../assets/audio/hhc.mp3';
import perc from '../assets/audio/clap.mp3';
import openSocket from 'socket.io-client';
const socket = process.env.NODE_ENV === 'production' ? openSocket() : openSocket('localhost:3100');
const notes = { 'A1': kick, 'B1': snare, 'C1': perc, 'D1': chh, 'E1': ohh };
const noteNames = { 'A1': 'kick', 'B1': 'snare', 'C1': 'perc', 'D1': 'chh', 'E1': 'ohh' };
const names = Object.values(noteNames);
const notesEntries = Object.entries(noteNames);
const sampler = new Tone.Sampler(notes).toDestination();
// let count = 0;

export function Drums ({ playPause, passUpLoop }) {

  const [pattern, setPattern] = useState(
    localStorage.getItem('droom-keys-pattern')
      ? JSON.parse(localStorage.getItem('droom-drums-pattern'))
      : {
        kick: Array(16).fill(false),
        snare: Array(16).fill(false),
        chh: Array(16).fill(false),
        ohh: Array(16).fill(false),
        perc: Array(16).fill(false),
      });

  useEffect(() => {
    //* send the repeat function to the transport
    // passUpLoop(Tone.Transport.scheduleRepeat(repeat, '16n'), 'drums');
    const repEvent = new Tone.ToneEvent((time) => repeat(time));
    repEvent.loop = true;
    repEvent.loopEnd = '16n';
    passUpLoop(repEvent, 'drums');

    socket.on('pattern-change', (note) => {
      changePattern(note);
      buttonToggleActive(note);
    });

    return () => socket.disconnect()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function buttonToggleActive (note) {
    // const thisNote = document.querySelector(`.step${note.stepNum}.${note.name}`);
    const thisNote = document.querySelector(`.step${note.stepNum}.${note.name}.circle`);
    thisNote.classList.toggle('active');
    thisNote.classList.toggle('inactive');
  }

  function handleNoteClick (note) {
    socket.emit('pattern-change', note);
    buttonToggleActive(note);
    changePattern(note);
  }

  function changePattern (note) {
    setPattern((pat) => {
      //! Mutates the state but avoids re-render
      pat[note.name][note.stepNum] = !pat[note.name][note.stepNum];

      localStorage.setItem('droom-drums-pattern', JSON.stringify(pat));
      console.log('Drum pattern:', pattern)
      return pat;
    })

    // setPattern((pat) => {
    //   //? creating new state, triggering re-render
    //   const newPat = { ...pat };
    //   newPat[note.name][note.stepNum] = !newPat[note.name][note.stepNum];
    //   return newPat;
    // })
  }

  function repeat (time) {
    const count = getSixteenths();
    for (const [note, drum] of notesEntries) {
      if (pattern[drum][count]) {
        sampler.triggerAttackRelease(note, '16n', time);
      }
    }
    //* Adds the triggered class to all active buttons in the current step
    //* and removes it from those in the previous step
    Tone.Draw.schedule(() => {
      for (let i = 0; i < notesEntries.length; i++) {
        let current = document.querySelector(`.${notesEntries[i][1]}.step${count}.active`);
        if (current) {
          current.classList.add('triggered');
          if (current) {
            current.classList.add('triggered');
            setTimeout(() => {
              current.classList.remove('triggered');
            }, 100)
          }
        }
      }
    }, '+0.02') //! Delay for synching animations (default: time)
  }

  function setBpm (val) {
    Tone.Transport.bpm.value = val;
  }

  console.log('RERENDERED');

  function checkRerender () {
    console.log('RERENDERED');
  }

  function renderSteps () {
    console.log('RENDERING STEPS');
    const arr = [];
    for (let i = 0; i < 16; i++) {
      arr.push(<Step
        pattern={pattern}
        handleNoteClick={handleNoteClick}
        stepNum={i} shape="circle"
        noteNames={names}
        key={v4()} />);
    }
    return arr;
  }

  //! PUT INTO HELPER FUNCTIONS!!
  function getSixteenths () {
    const pos = Tone.Transport.position;
    const sixteenths = parseInt(pos.split(':')[2], 10);
    const quarters = parseFloat(pos.split(':')[1], 10);

    return sixteenths + quarters * 4;
  }

  return (
    <div className="drums-container">
      <div className="drumpad-container">
        <div className="drumpad-wrapper">
          {renderSteps()}
        </div>
        <input type="button" id="playPause" onMouseDown={() => {
          playPause('drums');
        }} value="droom"></input>
        <div className="drums-controls">
          <div className="slider-wrapper">
            <VSlider handleChange={setBpm} className="slider" />
          </div>
        </div>
      </div>


      {checkRerender()}
    </div>
  )
}