'use client'
import { fetchFormsByTemplateId } from '@/app/actions/forms';
import Form from '@/app/components/forms/Form';
import Loading from '@/app/components/general/Loading';
import React, { useEffect, useState } from 'react'
import { navigate } from '@/app/lib/redirect';
import { useAuth } from '@/app/hooks/useAuth';
import { getTemplateById } from '@/app/actions/templates';

const Forms = (context) => {

    const { id } = context.params
    const user = useAuth();

    const [forms, setForms] = useState(null);
    const [creatorId, setCreatorId] = useState(null)

    useEffect(() => {
        getForms();
        getTemplate();
    }, [])

    useEffect(() => {
        if (user && creatorId) {
            if (user?.user?.role !== 'admin' || creatorId !== user?.user?.id) {
                navigate(`/pages/template/${id}`)
            }
        }
    }, [user, creatorId])

    const getForms = async (e) => {
        const { data } = await fetchFormsByTemplateId(id)
        setForms(data?.forms)
    }

    const getTemplate = async () => {
        const {data} = await getTemplateById(id)
        setCreatorId(data?.foundTemplate?.creatorId)
    }

    return (
    <>
    { forms ? (
    <div className='general-bg flex flex-col gap-5 pt-[50px] p-5 min-h-screen'>
        { forms && forms.map((form, index) => {
            return (
                <Form key={index} form={form} getForms={getForms} />
            )
        })}
    </div>
    ) : (
        <Loading />
    ) }
    </>
  )
}

export default Forms