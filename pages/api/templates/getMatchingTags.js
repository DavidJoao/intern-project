import { db } from "@/app/lib/prismaClient";

export default async function GET(req, res) {
    const { query } = req.query;
    try {
        const matchingTemplates = await db.template.findMany({
            select: {
                tags: true,
            },
        });

        const matchingTags = matchingTemplates.flatMap((template) =>
            template.tags.filter((tag) =>
                tag.toLowerCase().includes(query.toLowerCase())
            )
        );

        const uniqueTags = [...new Set(matchingTags)];

        res.status(200).json({ tags: uniqueTags })
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Error fetching matching tags' })
    }
}