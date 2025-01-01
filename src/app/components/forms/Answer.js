'use client'
import { deleteAnswerById, editAnswerById } from "@/app/actions/forms"
import React, { useState } from "react"
import { useTranslation } from "react-i18next"
import { FaTrash } from "react-icons/fa"
import { MdModeEditOutline } from "react-icons/md"
import RoleBasedComponent from "../general/RoleBasedComponent"
import { useAuth } from "@/app/hooks/useAuth"


const Answer = ({ answer, form, getForms }) => {

    const { t } = useTranslation("common")
    const user = useAuth();

    const [isEditing, setIsEditing] = useState(false)
    const [editValue, setEditValue] = useState(answer?.value)

    const handleEdit = async (e) => {
        e.preventDefault()
        await editAnswerById(answer?.id, editValue)
        await getForms()
        setEditValue(answer.value)
        setIsEditing(false)
    }

    const handleDelete = async (e) => {
        e.preventDefault();
        await deleteAnswerById(answer?.id)
        await getForms();
    }

	return (
		<div className="answer">
			<div className="p-2 flex flex-row items-center justify-between">
                <label className="font-bold">{answer?.question?.title}</label>
				<div className="flex flex-row gap-2">
					<button className="text-blue-500" onClick={() => {
                        setIsEditing(!isEditing)
                        setEditValue(answer?.value)
                        }}> <MdModeEditOutline /> </button>
                    <RoleBasedComponent condition={(user) => user?.role === 'admin'} user={user?.user}>
                        <button className="new-theme-red-button" onClick={handleDelete}><FaTrash /></button>
                    </RoleBasedComponent>    
				</div>
			</div>
			<label>{t("question")}: {answer?.question?.description}</label>
			<p>{t("answer")}:</p>
            { isEditing ? (
                <>
                { answer.value === true || answer.value === false ? (
                    <select value={editValue} className="input dark:text-black" onChange={(e) => setEditValue(e.target.value)}>
                        <option>true</option>
                        <option>false</option>
                    </select>
                ) : (
                    <input value={editValue} className="input dark:text-black"  onChange={(e) => setEditValue(e.target.value)}/>
                )
                }
                <button className="blue-button w-auto" onClick={handleEdit}>{t("edit")}</button>
                <button className="bg-slate-500 text-white rounded font-bold p-1" onClick={() => setIsEditing(false)}>{t("cancel")}</button>
                </>
            ) : (
                <p className="italic">{answer?.value.toString()}</p>
            ) }
		</div>
	)
}

export default Answer
