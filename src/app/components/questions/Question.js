import { useAuth } from "@/app/hooks/useAuth";
import React, { useEffect, useRef, useState } from "react"
import { useDrag, useDrop } from "react-dnd";
import { MdModeEditOutline } from "react-icons/md";
import { FaTrash } from "react-icons/fa";
import { deleteQuestionById, editQuestionById } from "@/app/actions/questions";
import { useTranslation } from "react-i18next";

const Question = ({ question, index, moveQuestion, template, loadQuestions, handleAnswerChange, formResetTrigger }) => {

	const initialEdit = {
		title: question?.title,
		description: question?.description
	}

	const ref = useRef(null)
	const inputRef = useRef(null);
	const user = useAuth();
	const { t } = useTranslation("common")

	const [inputType, setInputType] = useState(<></>)
	const [isEditing, setIsEditing] = useState(false)
	const [isChecked, setIsChecked] = useState(false)
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
		if (inputRef.current) {
			if (question?.type === "checkbox") {
				inputRef.current.checked = false;
				setIsChecked(false);
			} else {
				inputRef.current.value = "";
			}
		}
	}, [formResetTrigger]);

	useEffect(() => {
		switch (question.type) {
			case 'text':
				setInputType(<input ref={inputRef} className="dark-input text-black" type="text" onChange={handleInputChange}/>)
				break;
			case 'multi_line':
				setInputType(<textarea ref={inputRef} className="dark-input text-black resize-none" type="text" onChange={handleInputChange}/>)
				break;
			case 'checkbox':
				setInputType(<input ref={inputRef} className="dark-input text-black" type="checkbox" onChange={(e) => {
					handleInputChange(e);
					setIsChecked(e.target.checked)
			}}/>)
				break;
			case 'integer':
				setInputType(<input ref={inputRef} className="dark-input text-black" type="number" min={0} onChange={handleInputChange}/>)
				break;
			default:
				break;
		}
	}, [])

	const handleInputChange = (event) => {
		const value = event.target.type === "checkbox" ? event.target.checked : event.target.value;
		handleAnswerChange(question.id, value);
	  };

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
		<div ref={ref} className="flex flex-col items-start w-full p-4 gap-3 border dark:border-gray-700 rounded-md bg-gray-100 dark:bg-gray-900 cursor-pointer shadow-md hover:shadow-lg transition-shadow" >
			<div className="flex items-center justify-between w-full">
				{ isEditing ? ( <input className="input text-black" placeholder="Title" value={newEditContent.title} onChange={(e) => setNewEditContent({...newEditContent, ['title']: e.target.value})}/> ) 
				: 
				( <p className="font-bold text-gray-800 dark:text-gray-200">{question.title}</p> ) }

				{template?.creatorId === user?.user?.id || user?.user?.role === "admin" ? (
					<div className="flex gap-3">
						<button className="new-theme-button" onClick={(e) => {
							e.preventDefault();
							setNewEditContent({ title: question?.title, description: question?.description })
							setIsEditing(!isEditing)
						}}> <MdModeEditOutline /> </button>
						<button className="new-theme-red-button" onClick={handleDelete}> <FaTrash /> </button>
					</div>
				) : (
					<></>
				)}
			</div>

			{ isEditing ? ( <input className="input text-black" placeholder="Description" value={newEditContent.description} onChange={(e) => setNewEditContent({...newEditContent, ['description']: e.target.value})}/>) 
			: 
			( <p className="text-gray-700 dark:text-gray-300">{question.description}</p> ) }
			{ isEditing && (
				<div className="flex flex-row gap-3 mt-2">
					<button type="submit" className="new-theme-button" onClick={handleEdit}>{t("edit")}</button>
					<button className="new-theme-gray-button" onClick={() => setIsEditing(!isEditing)}>{t("cancel")}</button>
				</div>
			)}
			<label className="text-sm text-gray-500 dark:text-gray-400 mt-3">{t("answer")}:</label>
			<div className="text-gray-800 dark:text-gray-200">
				{inputType} 
				{question?.type === 'checkbox' && <p>{isChecked ? "True" : "False"}</p>}
			</div>
		</div>
	)
}

export default Question
