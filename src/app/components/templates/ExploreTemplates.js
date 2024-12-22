'use client'
import React from 'react'
import { useAppContext } from '../context/provider'
import TemplateThumbnail from './TemplateThumbnail';


const ExploreTemplates = () => {

  const { templates } = useAppContext();

  return (
    <div className='border-[3px] border-slate-200 rounded shadow-lg w-full h-full p-3 bg-white grid grid-cols-6 gap-2 items-start'>
      { templates ? (
        templates.map((template, index) => {
          return (
            <TemplateThumbnail key={index} template={template}  />
          )
        })
      ) : (
        <p>Loading Templates...</p>
      ) }
    </div>
  )
}

export default ExploreTemplates