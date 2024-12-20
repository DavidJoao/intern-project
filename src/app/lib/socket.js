import io from 'socket.io-client'

export const socket = io('localhost:3001', {
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
});