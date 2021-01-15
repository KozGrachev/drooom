import React, { useState } from 'react';
import * as Brain from '../tone/main';
import '../style/playButton.scss'

function PlayButton ({ instrument, shape }) {

  const [isPlaying, setIsPlaying] = useState(Brain.playing[instrument]);

  return (
    <div className={`play-button ${shape}`} onMouseDown={() => {
      Brain.playPause(instrument);
      setIsPlaying(Brain.playing[instrument]);
    }
    }>
      {
        shape === 'circle'
          ? Brain.playing[instrument]
            ? <svg className="pause-icon" xmlns="http://www.w3.org/2000/svg" fillRule="evenodd" clipRule="evenodd"><path d="M10 24h-6v-24h6v24zm10-24h-6v24h6v-24z" /></svg>
            : <svg className="play-icon" xmlns="http://www.w3.org/2000/svg" fillRule="evenodd" clipRule="evenodd"><path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm-3 17v-10l9 5.146-9 4.854z" /></svg>

          : Brain.playing[instrument]
              ? <svg className="pause-icon" xmlns="http://www.w3.org/2000/svg" fillRule="evenodd" clipRule="evenodd"><path d="M10 24h-6v-24h6v24zm10 0h-6v-24h6v24zm-11-23h-4v22h4v-22zm10 0h-4v22h4v-22z" /></svg>
              : <svg className="play-icon" xmlns="http://www.w3.org/2000/svg" fillRule="evenodd" clipRule="evenodd"><path className="play-icon-path" d="M23 12l-22 12v-24l22 12zm-21 10.315l18.912-10.315-18.912-10.315v20.63z" /></svg>

      }

    </div>
  )
}

export default PlayButton
