import { db } from "@/app/lib/prismaClient"

export default async function POST (req, res) {
    const { userId } = req.query;
    try {
        const foundUser = await db.user.findUnique({ where: { id: userId } })

        if (!foundUser) {
            return res.status(404).json({ error: "User not found" });
        }

        const updatedUser = await db.user.update({
            where: { id: userId },
            data: {
                status: foundUser.status === "active" ? "blocked" : "active"
            },
        });

        res.status(200).json({ user: updatedUser })
    } catch (error) {
        res.status(500).json({ error })
        return error
    }
} 