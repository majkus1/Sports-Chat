import User from '../../models/User'
import bcrypt from 'bcrypt'
import connectToDb from '../../lib/db'
import jwt from 'jsonwebtoken'

export default async (req, res) => {
	try {
		await connectToDb()
		if (req.method !== 'POST') {
			res.status(405).end()
			return
		}

		const { email, password, username } = req.body

		const existingUser = await User.findOne({ email })
		if (existingUser) {
			res.status(409).send('Użytkownik z tym adresem email już istnieje'); return;
		}

		const hashedPassword = await bcrypt.hash(password, 10)
		const user = new User({ email, password: hashedPassword, username })
		await user.save()

		const token = jwt.sign({ userId: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' })

		res.setHeader('Set-Cookie', `token=${token}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=3600`)

		res.status(201).json({ token, message: 'Zarejestrowano', username: user.username })
	} catch (error) {
		console.error('Błąd podczas rejestracji:', error)
		res.status(500).send('Wewnętrzny błąd serwera')
	}
}
