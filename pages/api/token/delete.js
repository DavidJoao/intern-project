import { db } from "@/app/lib/prismaClient";

export default async function DELETE(req, res){
    const { userId } = req.query;
    try {
        await db.apiToken.delete({ where: { userId: userId } })
        res.status(200).json({ message: 'Token deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error deleting token', error })
        return error;
    }
}