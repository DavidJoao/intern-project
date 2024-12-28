import React from 'react'
import ReactTimeago from 'react-timeago'
import Answer from './Answer';
import { FaTrash } from 'react-icons/fa';
import { deleteFormById } from '@/app/actions/forms';
import { useTranslation } from 'react-i18next';

const Form = ( {form, getForms } ) => {

    const { t } = useTranslation("common")

    const handleDelete = async (e) => {
        e.preventDefault();
        await deleteFormById(form?.id)
        await getForms();
    }

    return (
    <div className='form'>
        <div className='p-2 flex flex-row items-center justify-between'>
            <p className='italic'><ReactTimeago date={form?.createdAt}/> {t("by")} {form?.user?.name} | {new Date(form?.createdAt).toLocaleDateString()}</p>
            <button className='new-theme-red-button' onClick={handleDelete}><FaTrash/></button>
        </div>
        <div className='p-2 flex flex-col gap-2'>
            { form.answers && form.answers.map((answer, index) => {
                return (
                    <Answer key={index} answer={answer} getForms={getForms} form={form} />
                )
            }) }
        </div>
    </div>
  )
}

export default Form