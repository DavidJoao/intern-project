import { db } from "@/app/lib/prismaClient";

export default async function POST(req, res){
    const { userId, templateId } = req.query;

    try {

        const isLiked = await db.like.findFirst({
            where: { templateId, userId }
        });

        if (isLiked) {
            const deletedLike = await db.like.delete({
                where: { templateId_userId: { templateId, userId } }
            })
            res.status(200).json({ deletedLike: deletedLike })
        } else {
            const createdLike = await db.like.create({ 
                data: {
                    userId: userId,
                    templateId: templateId
                }
            })

            res.status(200).json({ createdLike: createdLike })
        }

    } catch (error) {
        console.log(error);
        res.status(500).json({ error })
    }
}