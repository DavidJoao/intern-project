'use client'
import Loading from '@/app/components/general/Loading'
import CreateTemplate from '@/app/components/templates/CreateTemplate'
import ExploreTemplates from '@/app/components/templates/ExploreTemplates'
import { useAuth } from '@/app/hooks/useAuth'
import Link from 'next/link'
import React from 'react'
import { useTranslation } from 'react-i18next'

const Home = () => {

  const user = useAuth();
  const { t } = useTranslation('common');

  return (
		<>
			{user ? (
				<div className="w-screen min-h-screen h-auto flex flex-col pt-[50px] bg-slate-200 dark:bg-gray-700 scroll-smooth">
					<Link href={'#create-template'} className='new-theme-button fixed sm:hidden top-16 right-5 z-100'>Create Template</Link>
					<div className="h-full flex flex-col md:flex-row items-stretch justify-center p-3 gap-6">
						<ExploreTemplates />
						<CreateTemplate userId={user.user.id}/>
					</div>
				</div>
			) : (
				<Loading />
			)}
		</>
  )
}

export default Home