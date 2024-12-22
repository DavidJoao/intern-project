import { db } from "@/app/lib/prismaClient";

export default async function DELETE(req, res){
    const { formId } = req.query;
    try {
        const deletedForm = await db.form.delete({ where: { id: formId } })
        res.status(200).json({ deletedForm: deletedForm })
    } catch (error) {
        res.status(500).json({ error: 'Error Deleting Form', error })
        return error;
    }
}