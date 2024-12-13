import { db } from "@/app/lib/prismaClient";

export default async function GET(req, res) {
    try {
        const { email } = req.query;
        console.log(email)
        const foundUser = await db.user.findUnique({ where: { email: email } });
        if (!foundUser){
            res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json({ user: foundUser })
        return foundUser;
    } catch (error) {
        res.status(500).json({ error: error })
        console.log(error)
        return error
    }
}