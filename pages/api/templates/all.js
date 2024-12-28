import { db } from "@/app/lib/prismaClient";

export default async function GET(req, res) {
    const { userId } = req.query
    const user = await db.user.findUnique({ where: { id: userId } })
    try {
        if (user?.role === 'admin') {
            const templates = await db.template.findMany({});
            return res.status(200).json({ templates });
        }

        const templates = await db.template.findMany({
            where: {
                OR: [
                    { isPublic: true },
                    {
                        isPublic: false,
                        AND: [
                            {
                                OR: [
                                    { allowedUsers: { hasSome: [user?.email] } },
                                    { creatorId: userId }
                                ]
                            }
                        ]
                    }
                ]
            }
        });
        
        return res.status(200).json({ templates });
        
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Error fetching templates", error });
    }
}
