'use client'
import React, { useState, useEffect } from 'react'
import { deleteTemplateById, getTemplateById, updateTemplateById } from '@/app/actions/templates'
import Loading from '@/app/components/general/Loading'
import { fetchTopics } from '@/app/actions/templates'
import { useAppContext } from '@/app/components/context/provider'
import RoleBasedComponent from '@/app/components/general/RoleBasedComponent'
import { useAuth } from '@/app/hooks/useAuth'
import Link from 'next/link'
import { navigate } from '@/app/lib/redirect'

const TemplateSettings = (context) => {

    const { id } = context.params
    const user = useAuth();
    const { loadAllTemplates } = useAppContext();

    const initialEditContent = {
        title: "",
        description: "",
        topic: "",
        isPublic: null
    }
    
    const [template, setTemplate] = useState(null)
    const [topics, setTopics] = useState([])
    const [editContent, setEditContent] = useState(initialEditContent)
    const [successMessage, setSuccessMessage] = useState("")
    
    useEffect(() => {
        initiateTemplate();
      }, [])

      const initiateTemplate = async () => {
        if (id) {
          const { data } = await getTemplateById(id);
          setTemplate(data.foundTemplate);
          setEditContent({ title: data.foundTemplate.title, description: data.foundTemplate.description, topic: data.foundTemplate.topic, isPublic: data.foundTemplate.isPublic })
        }
      }

      useEffect(() => {
        const initiateTopics = async () => {
            const { data } = await fetchTopics();
            setTopics(Object.keys(data.topics))
        }
        initiateTopics()
    }, [])

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditContent({
            ...editContent,
            [name]: value
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSuccessMessage("")
        await updateTemplateById(id, editContent);
        await initiateTemplate();
        await loadAllTemplates();
        setSuccessMessage("Template Updated Successfully!")
        setTimeout(() => {
            setSuccessMessage("")
        }, 3000)
    }

    const deleteTemplate = async (e) => {
        e.preventDefault();
        await deleteTemplateById(id)
        await loadAllTemplates();
        await navigate('/pages/home')
    }

    return (
    <>
    {template ? (
        <RoleBasedComponent condition={(user) => user?.role === 'admin' || user?.id === template.creatorId} user={user?.user}>
        <div className="general-bg min-h-screen flex flex-col pt-[50px]">
            <form className='p-2 flex flex-col gap-2 items-center' onSubmit={handleSubmit}>
                <label>Title:</label>
                <input name='title' className='dark-input w-[200px]' value={editContent.title} onChange={handleChange}/>
                <label>Description:</label>
                <textarea name='description' className='dark-input w-[200px] resize-none' value={editContent.description} onChange={handleChange}/>
                <label>Topic:</label>
                <select name='topic' className='dark-input w-[200px]' value={editContent.topic} onChange={handleChange}>
                { topics?.map((topic, index) => {
                        return (
                            <option key={index}>{topic}</option>
                        )
                    })}
                </select>
                <label>Public?</label>
                <select className='dark-input w-[200px]' value={editContent.isPublic} onChange={handleChange}>
                    <option>Choose Option</option>
                    <option value={true}>True</option>
                    <option value={false}>False</option>
                </select>
                <button type='submit' className='new-theme-button'>Submit Changes</button>
                <button className='p-2 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600' onClick={deleteTemplate}>Delete</button>
                <Link href={`/pages/template/${id}`} className='new-theme-gray-button'>Go to template</Link>
                <p className='font-bold text-green-600'>{successMessage}</p>
            </form>
        </div>
        </RoleBasedComponent>
    ) : (
        <Loading />
    )}
    </>
    
  )
}

export default TemplateSettings