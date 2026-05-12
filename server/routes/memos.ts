import { Router, Response } from 'express'
import { prisma } from '../db'
import { authMiddleware, AuthRequest } from '../middleware/auth'

const router = Router()
router.use(authMiddleware)

// GET /api/memos?search=
router.get('/', async (req: AuthRequest, res: Response) => {
  try {
    const { search } = req.query
    const where: any = { userId: req.userId }
    if (search) {
      where.OR = [
        { title: { contains: search as string } },
        { content: { contains: search as string } },
      ]
    }
    const memos = await prisma.memo.findMany({
      where,
      orderBy: [{ pinned: 'desc' }, { updatedAt: 'desc' }],
    })
    res.json({ memos })
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch memos' })
  }
})

// POST /api/memos
router.post('/', async (req: AuthRequest, res: Response) => {
  try {
    const { title, content, color } = req.body
    if (!title) return res.status(400).json({ error: 'Title required' })
    const memo = await prisma.memo.create({
      data: { userId: req.userId!, title, content: content || '', color: color || 'orange' },
    })
    res.json({ memo })
  } catch (err) {
    res.status(500).json({ error: 'Failed to create memo' })
  }
})

// PATCH /api/memos/:id
router.patch('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const memo = await prisma.memo.findUnique({ where: { id: req.params.id } })
    if (!memo || memo.userId !== req.userId) return res.status(404).json({ error: 'Not found' })
    const updated = await prisma.memo.update({ where: { id: req.params.id }, data: req.body })
    res.json({ memo: updated })
  } catch (err) {
    res.status(500).json({ error: 'Failed to update memo' })
  }
})

// DELETE /api/memos/:id
router.delete('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const memo = await prisma.memo.findUnique({ where: { id: req.params.id } })
    if (!memo || memo.userId !== req.userId) return res.status(404).json({ error: 'Not found' })
    await prisma.memo.delete({ where: { id: req.params.id } })
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete memo' })
  }
})

export default router
