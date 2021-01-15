import * as Tone from 'tone';
import { Scale, Note } from '@tonaljs/tonal';
import { noteIDs } from '../helpers';


// import kick from '../assets/audio/808/kick.mp3';
// import snare from '../assets/audio/808/snare.mp3';
// import ohh from '../assets/audio/808/ohh.mp3';
// import chh from '../assets/audio/808/chh.mp3';
// import perc from '../assets/audio/808/clap.mp3';
import kick from '../assets/audio/909/kick.mp3';
import snare from '../assets/audio/909/snare.mp3';
import ohh from '../assets/audio/909/ohh.mp3';
import chh from '../assets/audio/909/chh.mp3';
import perc from '../assets/audio/909/clap.mp3';


const leadSynth = new Tone.PolySynth().toDestination();
leadSynth.volume.value = -15;
let leadNumSteps = 32;
let startTime = 0;


const loops = {};
let playing = {};
const leadPattern = localStorage.getItem('droom-lead-pattern')
  ? JSON.parse(localStorage.getItem('droom-lead-pattern'))
  : Array.from({ length: leadNumSteps }, Object)


let scale = {}
Scale.rangeOf('C major')('C2', 'C6').forEach((note, i) => {
  scale[noteIDs[i]] = note;
});

loops.lead = createLoop();


const drumsPattern = localStorage.getItem('droom-drums-pattern')
  ? JSON.parse(localStorage.getItem('droom-drums-pattern'))
  : {
    kick: Array(16).fill(false),
    snare: Array(16).fill(false),
    chh: Array(16).fill(false),
    ohh: Array(16).fill(false),
    perc: Array(16).fill(false),
  };

const notes = { 'A1': kick, 'B1': snare, 'C1': perc, 'D1': chh, 'E1': ohh };
const drumNoteNamePairs = { 'A1': 'kick', 'B1': 'snare', 'C1': 'perc', 'D1': 'chh', 'E1': 'ohh' }; //! send to variables
const drumNames = Object.values(drumNoteNamePairs);
const drumNoteNames = Object.entries(drumNoteNamePairs);
const sampler = new Tone.Sampler(notes).toDestination();
sampler.volume.value = -5;

const repEvent = new Tone.ToneEvent((time) => repeatDrums(time));
repEvent.loop = true;
repEvent.loopEnd = '16n';
loops.drums = repEvent; //addLoop(repEvent, 'drums');



Tone.Transport.bpm.value = 120;
Tone.Transport.swing = 0.15;
Tone.Transport.swingSubdivision = '16n';










//*---- FROM APP.JS -----------------------------------------//
//*----------------------------------------------------------//


async function playPause (name) {

  console.log('PLAY/PAUSE', name, loops[name], loops);
  Tone.start();
  if (playing[name] && Tone.Transport.state === 'started') {
    for (const ev in playing) {
      if (ev !== name && playing[ev]) {
        console.log(`CASE #2: Transport and This event was 'started' and was not the only one. Stopping event ${name}`);
        loops[name].stop();//stopLoop(name);
        playing[name] = false;
        return;
      }
    }
    console.log(`CASE #1: Transport was 'started' and no other loops were running. Stopping event ${name} and stopping and cancelling transport`);
    loops[name].stop(); //stopLoop(name);
    playing[name] = false;
    Tone.Transport.stop();
    Tone.Transport.cancel();
  } else if (!playing[name] && Tone.Transport.state === 'started') {
    const nextHalfBar = Tone.Time('@2n').quantize('2n'); // .Transport.nextSubdivision('2n'); // .quantize('2n'); // - last;
    loops[name].start(nextHalfBar - startTime); // startLoop(name, nextHalfBar - startTime);
    playing[name] = true;
    console.log(`CASE #3: Did not have the event but transport was playing. Adding the event ${name} id:${loops[name]}`);
  } else if (!playing[name] && Tone.Transport.state === 'stopped') {
    // setStartTime(Tone.Time(Tone.now()).quantize('2n')); //! sets new time relative to when the transport is started
    startTime = Tone.Time(Tone.now()).quantize('2n');
    console.log('CASE #4: this event was not in the array and the transport was stopped. Starting transport and adding event');
    Tone.Transport.start(Tone.now())//'+0.1');
    loops[name].start();// startLoop(name);
    playing[name] = true;

  } else {
    console.error('Unexpected condition! Check the start/stop if statements');
    console.error('playing[name]:', name, playing[name])
    // console.error('loops[name]:', name, loops[name].state)
    console.error('Transport.state:', Tone.Transport.state)
  }
}

