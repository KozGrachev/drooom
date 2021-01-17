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


// const leadSynth = new Tone.PolySynth().toDestination();
// leadSynth.volume.value = -15;
let leadNumSteps = 32;
let startTime = 0;

// leadSynth.volume.value = -5;


const loops = {};
let playing = {};

//! Refactor to have an object for each instrument that holds all its porperties

const synths = {
  lead: new Tone.PolySynth().toDestination(),
  bass: new Tone.PolySynth().toDestination(),
}
synths.lead.volume.value = -15;
synths.bass.volume.value = -5;

const synthPatterns = {
  lead: [initializePattern('lead')],
  bass: [initializePattern('bass')]
};

const playingPatterns = {
  lead: 0,
  bass: 0
}
const visiblePatterns = {
  lead: 0,
  bass: 0
}

function initializePattern (name) {
  return localStorage.getItem(`droom-${name}-pattern0`)
    ? JSON.parse(localStorage.getItem(`droom-${name}-pattern0`))
    : createEmptyPattern()
}

function createEmptyPattern () {
  return Array.from({ length: leadNumSteps }, Object);
}

const leadFirstOctave = 2;
const leadNumOctaves = 4;

const bassFirstOctave = 1;
const bassNumOctaves = 3;


const scales = {
  lead: {},
  bass: {},
}

Scale.rangeOf('C major')('C3', 'C6').forEach((note, i) => {
  scales.lead[noteIDs[i]] = note;
});
Scale.rangeOf('C major')('C1', 'C4').forEach((note, i) => {
  scales.bass[noteIDs[i]] = note;
});

//! check this and use it to replace the above scales assignment
// const scales = {
//   lead: localStorage.getItem('droom-lead-scale')
//     || Scale.rangeOf('C major')('C3', 'C6').reduce((acc, note, i) => {
//       return { ...acc, [noteIDs[i]]: note }
//     }),
//   bass: localStorage.getItem('droom-bass-scale')
//     || Scale.rangeOf('C major')('C2', 'C5').reduce((acc, note, i) => {
//       return { ...acc, [noteIDs[i]]: note }
//     }),
// }



loops.lead = createLoop('lead');
loops.bass = createLoop('bass');


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

// const repEvent = new Tone.ToneEvent((time) => repeatDrums(time));
// repEvent.loop = true;
// repEvent.loopEnd = '16n';
// loops.drums = repEvent; //addLoop(repEvent, 'drums');
loops.drums = createLoop('drums');


Tone.Transport.bpm.value = 120;
Tone.Transport.swing = 0.15;
Tone.Transport.swingSubdivision = '16n';










//*---- FROM APP.JS -----------------------------------------//
//*----------------------------------------------------------//


