'use client'
import React from 'react'
import { useAppContext } from '../context/provider'
import ReactTimeago from 'react-timeago';
import Image from 'next/image';
import { navigate } from '@/app/lib/redirect';
import Tooltip from '../general/Tooltip';


const ExploreTemplates = () => {

  const { templates } = useAppContext();

  return (
    <div className='border-[3px] border-slate-200 rounded shadow-lg w-full h-full p-3 bg-white grid grid-cols-6 gap-2 items-start'>
      { templates ? (
        templates.map((template, index) => {
          return (
            <Tooltip key={index} text={template.description}>
            <div key={index} className='border rounded bg-slate-200 hover:bg-slate-100 p-3 h-[150px] flex flex-col items-center justify-evenly' onClick={() => navigate(`/pages/template/${template.id}`)}>
              <Image src={template.imageUrl} width={100} height={100}/>
              <p>{template.title}</p>
              <ReactTimeago date={template.createdAt}/>
            </div>
            </Tooltip>
          )
        })
      ) : (
        <p>Loading Templates...</p>
      ) }
    </div>
  )
}

export default ExploreTemplates