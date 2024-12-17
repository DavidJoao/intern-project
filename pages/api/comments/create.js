import { db } from "@/app/lib/prismaClient";

export default async function POST (req, res) {
    const form = await req.body;
    try {
        const newComment = await db.comment.create({
            data: {
                content: form.content,
                userId: form.userId,
                templateId: form.templateId
            }
        })
        res.status(200).json({ newComment: newComment })
        return newComment;
    } catch (error) {
        res.status(500).json({ error: error })
        console.log(error)
        return error
    }
}