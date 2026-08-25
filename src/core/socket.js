import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'https://dashboard.servidor.blog';

export const socket = io(SOCKET_URL, {
  autoConnect: true,
  reconnection: true,
  reconnectionAttempts: 10,
  reconnectionDelay: 2000,
  transports: ['websocket', 'polling'],
});

socket.on('connect', () => {
  console.log('WebSocket conectado exitosamente al servidor real en', SOCKET_URL);
});

socket.on('disconnect', () => {
  console.log('WebSocket desconectado del servidor');
});
