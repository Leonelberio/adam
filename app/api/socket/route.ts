// app/api/socket/route.ts
import { Server } from 'socket.io'
import { NextApiResponseServerIO } from '@/types/next'
import type { Server as HTTPServer } from 'http'
import type { Socket as NetSocket } from 'net'
import { NextResponse } from 'next/server'

interface SocketServer extends HTTPServer {
  io?: Server | undefined
}

interface SocketWithIO extends NetSocket {
  server: SocketServer
}

interface NextApiResponseWithSocket extends NextApiResponseServerIO {
  socket: SocketWithIO
}

const socketHandler = async (req: Request, res: NextApiResponseWithSocket) => {
  if (!res.socket.server.io) {
    const io = new Server(res.socket.server)
    res.socket.server.io = io

    io.on('connection', (socket) => {
      console.log('Client connected')

      socket.on('update-card', (data) => {
        // Broadcast the update to all other clients
        socket.broadcast.emit('card-updated', data)
      })

      socket.on('disconnect', () => {
        console.log('Client disconnected')
      })
    })
  }

  return NextResponse.json({ message: 'Socket is running' })
}

export { socketHandler as GET, socketHandler as POST }