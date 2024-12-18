import React, { useRef } from "react"
import { useDrag, useDrop } from "react-dnd";

const Question = ({ question, index, moveQuestion }) => {

    const ItemType = {
        QUESTION: "question",
      };

	const ref = useRef(null)

	const [, drag] = useDrag({
		type: ItemType.QUESTION,
		item: { index },
	})

	const [, drop] = useDrop({
		accept: ItemType.QUESTION,
		hover: draggedItem => {
			if (draggedItem.index !== index) {
				moveQuestion(draggedItem.index, index)
				draggedItem.index = index
			}
		},
	})

	drag(drop(ref))

	return (
		<div ref={ref} className="flex flex-row items-center w-auto p-3 gap-2 border-[1px] rounded bg-gray-100">
			<p className="font-bold">{question.title}</p>
			<p>{question.description}</p>
		</div>
	)
}

export default Question
