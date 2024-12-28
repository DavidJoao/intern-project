import { db } from "@/app/lib/prismaClient";

export default async function GET(req, res) {
  const { query } = req.query;
  
  if (!query) {
    return res.status(400).json({ error: 'Query parameter is required' });
  }

  try {
    const users = await db.user.findMany({
      where: {
        email: {
          contains: query,
          mode: 'insensitive'
        },
      },
      select: {
        email: true,
      },
    });

    return res.status(200).json({ emails: users.map(user => user.email) });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Error fetching emails' });
  }
}