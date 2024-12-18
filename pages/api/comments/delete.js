import { db } from "@/app/lib/prismaClient";

export default async function POST (req, res) {
    const { commentId } = req.query;

    try {
        const foundComment = await db.comment.delete({ where: { id: commentId } })
        res.status(202).json({ deletedComment: foundComment });
    } catch (error) {
        console.log(error)
        res.status(500).json({ error })
    }
}