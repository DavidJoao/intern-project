import { db } from "@/app/lib/prismaClient"

export default async function GET(req, res){
    const { templateId } = req.query;
    try {
        const foundForms = await db.form.findMany({
            where: { templateId: templateId },
            include: {
              user: {
                select: {
                  name: true,
                  createdAt: true,
                },
              },
              template: {
                select: {
                  creatorId: true
                }
              },
              answers: {
                where: { question: { displayInResults: true } },
                include: {
                  question: {
                    select: {
                      title: true,
                      description: true,
                    },
                  },
                },
                orderBy: { 
                  question: {
                    order: 'asc'
                  }
                }
              },
            },
          });

         res.status(200).json({ forms: foundForms })
    } catch (error) {
        res.status(500).json({ error: 'Error fetching forms', error })
        return error
    }
}