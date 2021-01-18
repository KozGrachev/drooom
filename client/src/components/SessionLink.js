import React, { useContext, useRef, useState } from 'react'
import SocketAPIContext from '../api';
import '../style/sessionLink.scss'


export function SessionLink () {

  const [copySuccess, setCopySuccess] = useState('');
  const textAreaRef = useRef(null);
  const sessionId = useContext(SocketAPIContext);

  function copyToClipboard () {
    textAreaRef.current.select();
    document.execCommand('copy');
    // e.target.focus();
    setCopySuccess('Copied!');
  };

  return (
    <div className="session-link-container">
      <input className="session-link-btn" type="button" value="Copy session link" onClick={copyToClipboard} />
      {copySuccess}
      <form className="session-link">
        <textarea
          ref={textAreaRef}
          value={sessionId}
        />
      </form>
    </div>
  )
}
