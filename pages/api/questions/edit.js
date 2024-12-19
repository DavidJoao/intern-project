import { db } from "@/app/lib/prismaClient";

export default async function PATCH (req, res) {
    const { questionId } = await req.query;
    const form = await req.body;
    try {
        const updatedQuestion = await db.question.update({ 
            where: { id: questionId },
            data: {
                title: form.title,
                description: form.description
            }
         })
         res.status(201).json({ updatedQuestion: updatedQuestion })
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: 'Error Editing Question' })
        return error;
    }
}