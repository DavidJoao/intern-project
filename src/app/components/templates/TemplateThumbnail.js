import React from 'react'
import { navigate } from '@/app/lib/redirect'
import Image from 'next/image'
import Tooltip from '../general/Tooltip';
import ReactTimeago from 'react-timeago';
import { useAuth } from '@/app/hooks/useAuth';

const TemplateThumbnail = ({ template, index }) => {

  const user = useAuth();
  
  return (
    <button className='rounded p-3 flex flex-col items-center justify-center cursor-pointer dark:bg-gray-900 dark:hover:bg-gray-800 bg-slate-200 hover:bg-slate-100 transition-all shadow-md w-full h-full' onClick={() => {
      if (template.isPublic) {
        navigate(`/pages/template/${template.id}`);
      } else if (
        template.allowedUsers.includes(user?.user?.email) ||
        template?.creatorId === user?.user?.id ||
        user?.user?.role === 'admin'
      ) {
        navigate(`/pages/template/${template.id}`);
      }
    }}>
    <Tooltip text={template.description}>
        <div>
        <div className='flex justify-center items-center mb-2'>
        <Image className="rounded-md object-cover" alt='template' src={template.imageUrl} width={100} height={100} />
        </div>
            <p className="text-xs font-bold text-center dark:text-white text-black">{template.title}</p>
            <p className="text-xs font-bold text-center dark:text-white text-black"> by {template?.creator?.name}</p>
            <ReactTimeago className="text-xs text-gray-500 dark:text-gray-300 text-center" date={template.createdAt}/>
            {!template.isPublic && 
              user?.user?.role !== 'admin' && 
              user?.user?.id !== template?.creatorId && 
              !template.allowedUsers.includes(user?.user?.email) && (
                <p className='text-red-600 text-[10px]'>Not Allowed</p>
            )}
        </div>
    </Tooltip>
    </button>
  )
}

export default TemplateThumbnail