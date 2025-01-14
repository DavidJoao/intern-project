import { db } from "@/app/lib/prismaClient"

export default async function GET(req, res) {

    const { userId } = req.query;

    try {
        const token = await db.apiToken.findUnique({ where: { userId: userId } })
        if (!token) return res.status(404).json({ error: 'Token not found' })
        
        res.status(200).json({ token })
    } catch (error) {
        res.status(500).json({ error })
        return error
    }
}