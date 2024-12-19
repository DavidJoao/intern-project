import { db } from "@/app/lib/prismaClient";

export default async function POST (req, res) {
    const { questionId } = req.query;
    try {
        const foundQuestion = await db.question.delete({ where: { id: questionId } })
        res.status(202).json({ deletedQuestion: foundQuestion });
    } catch (error) {
        console.log(error)
        res.status(500).json({ error })
    }
}