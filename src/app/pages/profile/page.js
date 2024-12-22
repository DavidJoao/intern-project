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
    <> {user && templates ? 
    <DndProvider backend={HTML5Backend}>
    <div className='border-[1px] border-black pt-[50px] w-screen h-screen'>
        <div className='border-[1px] border-red-500 p-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-8 gap-2'>
        { templates?.map((template, index) => {
            return (
                <DraggableTemplate key={index} template={template} index={index} moveTemplate={moveTemplate}/>
            )
        }) }
        </div>
    </div> 
    </DndProvider>
    : <Loading />}
    </>)
}

export default Profile