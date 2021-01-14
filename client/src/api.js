import openSocket from 'socket.io-client';
const socket = process.env.NODE_ENV === 'production' ? openSocket() : openSocket('localhost:3100');


export { socket };