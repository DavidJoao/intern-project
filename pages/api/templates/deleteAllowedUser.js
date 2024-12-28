import { db } from "@/app/lib/prismaClient";

export default async function PATCH(req, res) {
    const { userEmail, templateId } = req.query;
    try {

        const template = await db.template.findUnique({
            where: { id: templateId },
            select: { allowedUsers: true },
        });

        if (!template) {
            return res.status(404).json({ error: "Template not found" });
        }

        const updatedAllowedUsers = template.allowedUsers.filter(
            (email) => email !== userEmail
        );

        const updatedTemplate = await db.template.update({
            where: { id: templateId },
            data: {
                allowedUsers: {
                    set: updatedAllowedUsers,
                },
            },
        });

        res.status(200).json({ updatedTemplate });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error removing user from list" });
    }
}
