import { db } from "@/app/lib/prismaClient"

export default async function POST(req, res) {
	const { templates } = await req.body
	try {
        const updatePromises = templates.map((template, index) =>
            db.template.update({
                where: {
                    id: template.id,
                },
                data: { 
                    order: index,
                },
            })
        );
      
        await Promise.all(updatePromises);
		res.status(200).json({ message: "Order updated successfully" })
	} catch (error) {
		console.log(error)
		res.status(500).json({ message: "Error Updating Order" })
	}
}
