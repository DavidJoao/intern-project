const bcrypt = require("bcrypt");
import { db } from "@/app/lib/prismaClient";

export default async function POST(req, res){
    try {
        const form = await req.body;
        const hash = await bcrypt.hash(form.password, 10)
        await db.user.create({ 
            data: {
                name: form.name,
                email: form.email,
                password: hash,
            }
        })
        res.status(201).json({ success: true, message: 'User Created' })
    } catch (error) {
        res.status(500).json({ success: false, message: 'Creation of User Failed' })
    }
}