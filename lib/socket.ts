// lib/socket.ts
import { io } from 'socket.io-client'

// Singleton pattern for Socket.IO client
let socket: any

export const initSocket = () => {
  if (!socket) {
    socket = io({
      path: '/api/socket',
    })

    socket.on('connect', () => {
      console.log('Connected to Socket.IO server')
    })

    socket.on('connect_error', (err: Error) => {
      console.error('Socket connection error:', err)
    })
  }
  return socket
}

export const getSocket = () => {
  if (!socket) {
    return initSocket()
  }
  return socket
}