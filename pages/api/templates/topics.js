import { Topic } from "@prisma/client";

export default async function GET(req, res){
    try {
        res.status(200).json({ topics: Topic});
    } catch (error) {
        res.status(500).json({ error: error })
    }
}