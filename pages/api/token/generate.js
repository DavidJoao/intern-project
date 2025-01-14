import { db } from "@/app/lib/prismaClient"
import crypto from "crypto"

export default async function POST(req, res) {

    const { userId } = req.query;

	try {
		const token = crypto.randomBytes(32).toString("hex")
		const expiresAt = new Date()
		expiresAt.setFullYear(expiresAt.getFullYear() + 1)

		await db.apiToken.create({
			data: {
				token,
				userId,
				expiresAt,
			},
		})
        
        res.status(200).json({ token })
		return token

	} catch (error) {
		res.status(500).json({ error: error })
		return error
	}
}
