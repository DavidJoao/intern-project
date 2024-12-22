import React from 'react'
import { navigate } from '@/app/lib/redirect'
import Image from 'next/image'
import Tooltip from '../general/Tooltip';
import ReactTimeago from 'react-timeago';

const TemplateThumbnail = ({ template, index }) => {
  return (
    <Tooltip text={template.description}>
        <div className='border rounded bg-slate-200 hover:bg-slate-100 p-3 h-[150px] flex flex-col items-center justify-evenly cursor-pointer' onClick={() => navigate(`/pages/template/${template.id}`)}>
            <Image alt='template' src={template.imageUrl} width={100} height={100}/>
            <p>{template.title}</p>
            <ReactTimeago date={template.createdAt}/>
        </div>
    </Tooltip>
  )
}

export default TemplateThumbnail