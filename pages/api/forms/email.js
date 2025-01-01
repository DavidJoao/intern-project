const nodemailer = require("nodemailer");
import { db } from "@/app/lib/prismaClient";
import jsPDF from "jspdf";

export default async function POST(req, res){
    const { emailData } = req.body;
    try {
        const doc = new jsPDF()
        let currentY = 10;

        doc.text(`Answers For: ${emailData?.templateTitle}`, 10, currentY);
        currentY += 10;
        doc.text(`Submitted By: ${emailData?.userEmail}`, 10, currentY);
        currentY += 10;

        for (const answer of emailData.answers) {
            const question = await db.question.findFirst({ where: { id: answer?.id } });

            if (question) {
                const { title, description } = question;
                const { value } = answer;

                doc.setFontSize(12);
                doc.text(`Question: ${title}`, 10, currentY);
                currentY += 7;

                if (description) {
                    doc.setFontSize(10);
                    const lines = doc.splitTextToSize(`Description: ${description}`, 190); 
                    lines.forEach(line => {
                        doc.text(line, 10, currentY);
                        currentY += 5;
                    });
                }

                doc.setFontSize(12);
                doc.text(`Answer: ${value}`, 10, currentY);
                currentY += 10;

                if (currentY > 280) {
                    doc.addPage(); 
                    currentY = 10;
                }
            }
        }

        const pdfBuffer = doc.output("arraybuffer")
        const buffer = Buffer.from(pdfBuffer)

        const mailOptions = {
            from: "itransition.notifier@gmail.com",
            to: emailData?.userEmail,
            subject: `Answers for Form "${emailData?.templateTitle}"`,
            attachments: [
                {
                    filename: `Answers for ${emailData?.templateTitle}`,
                    content: buffer,
                    contentType: "application/pdf"
                }
            ]
        }

        const transporter = nodemailer.createTransport({
            service: "gmail",
            host: "smtp.gmail.com",
            port: 465,
            secure: true,
            requireTLS: true,
            auth: {
                user: process.env.NEXT_PUBLIC_NODEMAILER_EMAIL,
                pass: process.env.NEXT_PUBLIC_NODEMAILER_EMAIL_OTP
            }
        })

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error(error)
                res.status(500).end("Failed to send the email")
            } else {
                console.log("Email sent:", info.response)
                res.status(200).end("Email sent successfully")
            }
        })

    } catch (error) {
        res.status(500).json({ error: 'Error sending email', error })
        console.log(error)
        return error
    }
}