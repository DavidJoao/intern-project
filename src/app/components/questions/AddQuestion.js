'use client'
import { createQuestion } from '@/app/actions/questions'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'

const AddQuestion = ({ template, loadQuestions }) => {

    const [isDisplayed, setIsDisplayed] = useState(true)
    const [selection, setSelection] = useState("choose")
    const { register, setValue, reset, handleSubmit, formState: { errors } } = useForm();

    useEffect(() => {
        setValue("templateId", template?.id)
    }, [])

    const submitForm = async (data) => {
        await createQuestion(data);
        await loadQuestions(template?.id);
        reset();
    }

    return (
    <div className='p-2'>
        <form className='p-1 flex flex-col gap-1 w-[250px]' onSubmit={handleSubmit(submitForm)}>
            <label className='font-bold'>Question Type</label>
            <select className='input' onChange={(e) => {
                setSelection(e.target.value)
                setValue("type", e.target.value)
                }}>
                <option value="choose">Choose Option</option>
                <option value="text">Single Line</option>
                <option value="multi_line">Multiple Line</option>
                <option value="checkbox">Checkbox</option>
                <option value="integer">Number</option>
            </select>
            <label className='font-bold'>Question Title:</label>
            <input required className='input' {...register("title")}/>
            <label className='font-bold'>Description:</label>
            <textarea required className='input resize-none' {...register("description")} />
            <div className='flex flex-row gap-2 justify-evenly'>
                <label className='font-bold'>Display In Form?</label>
                <input type='checkbox' defaultChecked={true} onChange={(e) => setIsDisplayed(e.target.checked)} {...register("displayInResults")}/>
                <p>{ isDisplayed ? 'Yes' : 'No' }</p>
            </div>
            { selection === 'choose' ? (
                <></>
            ) : (
                <button type='submit' className='blue-button mx-auto'>Add Question</button>
            ) }
        </form>
    </div>
  )
}

export default AddQuestion