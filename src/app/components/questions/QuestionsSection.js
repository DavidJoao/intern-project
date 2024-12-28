import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import React, { useCallback, useState } from "react";
import Question from "./Question";
import { updateOrder } from "@/app/actions/questions";
import { createForm, sendFormThroughEmail } from "@/app/actions/forms";
import { useAuth } from "@/app/hooks/useAuth";
import NonAuthQuestion from "./NonAuthQuestion";
import Link from "next/link";

const QuestionsSection = ({ questions, setQuestions, template, loadQuestions, session }) => {

  const user = useAuth();

  const [answers, setAnswers] = useState([])
  const [errorMessage, setErrorMessage] = useState("")
  const [successMessage, setSuccessMessage] = useState("")
  const [formResetTrigger, setFormResetTrigger] = useState(0);

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
    setErrorMessage("")
    e.preventDefault();
    if (answers?.length < questions?.length) {
      setErrorMessage("It is required to answer all questions")
    } else {
      const response = await createForm(user?.user?.id, template?.id, answers);
      console.log(response)
      setAnswers([])
      setErrorMessage("")
      setFormResetTrigger((prev) => prev + 1);
    }
  }

  const sendEmail = async (e) => {
    e.preventDefault();
    const emailData = {
      userEmail: user?.user?.email,
      templateTitle: template?.title,
      templateDescription: template?.description,
      templateImage: template?.imageUrl,
      answers: answers
    }

    const response = await sendFormThroughEmail(emailData)
    if (response.status === 200) {
      setSuccessMessage("Email Sent Successfully! Remember to check your Spam Folder. Please Wait...")
      setTimeout(async () => {
        await handleSubmitForm(e)
        setSuccessMessage("")
      }, 3000)
    }
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
            <p className="text-center">No questions at the moment</p>
          )}
          { answers?.length !== questions?.length ? (
            <p className="mx-auto text-center">Must Answer All Questions to Submit</p>
          ) : (
            <>
            <button className="blue-button h-auto mx-auto" type="submit">Send Form</button>
            <button className="blue-button h-auto mx-auto" onClick={(e) => sendEmail(e)}>Send Form & Email Me A Copy</button>
            </>
          ) }
          <p className="text-red-500 font-bold mx-auto text-center">{errorMessage}</p>
          <p className="text-green-500 font-bold mx-auto text-center">{successMessage}</p>
        </form>
      </DndProvider>
    ) : (
      <div>
        <Link className='new-theme-button' href={'/pages/login'}>Login</Link>
        <form className="flex flex-col w-full p-4 gap-4" onSubmit={handleSubmitForm}>
          {questions?.length > 0 ? (
            questions.map((question, index) => (
              <NonAuthQuestion key={question.id} question={question} index={index} moveQuestion={moveQuestion} template={template} loadQuestions={loadQuestions} setAnswers={setAnswers} handleAnswerChange={handleAnswerChange} formResetTrigger={formResetTrigger} session={session}/>
            ))
          ) : (
            <p className="text-center">No questions at the moment</p>
          )}

          {session && <button className="blue-button h-auto mx-auto" type="submit">Send Form</button> }
          <p className="text-red-500 font-bold mx-auto text-center">{errorMessage}</p>
        </form>
      </div>
    )}
    </>
  );
};

export default QuestionsSection;
