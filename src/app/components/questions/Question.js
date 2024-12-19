import { useAuth } from "@/app/hooks/useAuth";
import React, { useEffect, useRef, useState } from "react"
import { useDrag, useDrop } from "react-dnd";
import { MdModeEditOutline } from "react-icons/md";
import { FaTrash } from "react-icons/fa";
import { deleteQuestionById, editQuestionById } from "@/app/actions/questions";

const Question = ({ question, index, moveQuestion, template, loadQuestions }) => {


	const initialEdit = {
		title: question?.title,
		description: question?.description
	}

	const ref = useRef(null)
	const user = useAuth();

	const [inputType, setInputType] = useState(<></>)
	const [isEditing, setIsEditing] = useState(false)
	const [newEditContent, setNewEditContent] = useState(initialEdit)

    const ItemType = {
        QUESTION: "question",
    };

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

	useEffect(() => {
		switch (question.type) {
			case 'text':
				setInputType(<input className="input" type="text"/>)
				break;
			case 'multi_line':
				setInputType(<textarea className="input resize-none" type="text"/>)
				break;
			case 'checkbox':
				setInputType(<input className="input" type="checkbox"/>)
				break;
			case 'integer':
				setInputType(<input className="input" type="number"/>)
				break;
			default:
				break;
		}
	}, [])

	const handleEdit = async (e) => {
		e.preventDefault();
		await editQuestionById(question?.id, newEditContent);
		await loadQuestions(template?.id);
		setIsEditing(false)
	}

	const handleDelete = async (e) => {
		e.preventDefault();
		await deleteQuestionById(question?.id);
		await loadQuestions(template?.id)
	}

	return (
		<form ref={ref} className="flex flex-col items-start w-full p-3 gap-2 border-[1px] rounded bg-gray-100 cursor-pointer" onSubmit={handleEdit}>
			<div className="flex items-center justify-between w-full">
				{ isEditing ? ( <input className="input" placeholder="Title" value={newEditContent.title} onChange={(e) => setNewEditContent({...newEditContent, ['title']: e.target.value})}/> ) 
				: 
				( <p className="font-bold">{question.title}</p> ) }

				{template?.creatorId === user?.user?.id || user?.user?.role === "admin" ? (
					<div className="flex gap-3">
						<button className="text-blue-500" onClick={(e) => {
							e.preventDefault();
							setNewEditContent({ title: question?.title, description: question?.description })
							setIsEditing(!isEditing)
						}}> <MdModeEditOutline /> </button>
						<button className="text-red-500" onClick={handleDelete}> <FaTrash /> </button>
					</div>
				) : (
					<></>
				)}
			</div>

			{ isEditing ? ( <input className="input" placeholder="Description" value={newEditContent.description} onChange={(e) => setNewEditContent({...newEditContent, ['description']: e.target.value})}/>) 
			: 
			( <p>{question.description}</p> ) }
			{ isEditing && (
				<div className="flex flex-row gap-3">
					<button type="submit" className="blue-button w-auto">Edit</button>
					<button className="blue-button w-auto" onClick={() => setIsEditing(!isEditing)}>Cancel</button>
				</div>
			)}
			<label>Answer:</label>
			{inputType}
		</form>
	)
}

export default Question
