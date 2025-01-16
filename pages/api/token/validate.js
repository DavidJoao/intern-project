import { db } from "@/app/lib/prismaClient";


export default async function GET(req, res){

    const validateToken = async () => {
        const authorizationHeader = req.headers["authorization"];
        if (!authorizationHeader || !authorizationHeader.startsWith("Bearer ")) {
            return { valid: false, status: 401, message: "Authorization token is missing or invalid." };
        }
    
        const token = authorizationHeader.split(" ")[1]
        const apiToken = await db.apiToken.findUnique({ where: { token }, include:{ user: true } })
    
        if (!apiToken || new Date() > apiToken.expiresAt){
            return { valid: false, status: 401, message: "Invalid or expired token." };
        }
    
        return { valid: true, status: 200, userToken: apiToken.token, token: authorizationHeader.split(" ")[1], userId: apiToken.userId };
    }
    
    const validation = await validateToken()
    if (!validation.valid){
        res.status(401).json(validation)
    }
    
    const userId = validation.userId

    if (!userId) return res.status(401).json({ error: 'User ID Required' });
    if (validation.userToken !== validation.token) return res.status(401).json({ error: 'Invalid Token' })


    try {
        const templates = await db.template.findMany({ 
            where: { creatorId: userId },
            include: {
                questions: {
                    include: {
                        answers: {
                            include: {
                                form: true
                            }
                        }
                    }
                },
                forms: {
                    include: {
                        answers: {
                            include: {
                                question: true
                            }
                        }
                    }
                }
            }
        })

        res.status(200).json({ templates: templates })
    } catch (error) {
        res.status(500).json({ error: 'Error authorizing data fetch ', error })
    }

}