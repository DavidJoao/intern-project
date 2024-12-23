import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import React, { useCallback, useState } from "react";
import Question from "./Question";
import { updateOrder } from "@/app/actions/questions";
import { createForm } from "@/app/actions/forms";
import { useAuth } from "@/app/hooks/useAuth";

const QuestionsSection = ({ questions, setQuestions, template, loadQuestions }) => {

  const user = useAuth();

  const [answers, setAnswers] = useState([])
  const [errorMessage, setErrorMessage] = useState("")
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

    try {
      await updateOrder(template?.id, { questions: orderedQuestions })
    } catch (error) {
      console.log(error)
      console.error("Error updating order:", error);
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

  return (
    <DndProvider backend={HTML5Backend}>
      <form className="flex flex-col w-full p-4 gap-4" onSubmit={handleSubmitForm}>
        {questions?.length > 0 ? (
          questions.map((question, index) => (
            <Question key={question.id} question={question} index={index} moveQuestion={moveQuestion} template={template} loadQuestions={loadQuestions} setAnswers={setAnswers} handleAnswerChange={handleAnswerChange} formResetTrigger={formResetTrigger}/>
          ))
        ) : (
          <p className="text-center">No questions at the moment</p>
        )}
        <button className="blue-button h-auto mx-auto" type="submit">Send Form</button>
        <p className="text-red-500 font-bold mx-auto text-center">{errorMessage}</p>
      </form>
    </DndProvider>
  );
};

export default QuestionsSection;
