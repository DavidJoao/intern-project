import { db } from "@/app/lib/prismaClient";

export default async function PATCH(req, res) {
    const { commentId } = req.query;
    const content = req.body;
    try {
        const foundComment = await db.comment.update({ where: { id: commentId }, data: { content: content } })
        res.status(201).json({ updatedComment: foundComment })
    } catch (error) {
        console.log(error);
        res.status(500).json({ error })
    }
}