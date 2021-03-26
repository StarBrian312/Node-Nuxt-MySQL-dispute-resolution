

import socketIOClient from 'socket.io-client';
import sailsIOClient from 'sails.io.js';

export default function({env}, inject) {
  const io = sailsIOClient(socketIOClient);

  io.sails.url = env.apiUrl || 'http://localhost:1337';
  io.sails.transports = ['websocket'];
  io.sails.environment = env.nodeEnv;

  io.socket.on('disconnect', () => {
    io.socket._raw.io._reconnection = true;
  });

  inject('io', io);
}
