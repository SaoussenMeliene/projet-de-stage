import { io } from 'socket.io-client';

let socket = null;

export function getSocket() {
  if (socket) return socket;
  const token = localStorage.getItem('token') || sessionStorage.getItem('token');
  socket = io('http://localhost:5000', {
    autoConnect: false,
    transports: ['websocket'],
    auth: { token },
  });
  return socket;
}

export function connectSocket() {
  const s = getSocket();
  if (!s.connected) s.connect();
  return s;
}

export function disconnectSocket() {
  if (socket && socket.connected) socket.disconnect();
}