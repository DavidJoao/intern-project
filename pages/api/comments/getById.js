import { db } from "@/app/lib/prismaClient"

export default async function GET (req, res) {
    const { templateId } = req.query;
    try {
        const foundComments = await db.comment.findMany({
            where: { templateId },
            include: {
              user: {
                select: {
                  name: true
                },
              },
            },
            orderBy: {
              createdAt: 'asc'
            }
          });
      
          const commentsWithUser = foundComments.map((comment) => ({
            id: comment.id,
            templateId: comment.templateId,
            userId: comment.userId,
            userName: comment.user.name,
            content: comment.content,
            createdAt: comment.createdAt,
          }));
      
          res.status(200).json({ comments: commentsWithUser });
    } catch (error) {
        res.status(500).json({ error: error })
        return error
    }
}