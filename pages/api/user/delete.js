import { db } from "@/app/lib/prismaClient"

export default async function POST(req, res) {
    const { userId } = req.query;

    if (!userId) {
        return res.status(400).json({ error: "User ID is required" });
    }

    try {
        const foundUser = await db.user.delete({ where: { id: userId } })
        res.status(200).json({ deletedUser: foundUser })
    } catch (error) {
        res.status(500).json({ error: error })
        console.log(error)
        return error
    }
}