import * as Tone from 'tone';
import { Scale, Note } from '@tonaljs/tonal';
import { noteIDs } from '../helpers';

const leadSynth = new Tone.PolySynth().toDestination();
let leadNumSteps = 32;
let startTime = 0;
const loops = { keys: [], drums: [] };
let playing = {};
const leadPattern = localStorage.getItem('droom-keys-pattern')
  ? JSON.parse(localStorage.getItem('droom-keys-pattern'))
  : Array.from({ length: leadNumSteps }, Object)

let scale = {}
Scale.rangeOf('C major')('C2', 'C6').forEach((note, i) => {
  scale[noteIDs[i]] = note;
});

leadSynth.volume.value = -15;
Tone.Transport.bpm.value = 120;
Tone.Transport.swing = 0.15;
Tone.Transport.swingSubdivision = '16n';


//*---- FROM APP.JS ----//



function startLoop (name, time) {
  for (let i = loops[name].length - 1; i > 0; i--) {
    loops[name][i].stop();
    loops[name][i].dispose();
  }
  loops[name] = loops[name].slice(0, 1);
  loops[name][0].start(time);
}

function stopLoop (name) {
  for (let i = loops[name].length - 1; i > 0; i--) {
    loops[name][i].stop();
    loops[name][i].dispose();
  }
  loops[name] = loops[name].slice(0, 1);
  loops[name][0].stop();
}

async function playPause (name) {

  console.log('PLAY/PAUSE', loops);
  Tone.start();
  if (playing[name] && Tone.Transport.state === 'started') {
    for (const ev in playing) {
      if (ev !== name && playing[ev]) {
        console.log(`CASE #2: Transport and This event was 'started' and was not the only one. Stopping event ${name}`);

        stopLoop(name);
        // loops[name].forEach(el => {
        //   el.stop();
        //   // el.dispose()
        // });
        playing[name] = false;
        return;
      }
    }
    console.log(`CASE #1: Transport was 'started' and no other loops were running. Stopping event ${name} and stopping and cancelling transport`);
    stopLoop(name);
    playing[name] = false;
    Tone.Transport.stop();
    Tone.Transport.cancel();
  } else if (!playing[name] && Tone.Transport.state === 'started') {
    const nextHalfBar = Tone.Time('@2n').quantize('2n'); // .Transport.nextSubdivision('2n'); // .quantize('2n'); // - last;
    startLoop(name, nextHalfBar - startTime);
    playing[name] = true;
    console.log(`CASE #3: Did not have the event but transport was playing. Adding the event ${name} id:${loops[name]}`);
  } else if (!playing[name] && Tone.Transport.state === 'stopped') {
    // setStartTime(Tone.Time(Tone.now()).quantize('2n')); //! sets new time relative to when the transport is started
    startTime = Tone.Time(Tone.now()).quantize('2n');
    console.log('CASE #4: this event was not in the array and the transport was stopped. Starting transport and adding event');
    Tone.Transport.start(Tone.now())//'+0.1');
    startLoop(name);
    playing[name] = true;
  } else {
    console.error('Unexpected condition! Check the start/stop if statements');
    console.error('playing[name]:', name, playing[name])
    // console.error('loops[name]:', name, loops[name].state)
    console.error('Transport.state:', Tone.Transport.state)
  }
}

function addLoop (loop, name) {
  loops.loop = true;
  loops.loopEnd = '16n';
  loops[name].push(loop);
}




//*---- FROM LEAD.JS ----//

function setNewScale (newScale) {
  // setOldScale(newScale);
  const thisScale = {};
  newScale.forEach((note, i) => {
    thisScale[noteIDs[i]] = note;
  });
  scale = thisScale;
  // setScale(thisScale);
  console.log('thisScale', thisScale);
  // createAndPassUpLoop();
  const repEvent = new Tone.ToneEvent((time) => repeatLead(time));
  repEvent.loop = true;
  repEvent.loopEnd = '16n';
  addLoop(repEvent, 'keys');
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

function repeatLead (time) {
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

export {
  playPause, addLoop, scale,
  leadSynth, setNewScale,
  repeatLead, setLeadNumSteps,
  changeLeadPattern, leadPattern,
};