'use client'
import React, { useEffect, useState, useCallback, useRef } from 'react'
import { useAuth } from '@/app/hooks/useAuth';
import Loading from '@/app/components/general/Loading';
import { getTemplatesByUserId, updateTemplatesOrderAPI } from '@/app/actions/templates';
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import DraggableTemplate from '@/app/components/templates/DraggableTemplate';
import Link from 'next/link';
import { deleteApiToken, generateApiToken, resetApiToken, retreiveApiToken } from '@/app/actions/user';

const Profile = () => {

	const user = useAuth()
    
	const [templates, setTemplates] = useState(null)
    const [userToken, setUserToken] = useState(null)

	useEffect(() => {
		if (user?.user?.id) {
			loadMyTemplates()
            retreiveToken()
		}
	}, [user])

    const retreiveToken = async () => {
        const response = await retreiveApiToken()
        if (response?.status === 404) {
            setUserToken(null)
        } else {
            setUserToken(response?.data?.token)
        }
    }

	const loadMyTemplates = async () => {
		const { data } = await getTemplatesByUserId(user?.user?.id)
		setTemplates(data?.templates)
	}

    const resetToken = async (e) => {
        e.preventDefault();
        const response = await resetApiToken(userToken?.token)
        if (response.status === 200) {
            setUserToken(response?.data?.token)
        }
    }

    const deleteToken = async (e) => {
        e.preventDefault();
        const response = await deleteApiToken(user?.user?.id)
        if (response.status === 200) {
            await retreiveToken();
        }
    }

	const moveTemplate = useCallback(
		(dragIndex, hoverIndex) => {
			const updatedTemplates = [...templates]
			const [draggedItem] = updatedTemplates.splice(dragIndex, 1)
			updatedTemplates.splice(hoverIndex, 0, draggedItem)
			setTemplates(updatedTemplates)

			updateTemplatesOrder(updatedTemplates)
		},
		[templates, setTemplates]
	)

	const updateTemplatesOrder = async templates => {
		const orderedTemplates = templates?.map((question, index) => ({
			id: question.id,
			order: index,
		}))

		try {
			await updateTemplatesOrderAPI({ templates: orderedTemplates })
		} catch (error) {
			console.log(error)
			console.error("Error updating order:", error)
		}
	}

	const handleTokenGeneration = async () => {
        await generateApiToken(user?.user?.id)
        await retreiveToken()
    }

    if (templates === null) return <Loading />

	return (
    <div className='w-screen min-h-screen h-auto flex flex-col pt-[50px] p-5 dark:bg-gray-700'>
      <div className='p-3 flex flex-col border-b'>
        <Link href={'/pages/salesforce'} className='new-theme-button m-1 w-full sm:w-[300px]'>Connect Account With Salesforce</Link>
      </div>

      <div className='p-3 flex flex-col gap-2 border-b'>
        { userToken !== null ? (
            <>
            <p className='break-words new-theme-gray-button w-full sm:w-[300px]'>Token: {userToken?.token}</p>
            <p className='new-theme-gray-button text-xs w-full sm:w-[300px]'>DO NOT SHARE YOUR TOKEN.</p>
            <button className='new-theme-button w-full sm:w-[300px]' onClick={(e) => resetToken(e)}>Reset Token</button>
            <button className='new-theme-red-button w-full sm:w-[300px]' onClick={(e) => deleteToken(e)}>Delete Token</button>
            </>
        ) : (
            <>
            <button className='new-theme-button w-full sm:w-[300px]' onClick={(e) => { handleTokenGeneration(e) }}>Generate API Token</button>
            <p className='text-xs dark:text-white'>Token can be used for retrieval of your templates data. DO NOT SHARE.</p>
            </>
        ) }
      </div>

        <h1 className='text-2xl m-2 dark:text-white'>My Templates</h1>
        <DndProvider backend={HTML5Backend}>
        <div className='w-full h-auto p-4 rounded bg-slate-100 dark:bg-gray-600 shadow-lg border dark:border-none'>
            <div className='p-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-8 gap-2 w-full'>
            { templates?.map((template, index) => {
                return (
                <DraggableTemplate key={index} template={template} index={index} moveTemplate={moveTemplate}/>
              )
          }) }
          </div>
      </div> 
      </DndProvider>
    </div>
    )
}

export default Profile