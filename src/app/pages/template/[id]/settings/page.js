'use client'
import React, { useState, useEffect } from 'react'
import { addAllowedUserAPI, deleteTemplateById, getMatchingEmailsAPI, getTemplateById, removeAllowedUserAPI, updateTemplateById } from '@/app/actions/templates'
import Loading from '@/app/components/general/Loading'
import { fetchTopics } from '@/app/actions/templates'
import { useAppContext } from '@/app/components/context/provider'
import { useAuth } from '@/app/hooks/useAuth'
import Link from 'next/link'
import { navigate } from '@/app/lib/redirect'
import { useTranslation } from 'react-i18next'
import { FaTrash } from 'react-icons/fa'
import dynamic from 'next/dynamic';

const TemplateSettings = (context) => {

    const RoleBasedComponent = dynamic(() => import("@/app/components/general/RoleBasedComponent"), {
        loading: () => <Loading />
    })

    const { id } = context.params
    const { t } = useTranslation("common")
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
    const [userEmail, setUserEmail] = useState("")
    const [matchingEmails, setMatchingEmails] = useState([]); 

    useEffect(() => {
        const fetchEmails = async () => {
            if (userEmail.trim() === '') {
                setMatchingEmails([]);
                return;
            }
    
            try {
                const { data } = await getMatchingEmailsAPI(userEmail);
                setMatchingEmails(data.emails || []);
            } catch (error) {
                console.log("Error fetching emails:", error);
                setMatchingEmails([]);
            }
        };
    
        fetchEmails();
    }, [userEmail]);
    
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
            [name]: name === 'isPublic' ? value === 'true' : value
        });
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

    const addUser = async (email) => {
        await addAllowedUserAPI(email, id);
        await initiateTemplate();
        setUserEmail("");
    };

    const removeUser = async (e, email) => {
        e.preventDefault();
        await removeAllowedUserAPI(email, id)
        await initiateTemplate();
    }

    const handleSelectEmail = async (email) => {
        await addUser(email);
        setMatchingEmails([]);
    };

    return (
    <>
        <RoleBasedComponent condition={(user) => user?.role === 'admin' || user?.id === template.creatorId} user={user?.user}>
        <div className="general-bg min-h-screen flex flex-col pt-[50px]">
            <form className='p-2 flex flex-col gap-2 items-center' onSubmit={handleSubmit}>
                <label>{t("title")}:</label>
                <input name='title' className='dark-input w-[200px]' value={editContent.title} onChange={handleChange}/>
                <label>{t("template-description")}:</label>
                <textarea name='description' className='dark-input w-[200px] resize-none' value={editContent.description} onChange={handleChange}/>
                <label>{t("topic")}:</label>
                <select name='topic' className='dark-input w-[200px]' value={editContent.topic} onChange={handleChange}>
                { topics?.map((topic, index) => {
                        return (
                            <option key={index}>{topic}</option>
                        )
                    })}
                </select>
                <label>Public?</label>
                <select name='isPublic' className='dark-input w-[200px]' value={editContent.isPublic} onChange={handleChange}>
                    <option>{t("choose-option")}</option>
                    <option value={true}>True</option>
                    <option value={false}>False</option>
                </select>
                { !template?.isPublic && (
                    <>
                    <p>{t("allowed-users")}</p>
                    <div className='flex flex-col gap-2 items-center justify-center m-5'>
                        { template?.allowedUsers ? (
                            template.allowedUsers.map((user, index) => {
                                return (
                                    <div key={index} className='flex flex-row items-center justify-center gap-3 new-theme-button'>
                                        <p>{user}</p>
                                        <button className='new-theme-red-button' onClick={async (e) => {
                                            await removeUser(e, user)
                                        }}><FaTrash /></button>
                                    </div>
                                )
                            })
                        ) : (
                            <p>No Users Selected</p>   
                        )}
                        <input className='dark-input w-[200px]' value={userEmail} onChange={(e) => setUserEmail(e.target.value)} />
                        {Array.isArray(matchingEmails) && matchingEmails.length > 0 && (
                            <ul className='flex flex-col gap-1'>
                                {matchingEmails.map((email, index) => (
                                    <li key={index} onClick={() => handleSelectEmail(email)} className='new-theme-gray-button cursor-pointer'> {email} </li>
                                ))}
                            </ul>
                        )}
                    </div>
                    </>
                ) }
                <button type='submit' className='new-theme-button w-[150px]'>{t("submit-changes")}</button>
                <button className='new-theme-red-button w-[150px]' onClick={deleteTemplate}>{t("delete")}</button>
                <Link href={`/pages/template/${id}`} className='new-theme-gray-button w-[150px] text-center'>{t("goto-template")}</Link>
                <p className='font-bold text-green-600'>{successMessage}</p>
            </form>
        </div>
        </RoleBasedComponent>
    </>
    
  )
}

export default TemplateSettings