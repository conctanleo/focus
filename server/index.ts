import express from 'express'
import cors from 'cors'
import http from 'http'
import { Server } from 'socket.io'
import path from 'path'
import dotenv from 'dotenv'
import jwt from 'jsonwebtoken'
import authRoutes from './routes/auth'
import taskRoutes from './routes/tasks'
import scheduleNoteRoutes from './routes/scheduleNotes'
import memoRoutes from './routes/memos'
import { setIO, startCron } from './cron'

dotenv.config()

const app = express()
const server = http.createServer(app)

const isProduction = process.env.NODE_ENV === 'production'

const io = new Server(server, {
  cors: isProduction
    ? false
    : { origin: 'http://localhost:5173', methods: ['GET', 'POST'] },
})

if (!isProduction) {
  app.use(cors({ origin: 'http://localhost:5173' }))
}
app.use(express.json())

app.set('io', io)

app.use('/api/auth', authRoutes)
app.use('/api/tasks', taskRoutes)
app.use('/api/schedule-notes', scheduleNoteRoutes)
app.use('/api/memos', memoRoutes)

const JWT_SECRET = process.env.JWT_SECRET || 'focus-dev-secret'

// Socket.io auth middleware
io.use((socket, next) => {
  const token = socket.handshake.auth?.token
  if (!token) return next(new Error('Unauthorized'))
  try {
    const payload = jwt.verify(token, JWT_SECRET) as { userId: string }
    socket.data.userId = payload.userId
    next()
  } catch {
    next(new Error('Invalid token'))
  }
})

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id)
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id)
  })
})

setIO(io)
startCron()

if (isProduction) {
  const distPath = path.join(import.meta.dirname, '..', 'dist')
  app.use(express.static(distPath))
  app.get('/{*path}', (_req, res) => {
    res.sendFile(path.join(distPath, 'index.html'))
  })
}

const PORT = process.env.PORT || 3001
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

export { io }
