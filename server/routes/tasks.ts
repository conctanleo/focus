import { Router, Response } from 'express'
import { prisma } from '../db'
import { authMiddleware, AuthRequest } from '../middleware/auth'

const router = Router()
router.use(authMiddleware)

// GET /api/tasks?date=2026-05-12
router.get('/', async (req: AuthRequest, res: Response) => {
  try {
    const { date, start, end } = req.query
    const where: any = { userId: req.userId }

    if (date) {
      where.taskDate = date as string
    } else if (start && end) {
      where.taskDate = { gte: start as string, lte: end as string }
    }

    const tasks = await prisma.task.findMany({
      where,
      orderBy: [{ scheduledStartAt: { sort: 'asc', nulls: 'last' } }, { createdAt: 'desc' }],
    })
    res.json({ tasks })
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch tasks' })
  }
})

// POST /api/tasks
router.post('/', async (req: AuthRequest, res: Response) => {
  try {
    const { title, description, taskDate, scheduledStartAt, scheduledEndAt } = req.body
    if (!title || !taskDate) {
      return res.status(400).json({ error: 'Title and taskDate required' })
    }
    const task = await prisma.task.create({
      data: {
        userId: req.userId!,
        title,
        description: description || null,
        taskDate,
        scheduledStartAt: scheduledStartAt ? new Date(scheduledStartAt) : null,
        scheduledEndAt: scheduledEndAt ? new Date(scheduledEndAt) : null,
      },
    })
    res.json({ task })
  } catch (err) {
    res.status(500).json({ error: 'Failed to create task' })
  }
})

// PATCH /api/tasks/:id
router.patch('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const task = await prisma.task.findUnique({ where: { id: req.params.id } })
    if (!task || task.userId !== req.userId) {
      return res.status(404).json({ error: 'Task not found' })
    }
    const updated = await prisma.task.update({
      where: { id: req.params.id },
      data: req.body,
    })
    res.json({ task: updated })
  } catch (err) {
    res.status(500).json({ error: 'Failed to update task' })
  }
})

// DELETE /api/tasks/:id
router.delete('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const task = await prisma.task.findUnique({ where: { id: req.params.id } })
    if (!task || task.userId !== req.userId) {
      return res.status(404).json({ error: 'Task not found' })
    }
    await prisma.task.delete({ where: { id: req.params.id } })
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete task' })
  }
})

// POST /api/tasks/:id/pomodoro/start
router.post('/:id/pomodoro/start', async (req: AuthRequest, res: Response) => {
  try {
    const task = await prisma.task.findUnique({ where: { id: req.params.id } })
    if (!task || task.userId !== req.userId) {
      return res.status(404).json({ error: 'Task not found' })
    }
    const updated = await prisma.task.update({
      where: { id: req.params.id },
      data: { pomodoroStatus: 'running' },
    })
    res.json({ task: updated })
  } catch (err) {
    res.status(500).json({ error: 'Failed to start pomodoro' })
  }
})

// POST /api/tasks/:id/pomodoro/pause
router.post('/:id/pomodoro/pause', async (req: AuthRequest, res: Response) => {
  try {
    const task = await prisma.task.findUnique({ where: { id: req.params.id } })
    if (!task || task.userId !== req.userId) {
      return res.status(404).json({ error: 'Task not found' })
    }
    const updated = await prisma.task.update({
      where: { id: req.params.id },
      data: { pomodoroStatus: 'paused' },
    })
    res.json({ task: updated })
  } catch (err) {
    res.status(500).json({ error: 'Failed to pause pomodoro' })
  }
})

// POST /api/tasks/:id/pomodoro/complete
router.post('/:id/pomodoro/complete', async (req: AuthRequest, res: Response) => {
  try {
    const task = await prisma.task.findUnique({ where: { id: req.params.id } })
    if (!task || task.userId !== req.userId) {
      return res.status(404).json({ error: 'Task not found' })
    }
    const updated = await prisma.task.update({
      where: { id: req.params.id },
      data: { pomodoroStatus: 'done', pomodoroCount: task.pomodoroCount + 1 },
    })
    res.json({ task: updated })
  } catch (err) {
    res.status(500).json({ error: 'Failed to complete pomodoro' })
  }
})

export default router