async function playPause (name) {

  Tone.start();
  if (playing[name] && Tone.Transport.state === 'started') {
    for (const ev in playing) {
      if (ev !== name && playing[ev]) {
        // console.log(`CASE #2: Transport and This event was 'started' and was not the only one. Stopping event ${name}`);
        loops[name].stop();//stopLoop(name);
        playing[name] = false;
        return;
      }
    }
    // console.log(`CASE #1: Transport was 'started' and no other loops were running. Stopping event ${name} and stopping and cancelling transport`);
    loops[name].stop(); //stopLoop(name);
    playing[name] = false;
    Tone.Transport.stop();
    Tone.Transport.cancel();
  } else if (!playing[name] && Tone.Transport.state === 'started') {
    const nextHalfBar = Tone.Time('@2n').quantize('2n'); // .Transport.nextSubdivision('2n'); // .quantize('2n'); // - last;
    loops[name].start(nextHalfBar - startTime); // startLoop(name, nextHalfBar - startTime);
    playing[name] = true;
    // console.log(`CASE #3: Did not have the event but transport was playing. Adding the event ${name} id:${loops[name]}`);
  } else if (!playing[name] && Tone.Transport.state === 'stopped') {
    // setStartTime(Tone.Time(Tone.now()).quantize('2n')); //! sets new time relative to when the transport is started
    startTime = Tone.Time(Tone.now()).quantize('2n');
    // console.log('CASE #4: this event was not in the array and the transport was stopped. Starting transport and adding event');
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

function handlePatternAction (name, index, action) {
  switch (action) {
    case 'activate':
      playingPatterns[name] = index;
      break;
    case 'duplicate':
      synthPatterns[name].splice(index, 0, [...synthPatterns[name][index]]);
      break;
    case 'clear':
      clearPattern(name, index);
      break;
    case 'delete':
      synthPatterns[name].splice(index,1);
      break;

    default:
      break;
  }
}

function setNewScale (name, newScale) {
  const thisScale = {};
  newScale.forEach((note, i) => {
    thisScale[noteIDs[i]] = note;
  });

  scales[name] = thisScale;
  document.querySelectorAll(`.${name} .step-1`).forEach((el, i) => {
    el.setAttribute('value', newScale[newScale.length - i - 1])
  });
}

function createLoop (name) {
  const repEvent = new Tone.ToneEvent((time) => {
    return name === 'drums' ? repeatDrums(time) : repeatSynth(time, name);
  });
  repEvent.loop = true;
  repEvent.loopEnd = '16n';
  return repEvent;
}

//! EXPORT THIS AND USE TO ASSIGN CURRENTLY PLAYING PATTERN TO leadPattern and bassPattern
//! repeat() function should always use the currentLeadPattern and currentBassPattern
function displayPattern (name, index) {
  console.log('Selecting Pattern ', index, ' in ', name, '-----> ', synthPatterns[name][index])
  const prevVisiblePattern = visiblePatterns[name];
  visiblePatterns[name] = index;

  //* deactivate the last pattern's notes
  deactivateAllNotes(name, prevVisiblePattern);

  //* activate the new pattern's notes
  activateNotesInPattern(name, visiblePatterns[name]);
}

function deactivateAllNotes (name, index) {
  synthPatterns[name][index].forEach((step, i) => {
    for (const note in step) {
      document.querySelector(`.${name} .step${i}.${note}`).classList.remove('active');
    }
  })
}

function activateNotesInPattern (name, index) {
  synthPatterns[name][index].forEach((step, i) => {
    for (const note in step) {
      document.querySelector(`.${name} .step${i}.${note}`).classList.add('active');
    }
  })
}

function clearPattern (name, index) {
  deactivateAllNotes(name, index);
  synthPatterns[name][index] = createEmptyPattern();
}

function changeSynthPattern (note, name, index) {

  // if (!synthPatterns[name][index]) {
  //   //* check if this pattern exists in case a socket.io event says to change
  //   //* pattern before it is created on a guest computer. Should not be necessary
  //   //* when the whole session state is sent to guest on joining session
  //   for (let i = 0; i < index + 1; i++) {
  //     if (!synthPatterns[name][i]) {
  //       synthPatterns[name][i] = createEmptyPattern();
  //     }
  //   }
  // }

  const thisPattern = synthPatterns[name][index];

  if (!thisPattern[note.stepNum].hasOwnProperty(note.noteID)) {
    thisPattern[note.stepNum][note.noteID] = note;
  } else if (thisPattern[note.stepNum].hasOwnProperty(note.noteID) || !note.active) {
    delete thisPattern[note.stepNum][note.noteID];
  }
  localStorage.setItem(`droom-${name}-pattern${index}`, JSON.stringify(thisPattern));

}

function repeatSynth (time, name) {
  const count = getSixteenths(leadNumSteps);
  for (let note in synthPatterns[name][playingPatterns[name]][count]) {
    let thisNoteName = scales[name][note];// leadPattern[count][note].name;
    if (Note.pitchClass(thisNoteName) === 'Cb') {
      thisNoteName = Note.transpose(thisNoteName, '8P');
    }

    playSynthNote(time, thisNoteName, name);
  };
  //* Adds the triggered class to all active buttons in the current step
  //* and removes it from those in the previous step
  Tone.Draw.schedule(() => {

    for (const note in synthPatterns[name][playingPatterns[name]][count]) {
      const pianoRollFeedback = document.querySelector(`.${name} .${note}.step-1`)
      const currentPlayingNote = document.querySelector(`.${name} .${note}.step${count}`)
      console.log('TRYING TO SELECT ', `.${name} .${note}.step${count}`, document.querySelector(`.${name} .${note}.step${count}`));
      addTempClass(pianoRollFeedback);
      addTempClass(currentPlayingNote);
    }
  }, time);
}

function playSynthNote (time, note, name) {
  synths[name].triggerAttackRelease(`${Scale.scaleNotes([note]) === 'Cb'
    ? Note.transpose(note, '8P')
    : note
    }`, '16n', time + 0.03);
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
  playPause, bassNumOctaves,
  bassFirstOctave,
  scales, synths, setNewScale,
  repeatSynth, setLeadNumSteps,
  changeSynthPattern, synthPatterns,
  playingPatterns, visiblePatterns, displayPattern,
  createEmptyPattern, handlePatternAction,
  changeDrumPattern, drumsPattern,
  drumNames, playing
};