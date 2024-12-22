import { db } from "@/app/lib/prismaClient"

export default async function DELETE(req, res){
    const { templateId } = req.query;
    try {
        const deletedTemplate = await db.template.delete({ where: { id: templateId } })
        res.status(200).json({ deletedTemplate: deletedTemplate })
    } catch (error) {
        res.status(500).json({ error: 'Error Deleting Template', error })
    }
}