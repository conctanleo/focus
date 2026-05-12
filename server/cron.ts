import cron from 'node-cron'
import { prisma } from './db'

let io: any = null

export function setIO(serverIO: any) {
  io = serverIO
}

// Check every minute for tasks that should trigger pomodoro
export function startCron() {
  cron.schedule('* * * * *', async () => {
    if (!io) return
    try {
      const now = new Date()
      const tasks = await prisma.task.findMany({
        where: {
          scheduledStartAt: { lte: now },
          pomodoroStatus: 'idle',
          notifiedAt: null,
        },
        select: { id: true, title: true, scheduledStartAt: true, userId: true },
      })

      for (const task of tasks) {
        const sockets = await io.fetchSockets()
        for (const socket of sockets) {
          if (socket.data?.userId === task.userId) {
            socket.emit('pomodoro-reminder', {
              taskId: task.id,
              title: task.title,
              scheduledStartAt: task.scheduledStartAt?.toISOString(),
            })
          }
        }
      }
    } catch (err) {
      console.error('Cron scan error:', err)
    }
  })
}
