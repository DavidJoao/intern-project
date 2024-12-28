import { db } from "@/app/lib/prismaClient";

export default async function PATCH(req, res){
    const { userEmail, templateId } = req.query;
    try {
        const updatedTemplate = await db.template.update({
            where: { id: templateId },
            data: {
                allowedUsers: {
                    push: userEmail,
                },
            },
        });

        res.status(201).json({ updatedTemplate: updatedTemplate })
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Error adding user to list' })
    }
}