import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import React, { useCallback } from "react";
import Question from "./Question";
import { updateOrder } from "@/app/actions/questions";

const QuestionsSection = ({ questions, setQuestions, template, loadQuestions }) => {

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

  return (
    <DndProvider backend={HTML5Backend}>
      <section className="flex flex-col w-full p-4 border-[1px] border-slate-200 gap-4">
        {questions?.length > 0 ? (
          questions.map((question, index) => (
            <Question key={question.id} question={question} index={index} moveQuestion={moveQuestion} template={template} loadQuestions={loadQuestions} />
          ))
        ) : (
          <p className="text-center">No questions at the moment</p>
        )}
      </section>
    </DndProvider>
  );
};

export default QuestionsSection;
