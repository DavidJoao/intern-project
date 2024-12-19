import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import React, { useRef } from "react";
import Question from "./Question";

const ItemType = {
  QUESTION: "question",
};

const QuestionsSection = ({ questions, setQuestions, template, loadQuestions }) => {
  const moveQuestion = (dragIndex, hoverIndex) => {
    const updatedQuestions = [...questions];
    const [draggedItem] = updatedQuestions.splice(dragIndex, 1); 
    updatedQuestions.splice(hoverIndex, 0, draggedItem);
    setQuestions(updatedQuestions);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <section className="flex flex-col w-full p-3 border-[1px] border-slate-200 gap-2">
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
