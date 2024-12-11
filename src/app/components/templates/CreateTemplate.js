'use client'
import React, { useEffect, useState } from 'react'
import { Prisma } from '@prisma/client';
import { useTranslation } from 'react-i18next'
import { fetchTopics } from '@/app/actions/templates';

const CreateTemplate = () => {

    const { t } = useTranslation('common');

    const [topics, setTopics] = useState([])
    const [initialQuestions, setInitialQuestions] = useState([])

    useEffect(() => {
        const initiateTopics = async () => {
            const { data } = await fetchTopics();
            setTopics(Object.keys(data.topics))
        }
        initiateTopics()
    }, [])

  return (
    <div className='border-[1px] border-blue-400 h-full w-[30%] hidden md:flex flex-col items-center p-3'>
        <p className='font-bold'>{t("create-template")}</p>
        <form className='border-[1px] border-green-500 w-full h-full p-3'>
            <div className='p-2'>
                <p className='text-xs text-gray-400'>Topic</p>
                <select className='input w-full'>
                    <option>Choose Topic</option>
                    { topics?.map((topic, index) => {
                        return (
                            <option key={index}>{topic}</option>
                        )
                    }) }
                    <option>Other Topic</option>
                </select>
            </div>

            <div className='p-2'>
                <p className='text-xs text-gray-400'>Other</p>
                <input className='input w-full'/>
            </div>
                    
            <div className='p-2'>
                <p className='text-xs text-gray-400'>Name</p>
                <input className='input w-full'/>
            </div>

            <div className='p-2'>
                <p className='text-xs text-gray-400'>Description</p>
                <textarea className='input w-full resize-none'/>
            </div>

            <div className='p-2'>
                <p className='text-xs text-gray-400'>Image</p>
                <input type='file' className='input w-full'/>
            </div>

            <div className='p-2'>
                <p className='text-xs text-gray-400'>Question #1</p>
                <input className='input w-full'/>
                <p className='text-xs text-gray-400'>Type</p>
                <select className='input w-full'>
                    <option>Select Type</option>
                    <option>Text</option>
                    <option>Multiple Choice</option>
                    <option>Number</option>
                </select>
                
            </div>

            
        </form>
    </div>
  )
}

export default CreateTemplate