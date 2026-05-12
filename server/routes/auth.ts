import { Router, Response } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { prisma } from '../db'
import { authMiddleware, AuthRequest } from '../middleware/auth'

const router = Router()
const JWT_SECRET = process.env.JWT_SECRET || 'focus-dev-secret'

function signToken(userId: string) {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' })
}

// POST /api/auth/register
router.post('/register', async (req: AuthRequest, res: Response) => {
  try {
    const { email, name, password } = req.body
    if (!email || !name || !password) {
      return res.status(400).json({ error: 'Missing fields' })
    }
    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) {
      return res.status(409).json({ error: 'Email already registered' })
    }
    const hash = await bcrypt.hash(password, 10)
    const user = await prisma.user.create({
      data: { email, name, password: hash },
    })
    const token = signToken(user.id)
    res.json({ token, user: { id: user.id, email: user.email, name: user.name } })
  } catch (err) {
    res.status(500).json({ error: 'Registration failed' })
  }
})

// POST /api/auth/login
router.post('/login', async (req: AuthRequest, res: Response) => {
  try {
    const { email, password } = req.body
    if (!email || !password) {
      return res.status(400).json({ error: 'Missing fields' })
    }
    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }
    const valid = await bcrypt.compare(password, user.password)
    if (!valid) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }
    const token = signToken(user.id)
    res.json({ token, user: { id: user.id, email: user.email, name: user.name } })
  } catch (err) {
    res.status(500).json({ error: 'Login failed' })
  }
})

// GET /api/auth/me
router.get('/me', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      select: { id: true, email: true, name: true, createdAt: true },
    })
    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }
    res.json({ user })
  } catch (err) {
    res.status(500).json({ error: 'Failed to get user' })
  }
})

export default router
