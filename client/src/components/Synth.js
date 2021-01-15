import React, { useEffect, useState } from 'react';
import { KeysModesList } from './KeysModesList'

import '../style/synth.scss';
import '../assets/svg/play.svg';
import PlayButton from './PlayButton';
import Sequencer from './Sequencer';

export function Synth () {
  console.log('\n\n');



  return (
    <div>
      <div className="container">
        <div className="top-panel">
          <PlayButton instrument="keys" shape="grid" />
          <div className="controls">
            <div className="third-height tempo"></div>
            <div className="third-height tempo-nudge"></div>
            <div className="third-height swing"></div>
          </div>
        </div>
        <div className="main-panel" >
          <div className="side-panel_left">
            <KeysModesList />
          </div>
          <Sequencer />
        </div>
      </div>
    </div>
  )
}