//*----------------------------------------------------------//
//*---------------------------------------- FROM APP.JS -----//








//*---- FROM SYNTH.JS ----------------------------------------//
//*-----------------------------------------------------------//
function setNewScale (newScale) {
  const thisScale = {};
  newScale.forEach((note, i) => {
    thisScale[noteIDs[i]] = note;
  });
  scale = thisScale;
  console.log('thisScale', thisScale);

  document.querySelectorAll('.step-1').forEach((el, i) => {
    el.setAttribute('value', newScale[i])
  });
}

function createLoop (name) {
  console.log('ADDING LOOP FOR THE VERY FIRST TIME');
  const repEvent = new Tone.ToneEvent((time) => {
    return name === 'drums'
      ? repeatDrums(time)
      : repeatSynth(time)
  });
  repEvent.loop = true;
  repEvent.loopEnd = '16n';
  return repEvent;
}

function changeLeadPattern (note) {

  if (!leadPattern[note.stepNum].hasOwnProperty(note.noteID)) {
    console.log('adding note:', note);
    leadPattern[note.stepNum][note.noteID] = note;
  } else if (leadPattern[note.stepNum].hasOwnProperty(note.noteID) || !note.active) {
    console.log('DELETING note:', note);
    delete leadPattern[note.stepNum][note.noteID];
  }
  localStorage.setItem('droom-lead-pattern', JSON.stringify(leadPattern));
  return leadPattern;
}

function repeatSynth (time) {
  const count = getSixteenths(leadNumSteps);
  for (let note in leadPattern[count]) {
    let thisNoteName = scale[note];// leadPattern[count][note].name;
    if (Note.pitchClass(thisNoteName) === 'Cb') {
      thisNoteName = Note.transpose(thisNoteName, '8P');
    }
    leadSynth.triggerAttackRelease(`${Scale.scaleNotes([thisNoteName]) === 'Cb'
      ? Note.transpose(thisNoteName, '8P')
      : thisNoteName
      }`, '16n', time + 0.03);
  };
  //* Adds the triggered class to all active buttons in the current step
  //* and removes it from those in the previous step
  Tone.Draw.schedule(() => {
    for (const note in leadPattern[count]) {
      const pianoRollFeedback = document.querySelector(`.${note}.step-1`)
      const currentPlayingNote = document.querySelector(`.${note}.step${count}`)
      addTempClass(pianoRollFeedback);
      addTempClass(currentPlayingNote);
    }
  }, time);
}


function addTempClass (element) {
  element.classList.add('triggered');
  setTimeout(() => {
    element.classList.remove('triggered');
  }, 100)
}

function setLeadNumSteps (num) {
  leadNumSteps = num;
}

function getSixteenths (num) {
  const pos = Tone.Transport.position;
  const sixteenths = parseInt(pos.split(':')[2], 10);
  const quarters = parseFloat(pos.split(':')[1], 10);
  const bars = parseFloat(pos.split(':')[0], 10);
  return (sixteenths + quarters * 4 + bars * 16) % num;
}

//*-----------------------------------------------------------//
//*-------------------------------------- FROM SYNTH.JS ------//








//*---- FROM DRUMS.JS ---------------------------------------//
//*----------------------------------------------------------//

function changeDrumPattern (note) {
  drumsPattern[note.name][note.stepNum] = !drumsPattern[note.name][note.stepNum];

  localStorage.setItem('droom-drums-pattern', JSON.stringify(drumsPattern));
  console.log('Drum pattern:', drumsPattern)
  return drumsPattern;
}

function repeatDrums (time) {
  const count = getSixteenths(16);
  for (const [note, drum] of drumNoteNames) {
    if (drumsPattern[drum][count]) {
      sampler.triggerAttackRelease(note, '16n', time);
    }
  }
  //* Adds the triggered class to all active buttons in the current step
  //* and removes it from those in the previous step
  Tone.Draw.schedule(() => {
    for (let i = 0; i < drumNoteNames.length; i++) {
      let current = document.querySelector(`.${drumNoteNames[i][1]}.step${count}.active`);
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


//*----------------------------------------------------------//
//*------------------------------------- FROM DRUMS.JS ------//









//*---- FROM DRUMS.JS ---------------------------------------//
//*----------------------------------------------------------//






//*----------------------------------------------------------//
//*------------------------------------- FROM DRUMS.JS ------//

export {
  playPause, createLoop,
  scale, leadSynth, setNewScale,
  repeatSynth, setLeadNumSteps,
  changeLeadPattern, leadPattern,
  changeDrumPattern, drumsPattern,
  drumNames, playing
};