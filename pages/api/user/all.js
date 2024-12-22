import { db } from "@/app/lib/prismaClient";

export default async function GET(req, res){
    try {
        const allUsersWithoutPassword = []
        const allUsers = await db.user.findMany({orderBy: { createdAt: 'asc' }})
        allUsers.forEach((user, index) => {
            const { password, ...userWithoutPassword } = user;
            allUsersWithoutPassword.push(userWithoutPassword)
        })
        res.status(200).json({ users: allUsersWithoutPassword });
    } catch (error) {
        res.status(500).json({ error: error })
        return error;
    }
}