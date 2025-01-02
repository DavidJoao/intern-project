import { db } from "@/app/lib/prismaClient";

export default async function GET(req, res) {
    try {
        const { email } = req.query;
        const foundUser = await db.user.findUnique({ where: { email: email } });

        if (!foundUser) {
            return res.status(404).json({ error: 'Account does not exist' });
        }

        if (foundUser.status === 'blocked') {
            return res.status(400).json({ error: 'Account blocked' });
        }

        return res.status(200).json({ user: foundUser });
    } catch (error) {
        res.status(500).json({ error: error })
        console.log(error)
        return error
    }
}