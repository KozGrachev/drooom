import * as Tone from 'tone';
import { Scale, Note } from '@tonaljs/tonal';
import { noteIDs } from '../helpers';
import * as demo from '../demos/demo5'



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

const instrumentState = {
  drums: {
    numSteps: 16,
    loop: createLoop('drums'),
    isPlaying: false,
    patterns: [demo.drums],
    //! scale: {put all the samples here}
  },
  lead: {
    numSteps: 32,
    loop: createLoop('lead'),
    isPlaying: false,
    patterns: [demo.lead1, demo.lead2, demo.lead3],
    playingPattern: 0,
    visiblePattern: 0,
    scale: {},
  },
  bass: {
    numSteps: 32,
    loop: createLoop('bass'),
    isPlaying: false,
    patterns: [demo.bass],
    playingPattern: 0,
    visiblePattern: 0,
    scale: {},
  }
}


// const leadSynth = new Tone.PolySynth().toDestination();
// leadSynth.volume.value = -15;
//! let leadNumSteps = 32;
let startTime = 0;

// leadSynth.volume.value = -5;


//! const loops = {};
//! let playing = {};

//! Refactor to have an object for each instrument that holds all its porperties

const synths = {
  lead: new Tone.PolySynth().toDestination(),
  bass: new Tone.PolySynth().toDestination(),
}
synths.lead.volume.value = -15;
synths.bass.volume.value = -5;

//! const synthPatterns = {
//   lead: [initializePattern('lead')],
//   bass: [initializePattern('bass')]
// };

//! const synthPatterns = {
//   lead: [demo.lead1, demo.lead2, demo.lead3],
//   bass: [demo.bass]
// }

//! const playingPatterns = {
//   lead: 0,
//   bass: 0
// }
// const visiblePatterns = {
//   lead: 0,
//   bass: 0
// }

function initializePattern (name) {
  return localStorage.getItem(`droom-${name}-pattern0`)
    ? JSON.parse(localStorage.getItem(`droom-${name}-pattern0`))
    : createEmptyPattern()
}

function createEmptyPattern () {
  return Array.from({ length: instrumentState.lead.numSteps }, Object);
}

const leadFirstOctave = 2;
const leadNumOctaves = 4;

const bassFirstOctave = 1;
const bassNumOctaves = 3;


//! const scales = {
//   lead: {},
//   bass: {},
// }

