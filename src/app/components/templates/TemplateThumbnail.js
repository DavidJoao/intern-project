import React from 'react'
import { navigate } from '@/app/lib/redirect'
import Image from 'next/image'
import Tooltip from '../general/Tooltip';
import ReactTimeago from 'react-timeago';

const TemplateThumbnail = ({ template, index }) => {
  return (
    <Tooltip text={template.description}>
        <div className='rounded p-3 flex flex-col items-center justify-center cursor-pointer dark:bg-gray-900 dark:hover:bg-gray-800 bg-slate-200 hover:bg-slate-100 transition-all shadow-md w-full h-full' onClick={() => navigate(`/pages/template/${template.id}`)}>
        <div className='flex justify-center items-center mb-2'>
            <Image className="rounded-md object-cover" alt='template' src={template.imageUrl} width={100} height={100} />
        </div>
            <p className="text-xs font-bold text-center dark:text-white text-black">{template.title}</p>
            <ReactTimeago className="text-xs text-gray-500 dark:text-gray-300 text-center" date={template.createdAt}/>
        </div>
    </Tooltip>
  )
}

export default TemplateThumbnail