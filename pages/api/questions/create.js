import { db } from "@/app/lib/prismaClient";

export default async function POST(req, res) {
  const form = await req.body;
  try {
    const maxOrderQuestion = await db.question.findFirst({
      where: { templateId: form.templateId },
      orderBy: { order: 'desc' },
    });

    const defaultOrder = maxOrderQuestion ? maxOrderQuestion.order + 1 : 1;
    
    const questionCreated = await db.question.create({
      data: {
        templateId: form.templateId,
        type: form.type,
        title: form.title,
        description: form.description,
        displayInResults: form.displayInResults,
        order: form.order ?? defaultOrder,
      },
    });

    res.status(200).json({ questionCreated });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error });
  }
}
