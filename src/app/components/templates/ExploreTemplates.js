'use client'
import React, { useEffect, useState } from 'react'
import { useAppContext } from '../context/provider'
import TemplateThumbnail from './TemplateThumbnail';
import { fetchTopTemplates } from '@/app/actions/templates';
import { useTranslation } from 'react-i18next';


const ExploreTemplates = () => {
	const { templates } = useAppContext()
    const { t } = useTranslation('common');
	const [topTemplates, setTopTemplates] = useState(null)

	useEffect(() => {
		loadTopTemplates()
	}, [templates])

	const loadTopTemplates = async () => {
		const { data } = await fetchTopTemplates()
        console.log(data)
		setTopTemplates(data.topTemplates)
	}

	return (
        <div className="h-full min-h-full w-full md:w-[75%] flex flex-col items-center p-3">
            <p className='font-bold text-center text-lg dark:text-white'>{t("explore-templates")}</p>
            <div className="border-2 border-slate-200 dark:border-gray-600 rounded shadow-lg w-full h-full md:h-[550px] p-4 bg-white dark:bg-gray-800">
                <div className='w-full'>
                    <p className='font-bold mb-3 dark:text-white'>Top Five Templates</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-6 gap-4">
                        {topTemplates ? (
                            topTemplates.map((template, index) => {
                                return (
                                    <div key={index} className='rounded dark:bg-gray-700 p-2 flex flex-col items-center justify-center gap-1'>
                                        <TemplateThumbnail key={index} template={template} />
                                        <p className='text-center dark:text-white'>{template?._count?.forms} forms filled</p>
                                    </div>
                                )
                            })
                        ) : (
                            <p className='dark:text-white'>Loading Templates...</p>
                        )}
                    </div>
                </div>

                <div className="w-full mt-6">
                    <p className="font-bold mb-3 dark:text-white">All Templates</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-6 gap-4">
                        {templates ? (
                            templates.map((template, index) => {
                                return (
                                    <div key={index} className='rounded dark:bg-gray-700 p-2 flex flex-col items-center justify-center gap-1'>
                                        <TemplateThumbnail key={index} template={template} />
                                    </div>
                                )
                            })
                        ) : (
                            <p className='dark:text-white'>Loading Templates...</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
	)
}

export default ExploreTemplates