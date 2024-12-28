import { db } from "@/app/lib/prismaClient";

export default async function PATCH(req, res) {
    const { templateId } = req.query;
    const form = req.body;
    try {
        const foundTemplate = await db.template.update({
            where: { id: templateId },
            data: { 
                title: form.title,
                description: form.description,
                topic: form.topic,
                isPublic: form.isPublic
            }
        })
        res.status(201).json({ updatedTemplate: foundTemplate })
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Error updating template', error })
        return error;
    }
}