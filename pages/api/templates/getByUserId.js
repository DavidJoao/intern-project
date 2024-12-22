import { db } from "@/app/lib/prismaClient";

export default async function GET(req, res) {
    const { userId } = req.query;
    try { 
        const foundTemplates = await db.template.findMany({ where: { creatorId: userId }, orderBy: { order: 'asc' } })
        res.status(200).json({ templates: foundTemplates })
    } catch (error) {
        res.status(500).json({ error: 'Error fetching templates by user', error })
        console.log(error);
        return error;
    }
}