import { db } from "@/app/lib/prismaClient";

export default async function POST(req, res) {
    const { userId, templateId } = await req.query;
    const answers = await req.body;
    try {
        const createdForm = await db.form.create({
            data: {
                templateId: templateId,
                userId: userId,
            }
        })

        const createdAnswers = await Promise.all(
            answers.map((answer) =>
                db.answer.create({
                    data: {
                        formId: createdForm.id,
                        questionId: answer.id,
                        userId: userId,
                        value: answer.value,
                    },
                })
            )
        );

        res.status(200).json({ createdForm: createdForm, createdAnswers: createdAnswers })
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: 'Error Creating Form', error })
        return error;
    }
}