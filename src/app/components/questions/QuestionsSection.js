import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import React, { useCallback, useState } from "react";
import Question from "./Question";
import { updateOrder } from "@/app/actions/questions";
import { createForm, sendFormThroughEmail } from "@/app/actions/forms";
import { useAuth } from "@/app/hooks/useAuth";
import NonAuthQuestion from "./NonAuthQuestion";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { icons } from "@/app/lib/icons";

const QuestionsSection = ({ questions, setQuestions, template, loadQuestions, session }) => {

  const user = useAuth();
  const { t } = useTranslation('common');

  const [answers, setAnswers] = useState([])
  const [errorMessage, setErrorMessage] = useState("")
  const [successMessage, setSuccessMessage] = useState("")
  const [formResetTrigger, setFormResetTrigger] = useState(0);
  const [sendCopy, setSendCopy] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const emailData = {
    userEmail: user?.user?.email,
    templateTitle: template?.title,
    templateDescription: template?.description,
    templateImage: template?.imageUrl,
    answers: answers
  }

  const moveQuestion = useCallback((dragIndex, hoverIndex) => {
    const updatedQuestions = [...questions];
    const [draggedItem] = updatedQuestions.splice(dragIndex, 1);
    updatedQuestions.splice(hoverIndex, 0, draggedItem);
    setQuestions(updatedQuestions);

    updateQuestionsOrder(updatedQuestions);
  }, [questions, setQuestions]);

  const updateQuestionsOrder = async (questions) => {
    const orderedQuestions = questions.map((question, index) => ({
      id: question.id,
      order: index,
    }));

    if (user?.user?.role === 'admin' || template.creatorId === user?.user?.id) {
      try {
        await updateOrder(template?.id, { questions: orderedQuestions })
      } catch (error) {
        console.log(error)
        console.error("Error updating order:", error);
      }
    } else {
      setErrorMessage("User Not Allowed To Perform Action (Changes will not be saved)")
      setTimeout(() => {
        setErrorMessage("")
      }, 2000)
    }
  };

  const handleAnswerChange = (questionId, value) => {
    setAnswers((prevAnswers) => {
      const updatedAnswers = [...prevAnswers];
      const existingAnswerIndex = updatedAnswers.findIndex(answer => answer.id === questionId);

      if (existingAnswerIndex > -1) {
        updatedAnswers[existingAnswerIndex].value = value;
      } else {
        updatedAnswers.push({ id: questionId, value });
      }
      return updatedAnswers;
    });
  };

  const handleSubmitForm = async (e) => {
      e.preventDefault()
      setErrorMessage("")
      setIsLoading(true)

      if (sendCopy === true) await sendEmail();
      const response = await createForm(user?.user?.id, template?.id, answers);
      if (response.status === 200) {
        setSuccessMessage(t("email-success"))
        setTimeout(async () => {
          setSuccessMessage("")
        }, 3000)
      }

      setErrorMessage("")
      setAnswers([])
      setIsLoading(false)
      setFormResetTrigger((prev) => prev + 1);
  }

  const sendEmail = async () => {
    const emailResponse = await sendFormThroughEmail(emailData)
    if (emailResponse.status === 200) {
      setSuccessMessage(t("email-success"))
    }
    setTimeout(async () => {
      setSuccessMessage("")
    }, 3000)
    
    setAnswers([])
    setFormResetTrigger((prev) => prev + 1);
  }

  return (
    <>
    { session ? (
      <DndProvider backend={HTML5Backend}>
        <form className="flex flex-col w-full p-4 gap-4" onSubmit={handleSubmitForm}>
        <p className="text-red-500 font-bold mx-auto text-center">{errorMessage}</p>
          {questions?.length > 0 ? (
            questions.map((question, index) => (
              <Question key={question.id} question={question} index={index} moveQuestion={moveQuestion} template={template} loadQuestions={loadQuestions} setAnswers={setAnswers} handleAnswerChange={handleAnswerChange} formResetTrigger={formResetTrigger} session={session}/>
            ))
          ) : (
            <p className="text-center">{t("no-questions")}</p>
          )}
            <div className="flex flex-row gap-2 mx-auto">
              <p>{t("send-form-copy")}? {sendCopy.toString()}</p>
              <input type="checkbox" checked={sendCopy} value={sendCopy} onChange={(e) => setSendCopy(e.target.checked)}/>
            </div>
            <button className="blue-button h-auto mx-auto flex items-center justify-center" type="submit">{ isLoading ? icons.loading : t("send-form")}</button>
          <p className="text-red-500 font-bold mx-auto text-center">{errorMessage}</p>
          <p className="text-green-500 font-bold mx-auto text-center">{successMessage}</p>
        </form>
      </DndProvider>
    ) : (
      <div>
        <Link className='new-theme-button' href={'/pages/login'}>{t("login")}</Link>
        <form className="flex flex-col w-full p-4 gap-4" onSubmit={handleSubmitForm}>
          {questions?.length > 0 ? (
            questions.map((question, index) => (
              <NonAuthQuestion key={question.id} question={question} index={index} moveQuestion={moveQuestion} template={template} loadQuestions={loadQuestions} setAnswers={setAnswers} handleAnswerChange={handleAnswerChange} formResetTrigger={formResetTrigger} session={session}/>
            ))
          ) : (
            <p className="text-center">{t("no-questions")}</p>
          )}

          {session && <button className="blue-button h-auto mx-auto" type="submit">{t("send-form")}</button> }
          <p className="text-red-500 font-bold mx-auto text-center">{errorMessage}</p>
        </form>
      </div>
    )}
    </>
  );
};

export default QuestionsSection;
