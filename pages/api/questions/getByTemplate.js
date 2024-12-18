import { db } from "@/app/lib/prismaClient";

export default async function GET(req, res) {
    const { templateId } = req.query;
    try {
        const foundQuestions = await db.question.findMany({ where: { templateId: templateId } })
        res.status(200).json({ questions: foundQuestions })
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error })
    }
}