import React from 'react'
import openSocket from 'socket.io-client';

export const socket = process.env.NODE_ENV === 'production' ? openSocket() : openSocket('localhost:3100');

const SocketAPIContext = React.createContext({})
export const SocketAPIContextProvider = SocketAPIContext.Provider

export default SocketAPIContext;