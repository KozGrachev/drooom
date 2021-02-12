import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom';
import { socket, SocketAPIContextProvider } from '../api';
import { Drums } from './Drums'
import { SVGLogo } from './SVGLogo'
import { Synth } from './Synth'




export default function Sandbox () {

  const { roomId } = useParams();

  useEffect(() => {
    socket.emit('join-room', 'SomeUser', roomId);
  }, []);



  return (
    <div className="app-container">
      <SVGLogo />

      <SocketAPIContextProvider value={roomId}>
        <section className="instrument-wrapper lead">
          <Synth instrument="lead" buttonColor="yellow" sideBar="keysModesList" />
        </section>
        <section className="instrument-wrapper bass">
          <Synth instrument="bass" buttonColor="red" sideBar="" />
        </section>
        <section className="instrument-wrapper drums">
          <Drums />
        </section>
      </SocketAPIContextProvider>
    </div>
  )
}
