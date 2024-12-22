import { db } from "@/app/lib/prismaClient";

export default async function DELETE(req, res){
    const { answerId } = req.query;
    try {
        const deletedAnswer = await db.answer.delete({ where: { id: answerId } })
        res.status(200).json({ deletedAnswer: deletedAnswer })
    } catch (error) {
        res.status(500).json({ error:'Error deleting answer', error })
        return error;
    }
}