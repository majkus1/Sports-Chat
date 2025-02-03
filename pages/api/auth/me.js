import jwt from 'jsonwebtoken'
import connectToDb from '../../../lib/db'
import User from '../../../models/User'

export default async (req, res) => {
	try {
		await connectToDb()
		const cookie = req.headers.cookie
		if (!cookie) {
			res.status(401).end()
			return
		}

		const tokenMatch = cookie.match(/token=([^;]+)/)
		if (!tokenMatch) {
			res.status(401).end()
			return
		}
		const token = tokenMatch[1]

		const decoded = jwt.verify(token, process.env.JWT_SECRET)
		const user = await User.findById(decoded.userId)
		if (!user) {
			res.status(401).end()
			return
		}

		res.status(200).json({ userId: user.id, username: user.username })
	} catch (error) {
		console.error('Błąd w /api/auth/me:', error)
		res.status(500).end()
	}
}
