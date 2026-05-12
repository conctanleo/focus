import { Router, Response } from 'express'
import { prisma } from '../db'
import { authMiddleware, AuthRequest } from '../middleware/auth'

const router = Router()
router.use(authMiddleware)

// GET /api/schedule-notes?date=2026-05-12 (day) or ?date=2026-05 (month)
router.get('/', async (req: AuthRequest, res: Response) => {
  try {
    const { date } = req.query
    if (!date) return res.status(400).json({ error: 'date required' })
    const note = await prisma.scheduleNote.findFirst({
      where: { userId: req.userId, date: date as string },
    })
    res.json({ note })
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch note' })
  }
})

// POST /api/schedule-notes (upsert)
router.post('/', async (req: AuthRequest, res: Response) => {
  try {
    const { date, noteType, content } = req.body
    if (!date) return res.status(400).json({ error: 'date required' })
    const existing = await prisma.scheduleNote.findFirst({
      where: { userId: req.userId, date, noteType: noteType || 'day' },
    })
    let note
    if (existing) {
      note = await prisma.scheduleNote.update({ where: { id: existing.id }, data: { content } })
    } else {
      note = await prisma.scheduleNote.create({
        data: { userId: req.userId!, date, noteType: noteType || 'day', content },
      })
    }
    res.json({ note })
  } catch (err) {
    res.status(500).json({ error: 'Failed to save note' })
  }
})

export default router
