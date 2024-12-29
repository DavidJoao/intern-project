import { db } from "@/app/lib/prismaClient";

export default async function GET (req, res) {
    const { search } = req.query;
    
    try {
        const templates = await db.template.findMany({
            where: {
              OR: [
                { title: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } },
                {
                  comments: {
                    some: {
                      content: { contains: search, mode: 'insensitive' },
                    },
                  },
                },
                {
                  questions: {
                    some: {
                      OR: [
                        { title: { contains: search, mode: 'insensitive' } },
                        { description: { contains: search, mode: 'insensitive' } },
                      ],
                    },
                  },
                },
                {
                  tags: {
                    hasSome: [search]
                  }
                }
              ],
            },
            include: {
              comments: true,
              questions: true,
            },
          });

          res.status(200).json({ templates: templates })

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: `Error fetching ${search} templates`, error })
        return error;

    }
}