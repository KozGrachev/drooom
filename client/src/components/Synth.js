import React, { useEffect, useState } from 'react';
import { KeysModesList } from './KeysModesList'

import '../style/synth.scss';
import '../assets/svg/play.svg';
import PlayButton from './PlayButton';
import Sequencer from './Sequencer';

export function Synth ({buttonColor, sideBar, numOctaves, instrument}) {



  return (
    <div>
      <div className="container">
        <div className="top-panel">
          <PlayButton buttonColor={buttonColor} instrument={instrument} shape="grid" />
          <div className="controls">
            <div className="third-height tempo"></div>
            <div className="third-height tempo-nudge"></div>
            <div className="third-height swing"></div>
          </div>
        </div>
        <div className="main-panel" >
          <div className="side-panel_left">
            {sideBar === 'keysModesList' ? <KeysModesList buttonColor={buttonColor} /> : ''}
          </div>
          <Sequencer instrument={instrument} buttonColor={buttonColor} />
        </div>
      </div>
    </div>
  )
}