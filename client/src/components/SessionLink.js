import { Button } from '@chakra-ui/react';
import React, { useContext, useRef, useState } from 'react'
import SocketAPIContext from '../api';
import '../style/sessionLink.scss'


export function SessionLink () {

  const [copySuccess, setCopySuccess] = useState('');
  const textAreaRef = useRef(null);
  const roomId = useContext(SocketAPIContext);

  function copyToClipboard () {
    textAreaRef.current.select();
    document.execCommand('copy');
    // e.target.focus();
    setCopySuccess('Copied!');
  };

  return (
    <div className="session-link-container">
      <Button className="session-link-btn" onClick={copyToClipboard} >
        Get session link
      </Button>
      {copySuccess}
      <form className="session-link">
        <textarea
          ref={textAreaRef}
          value={roomId}
          readOnly
        />
      </form>
    </div>
  )
}
