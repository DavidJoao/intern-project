'use client'
import { createQuestion } from '@/app/actions/questions'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import ReactMarkdown from 'react-markdown'

const AddQuestion = ({ template, loadQuestions }) => {

    const { t } = useTranslation("common")
    const [isDisplayed, setIsDisplayed] = useState(true)
    const [selection, setSelection] = useState("choose")
    const [previewMarkdown, setPreviewMarkdown] = useState("");
    const { register, setValue, reset, handleSubmit, formState: { errors } } = useForm();

    useEffect(() => {
        setValue("templateId", template?.id)
    }, [])

    const submitForm = async (data) => {
        await createQuestion(data);
        await loadQuestions(template?.id);
        reset();
        setValue("templateId", template?.id)
        setPreviewMarkdown("");
    }

    return (
    <div className='p-2'>
        <form className='p-1 flex flex-col gap-1 w-[250px]' onSubmit={handleSubmit(submitForm)}>
            <label className='font-bold text-center'>{t("add-question")}</label>
            <label className='font-bold'>{t("question-type")}</label>
            <select className='dark-input' onChange={(e) => {
                setSelection(e.target.value)
                setValue("type", e.target.value)
                }}>
                <option value="choose">{t("choose-option")}</option>
                <option value="text">{t("single-line")}</option>
                <option value="multi_line">{t("multiline")}</option>
                <option value="checkbox">Checkbox</option>
                <option value="integer">{t("number")}</option>
            </select>
            <label className='font-bold'>{t("question-title")}:</label>
            <input required className='dark-input' {...register("title")}/>
            <label className='font-bold'>{t("template-description")}:</label>
            <textarea required className='dark-input resize-none' {...register("description")} onChange={(e) => setPreviewMarkdown(e.target.value)}/>
            <div className="markdown-preview mt-2">
                <label className="font-bold">{t("preview")}:</label>
                <div className="border p-2 rounded dark:bg-gray-800">
                    <ReactMarkdown>{previewMarkdown}</ReactMarkdown>
                </div>
            </div>
            <div className='flex flex-row gap-2 justify-evenly'>
                <label className='font-bold'>{t("display-in-form")}?</label>
                <input type='checkbox' defaultChecked={true} onChange={(e) => setIsDisplayed(e.target.checked)} {...register("displayInResults")}/>
            </div>
            { selection === 'choose' ? (
                <></>
            ) : (
                <button type='submit' className='blue-button mx-auto'>{t("add-question")}</button>
            ) }
        </form>
    </div>
  )
}

export default AddQuestion