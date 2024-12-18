import { db } from "@/app/lib/prismaClient";

export default async function GET(req, res) {
    const { userId, templateId } = req.query;
    try {
        const isLiked = await db.like.findFirst({
            where: { templateId, userId }
        });

        const likeCount = await db.like.count({
            where: { templateId }
         })

         res.status(200).json({ isLiked: Boolean(isLiked), likes: likeCount })
         return {
            isLiked: Boolean(isLiked),
            likes: likeCount,
          };

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Error Fetching Like Count' })
    }
}