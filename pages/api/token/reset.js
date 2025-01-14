import { db } from "@/app/lib/prismaClient"
import crypto from "crypto"

export default async function PATCH(req, res) {

    const { apiToken } = req.query;

    const newToken = crypto.randomBytes(32).toString("hex")
    const expiresAt = new Date()
    expiresAt.setFullYear(expiresAt.getFullYear() + 1)

    try {
        const token = await db.apiToken.update({ where: { token: apiToken }, data: { token: newToken, expiresAt: expiresAt } })
        res.status(200).json({ token })
    } catch (error) {
        res.status(500).json({ error })
        console.log(error)
        return error
    }
}