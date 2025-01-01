'use client'
import { fetchFormsByTemplateId, fetchFormsByUserAndTemplate } from '@/app/actions/forms';
import Form from '@/app/components/forms/Form';
import Loading from '@/app/components/general/Loading';
import React, { useEffect, useState } from 'react'
import { useAuth } from '@/app/hooks/useAuth';
import { getTemplateById } from '@/app/actions/templates';

const Forms = (context) => {

    const { id } = context.params
    const user = useAuth();

    const [forms, setForms] = useState(null);
    const [creatorId, setCreatorId] = useState(null)
    const [isLoading, setLoading] = useState(false)

    useEffect(() => {
        if (user?.user?.id) {
            fetchTemplateAndForms();
        }
    }, [id, user?.user?.id, user?.user?.role]);
    
    const fetchTemplateAndForms = async () => {
        try {
            setLoading(true);
            const { data: templateData } = await getTemplateById(id);
            const templateCreatorId = templateData?.foundTemplate?.creatorId;
            setCreatorId(templateCreatorId);

            if (user?.user?.role === 'admin' || templateCreatorId === user?.user?.id) {
                const { data: formsData } = await fetchFormsByTemplateId(id);
                setForms(formsData?.forms || []);
            } else {
                const { data: formsData } = await fetchFormsByUserAndTemplate(id, user?.user?.id);
                setForms(formsData?.forms || []);
            }
        } catch (err) {
            setError(err.message || 'Failed to load data');
        } finally {
            setLoading(false);
        }
    };

    if (isLoading) return <Loading />;
    
    return (
    <div className='general-bg flex flex-col gap-5 pt-[50px] p-5 min-h-screen'>
        { forms && forms.map((form, index) => {
            return (
                <Form key={index} form={form} getForms={fetchTemplateAndForms} />
            )
        })}
    </div>
  )
}

export default Forms