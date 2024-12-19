import { db } from "@/app/lib/prismaClient"

export default async function POST(req, res) {
	const { questions } = await req.body
    const { templateId } = await req.query;
	try {
        const updatePromises = questions.map((question, index) =>
            db.question.update({
              where: {
                id_templateId: {
                  id: question.id,
                  templateId,
                },
              },
              data: { order: index },
            })
          );
      
        await Promise.all(updatePromises);
		res.status(200).json({ message: "Order updated successfully" })
	} catch (error) {
		console.log(error)
		res.status(500).json({ message: "Error Updating Order" })
	}
}
