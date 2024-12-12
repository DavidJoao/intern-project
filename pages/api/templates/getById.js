import { db } from "@/app/lib/prismaClient"

export default async function GET(req, res){
    const { templateId } = req.query;
    try {
        const foundTemplate = await db.template.findUnique({ where: { id: templateId } })
        res.status(200).json({ foundTemplate: foundTemplate })
        return foundTemplate
    } catch (error) {
        console.log(error)
        res.status(500).json({ error })
    }
}