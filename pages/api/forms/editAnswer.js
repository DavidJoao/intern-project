import { db } from "@/app/lib/prismaClient";

export default async function PATCH(req, res) {
    const { answerId } = await req.query;
    const { data } = await req.body;
    console.log(data)
    try {
        const foundAnswer = await db.answer.update({ where: { id: answerId }, data: { value: data } })
        res.status(200).json({ updatedAnswer: foundAnswer })
    } catch (error) {
        res.status(500).json({ error: 'Error updating answer', error })
        console.log(error)
        return error;
    }
    
}