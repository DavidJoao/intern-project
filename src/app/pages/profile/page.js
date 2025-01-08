'use client'
import React, { useEffect, useState, useCallback, useRef } from 'react'
import { useAuth } from '@/app/hooks/useAuth';
import Loading from '@/app/components/general/Loading';
import { getTemplatesByUserId, updateTemplatesOrderAPI } from '@/app/actions/templates';
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import DraggableTemplate from '@/app/components/templates/DraggableTemplate';

const Profile = () => {

	const user = useAuth()
    
	const [templates, setTemplates] = useState(null)

	useEffect(() => {
        if (user?.user?.id) {
            loadMyTemplates();
        }
	}, [user])

	const loadMyTemplates = async () => {
		const { data } = await getTemplatesByUserId(user?.user?.id)
		setTemplates(data?.templates)
	}

    const moveTemplate = useCallback((dragIndex, hoverIndex) => {
        const updatedTemplates = [...templates];
        const [draggedItem] = updatedTemplates.splice(dragIndex, 1);
        updatedTemplates.splice(hoverIndex, 0, draggedItem);
        setTemplates(updatedTemplates);
    
        updateTemplatesOrder(updatedTemplates);
      }, [templates, setTemplates]);

    const updateTemplatesOrder = async (templates) => {
        const orderedTemplates = templates?.map((question, index) => ({
          id: question.id,
          order: index,
        }));
    
        try {
          await updateTemplatesOrderAPI({templates: orderedTemplates})
        } catch (error) {
          console.log(error)
          console.error("Error updating order:", error);
        }
      };

	return (
    <div className='pt-[50px] p-5 w-screen min-h-screen h-auto dark:bg-gray-700'> {user && templates ? 
      <>
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
      </>
    : <Loading />}
    </div>)
}

export default Profile