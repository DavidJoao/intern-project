import { db } from "@/app/lib/prismaClient"

export default async function GET(req, res) {
    try {
        const templates = await db.template.findMany({})
        res.status(200).json({ templates: templates })
        return templates;
    } catch (error){
        res.status(500).json({error})
        return error
    }
}