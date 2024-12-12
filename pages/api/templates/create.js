import { db } from "@/app/lib/prismaClient"

export default async function POST(req, res){
    try {
        const form = await req.body;
        const createdTemplate = await db.template.create({
            data: {
                topic: form.topic,
                title: form.name,
                description: form.description,
                imageUrl: form.imageUrl,
                creatorId: form.creatorId
            }
        })
        res.status(201).json({template: createdTemplate})
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: error })
    }
}