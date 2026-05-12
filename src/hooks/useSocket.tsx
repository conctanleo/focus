import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { io, Socket } from 'socket.io-client'

interface SocketContextType {
  socket: Socket | null
  reminder: { taskId: string; title: string; scheduledStartAt: string } | null
  clearReminder: () => void
}

const SocketContext = createContext<SocketContextType>({ socket: null, reminder: null, clearReminder: () => {} })

export function SocketProvider({ children }: { children: ReactNode }) {
  const [socket, setSocket] = useState<Socket | null>(null)
  const [reminder, setReminder] = useState<{ taskId: string; title: string; scheduledStartAt: string } | null>(null)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) return

    const s = io('/', { auth: { token } })
    setSocket(s)

    s.on('pomodoro-reminder', (data) => {
      setReminder(data)
    })

    return () => { s.disconnect() }
  }, [])

  return (
    <SocketContext.Provider value={{ socket, reminder, clearReminder: () => setReminder(null) }}>
      {children}
    </SocketContext.Provider>
  )
}

export const useSocket = () => useContext(SocketContext)
