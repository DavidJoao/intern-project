import { db } from "@/app/lib/prismaClient";

export default async function GET(req, res){
    try {
        const templates = await db.template.findMany({ 
            include: {
                _count: {
                    select: {
                        forms: true
                    }
                },
                creator: {
                    select: {
                        name: true
                    }
                }
            },
            orderBy: {
                forms:{
                    _count: 'desc'
                }
            },
            take: 5
         })

         res.status(200).json({ topTemplates: templates })
        
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Error fetching top 5 templates', error })
        return error;
    }
}