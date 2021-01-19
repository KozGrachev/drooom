import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import { socket, SocketAPIContextProvider } from '../api';
import { Drums } from './Drums'
import { SessionLink } from './SessionLink'
import { Synth } from './Synth'




export default function Sandbox () {

  const { roomId } = useParams();

  useEffect(() => {
    socket.emit('join-room', 'SomeUser', roomId);

    // return socket.emit('leave-room', roomId);
  }, []);



  return (
    <div className="app-container">
      <SocketAPIContextProvider value={roomId}>
        <section className="instrument-wrapper lead">
          <Synth instrument="lead" buttonColor="yellow" sideBar="keysModesList" />
        </section>
        <section className="instrument-wrapper bass">
          <Synth instrument="bass" buttonColor="red" sideBar="" />
        </section>
        <section className="instrument-wrapper drums">
          <SessionLink />
          <Drums />
        </section>
      </SocketAPIContextProvider>
    </div>
  )
}