Scale.rangeOf('C major')('C3', 'C6').forEach((note, i) => {
  instrumentState.lead.scale[noteIDs[i]] = note;
});
Scale.rangeOf('C major')('C1', 'C4').forEach((note, i) => {
  instrumentState.bass.scale[noteIDs[i]] = note;
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



//! loops.lead = createLoop('lead');
//! loops.bass = createLoop('bass');


// const drumsPattern =  localStorage.getItem('droom-drums-pattern')
//   ? JSON.parse(localStorage.getItem('droom-drums-pattern'))
//   : {
//     kick: Array(16).fill(false),
//     snare: Array(16).fill(false),
//     chh: Array(16).fill(false),
//     ohh: Array(16).fill(false),
//     perc: Array(16).fill(false),
//   };

//! const drumsPattern = demo.drums;

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
//! loops.drums = createLoop('drums');


Tone.Transport.bpm.value = 120;
Tone.Transport.swing = 0.15;
Tone.Transport.swingSubdivision = '16n';










//*---- FROM APP.JS -----------------------------------------//
//*----------------------------------------------------------//


async function playPause (name) {

  Tone.start();
  if (instrumentState[name].isPlaying && Tone.Transport.state === 'started') {
    for (const inst in instrumentState) {
      if (inst !== name && instrumentState[inst].isPlaying) {
        instrumentState[name].loop.stop();//stopLoop(name);
        instrumentState[name].isPlaying = false;
        return;
      }
    }
    instrumentState[name].loop.stop(); //stopLoop(name);
    instrumentState[name].isPlaying = false;
    Tone.Transport.stop();
    Tone.Transport.cancel();
  } else if (!instrumentState[name].isPlaying && Tone.Transport.state === 'started') {
    const nextHalfBar = Tone.Time('@2n').quantize('2n'); // .Transport.nextSubdivision('2n'); // .quantize('2n'); // - last;
    instrumentState[name].loop.start(nextHalfBar - startTime); // startLoop(name, nextHalfBar - startTime);
    instrumentState[name].isPlaying = true;
  } else if (!instrumentState[name].isPlaying && Tone.Transport.state === 'stopped') {
    // setStartTime(Tone.Time(Tone.now()).quantize('2n')); //! sets new time relative to when the transport is started
    startTime = Tone.Time(Tone.now()).quantize('2n');
    Tone.Transport.start(Tone.now())//'+0.1');
    instrumentState[name].loop.start();// startLoop(name);
    instrumentState[name].isPlaying = true;

  } else {
  }
}

//*----------------------------------------------------------//
//*---------------------------------------- FROM APP.JS -----//








//*---- FROM SYNTH.JS ----------------------------------------//
//*-----------------------------------------------------------//

function handlePatternAction (name, index, action) {
  switch (action) {
    case 'activate':
      instrumentState[name].playingPattern = index;
      break;
    case 'duplicate':
      instrumentState[name].patterns.splice(index, 0, [...instrumentState[name].patterns[index]]);
      break;
    case 'clear':
      clearPattern(name, index);
      break;
    case 'delete':
      instrumentState[name].patterns.splice(index,1);
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

  instrumentState[name].scale = thisScale;
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
  const prevVisiblePattern = instrumentState[name].visiblePattern;
  instrumentState[name].visiblePattern = index;

  //* deactivate the last pattern's notes
  deactivateAllNotes(name, prevVisiblePattern);

  //* activate the new pattern's notes
  activateNotesInPattern(name, instrumentState[name].visiblePattern);
}

function deactivateAllNotes (name, index) {
  if (index < instrumentState[name].patterns.length) {
    instrumentState[name].patterns[index].forEach((step, i) => {
      for (const note in step) {
        document.querySelector(`.${name} .step${i}.${note}`).classList.remove('active');
      }
    })
  }
}

function activateNotesInPattern (name, index) {
  try {
    instrumentState[name].patterns[index].forEach((step, i) => { //!!! CAUSES ERROR WHEN DELETING 1ST PATTERN. MUST BE FIXED
      for (const note in step) {
        document.querySelector(`.${name} .step${i}.${note}`).classList.add('active');
      }
    })
  } catch (error) {
  }
}

function clearPattern (name, index) {
  deactivateAllNotes(name, index);
  instrumentState[name].patterns[index] = createEmptyPattern();
}

function changeSynthPattern (note, name, index) {

  // if (!instrumentState[name].patterns[index]) {
  //   //* check if this pattern exists in case a socket.io event says to change
  //   //* pattern before it is created on a guest computer. Should not be necessary
  //   //* when the whole session state is sent to guest on joining session
  //   for (let i = 0; i < index + 1; i++) {
  //     if (!instrumentState[name].patterns[i]) {
  //       instrumentState[name].patterns[i] = createEmptyPattern();
  //     }
  //   }
  // }

  const thisPattern = instrumentState[name].patterns[index];

  if (!thisPattern[note.stepNum].hasOwnProperty(note.noteID)) {
    thisPattern[note.stepNum][note.noteID] = note;
  } else if (thisPattern[note.stepNum].hasOwnProperty(note.noteID) || !note.active) {
    delete thisPattern[note.stepNum][note.noteID];
  }
  localStorage.setItem(`droom-${name}-pattern${index}`, JSON.stringify(thisPattern));

}

function repeatSynth (time, name) {
  const count = getSixteenths(instrumentState.lead.numSteps);
  try {
    for (let note in instrumentState[name].patterns[instrumentState[name].playingPattern][count]) {
      let thisNoteName = instrumentState[name].scale[note];// leadPattern[count][note].name;
      if (Note.pitchClass(thisNoteName) === 'Cb') {
        thisNoteName = Note.transpose(thisNoteName, '8P');
      }

      playSynthNote(time, thisNoteName, name);
    };
  } catch (error) {
  }
  //* Adds the triggered class to all active buttons in the current step
  //* and removes it from those in the previous step
  Tone.Draw.schedule(() => {

    for (const note in instrumentState[name].patterns[instrumentState[name].playingPattern][count]) {
      const pianoRollFeedback = document.querySelector(`.${name} .${note}.step-1`)
      const currentPlayingNote = document.querySelector(`.${name} .${note}.step${count}`)
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
  instrumentState.lead.numSteps = num;
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
  instrumentState.drums.patterns[0][note.name][note.stepNum] = !instrumentState.drums.patterns[0][note.name][note.stepNum];

  localStorage.setItem('droom-drums-pattern', JSON.stringify(instrumentState.drums.patterns[0]));
  return instrumentState.drums.patterns[0];
}

function repeatDrums (time) {
  const count = getSixteenths(16);
  for (const [note, drum] of drumNoteNames) {
    if (instrumentState.drums.patterns[0][drum][count]) {
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
  synths, setNewScale,
  repeatSynth, setLeadNumSteps,
  changeSynthPattern,
  displayPattern,
  deactivateAllNotes,
  createEmptyPattern, handlePatternAction,
  changeDrumPattern,
  drumNames, instrumentState// playing
};