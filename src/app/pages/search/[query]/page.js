'use client'
import { searchTemplateAPI } from '@/app/actions/templates';
import TemplateThumbnail from '@/app/components/templates/TemplateThumbnail';
import React, { useEffect, useState } from 'react'
import { icons } from '@/app/lib/icons';

const SearchQuery = (context) => {

    const { query } = context.params;

    const [templates, setTemplates] = useState(null)

    useEffect(() => {
        fetchSearch();
    }, [])

    const fetchSearch = async (e) => {
        const { data } = await searchTemplateAPI(query);
        setTemplates(data?.templates)
    }

    return (
    <div className='pt-[50px] min-h-screen general-bg p-3 h-auto'>
        <p>Showing Results for: {query}</p>
        <div className=' grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6 p-3'>
        { templates ? (
            <>
            { templates.map((template, index) => {
                return (
                    <TemplateThumbnail key={index} index={index} template={template} />
                )
            }) }
            </>
        ) : (
            <p>{icons.loading}</p>
        ) }
        { templates?.length === 0 && <p>No templates including {query} found</p> }
        </div>
    </div>
  )
}

export default SearchQuery