import { db } from "@/app/lib/prismaClient"

export default async function POST(req, res){
    try {
        const form = await req.body;

        const maxOrderTemplate = await db.template.findFirst({
            where: { creatorId: form.creatorId },
            orderBy: { order: 'desc' },
        });

        const defaultOrder = maxOrderTemplate ? maxOrderTemplate.order + 1 : 1;

        const createdTemplate = await db.template.create({
            data: {
                topic: form.topic,
                title: form.name,
                description: form.description,
                imageUrl: form.imageUrl,
                creatorId: form.creatorId,
                order: form.order ?? defaultOrder,
            }
        })
        res.status(201).json({template: createdTemplate})
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: error })
    }
}