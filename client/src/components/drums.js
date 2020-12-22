import React, { useState, useEffect } from 'react';
import { Step } from './Step';
import { VSlider } from "./VSlider";
import '../style/drums.scss';
import * as Tone from 'tone';
import { v4 } from 'uuid';
import kick from '../assets/kick.mp3';
import snare from '../assets/snare.mp3';
import ohh from '../assets/hho.mp3';
import chh from '../assets/hhc.mp3';
import perc from '../assets/clap.mp3';
import openSocket from 'socket.io-client';
const socket = openSocket();
const notes = { 'A1': kick, 'B1': snare, 'C1': perc, 'D1': chh, 'E1': ohh };
const noteNames = { 'A1': 'kick', 'B1': 'snare', 'C1': 'perc', 'D1': 'chh', 'E1': 'ohh' };
const numberString = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen'];
const notesEntries = Object.entries(noteNames);
const sampler = new Tone.Sampler(notes).toDestination();


export function Drums ({ playPause, passUpLoop }) {

  const [pattern, setPattern] = useState({
    kick: Array(16).fill(false),
    snare: Array(16).fill(false),
    chh: Array(16).fill(false),
    ohh: Array(16).fill(false),
    perc: Array(16).fill(false),
  });

  useEffect(() => {
    //* send the repeat function to the transport
    passUpLoop(repeat);
    socket.on('pattern-change', (note) => {
      changePattern(note);
      buttonToggleActive(note);
    })

    return () => socket.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function buttonToggleActive (note) {
    const thisNote = document.querySelector(`.${numberString[note.stepNum]}.${note.name}`);
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
      //! Do not mutate state -- rewrite
      pat[note.name][note.stepNum] = !pat[note.name][note.stepNum];
      return pat;
    })

    // setPattern((pat) => {
    //   //? creating new state, triggering re-render
    //   const newPat = { ...pat };
    //   newPat[note.name][note.stepNum] = !newPat[note.name][note.stepNum];
    //   return newPat;
    // })
  }

  function repeat (time, count) {
    for (const [note, drum] of notesEntries) {
      if (pattern[drum][count]) {
        sampler.triggerAttackRelease(note, '16n', time);
      }
    }



    //* Adds the triggered class to all active buttons in the current step
    //* and removes it from those in the previous step

    for (let i = 0; i < notesEntries.length; i++) {
      let prevStep = count === 0 ? 15 : count - 1;
      let current = document.querySelector(`.${notesEntries[i][1]}.${numberString[count]}.active`);
      let previous = document.querySelector(`.${notesEntries[i][1]}.${numberString[prevStep]}.active`);

      if (current) current.classList.add('triggered');
      if (previous) previous.classList.remove('triggered');
    }
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
      arr.push(<Step handleNoteClick={handleNoteClick} stepNum={i} key={v4()} >  </Step>);
    }
    return arr;
  }

  return (
    <div className="drums-container">
      <div className="drumpad-container">
        <div className="drumpad-wrapper">
          {renderSteps()}
        </div>
        <input type="button" id="playPause" onClick={() => playPause()} value="droom"></input>
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