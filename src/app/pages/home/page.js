'use client'
import { logSession } from '@/app/actions/session'
import Loading from '@/app/components/general/Loading'
import CreateTemplate from '@/app/components/templates/CreateTemplate'
import ExploreTemplates from '@/app/components/templates/ExploreTemplates'
import { useAuth } from '@/app/hooks/useAuth'
import { navigate } from '@/app/lib/redirect'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

const Home = () => {

	const [session, setSession] = useState(null)
	const [isLoading, setIsLoading] = useState(true);
	
	const user = useAuth();
	const { t } = useTranslation('common');

    useEffect(() => {
        if (!session && user) {
            fetchSession();
        } else {
            setIsLoading(false);
        }
    }, [user, session]);

    const fetchSession = async () => {
		setIsLoading(true)
        const sessionData = await logSession();
        setSession(sessionData);
        if (sessionData) setIsLoading(false);
    }

  return (
	<div className="w-screen min-h-screen h-auto flex flex-col pt-[50px] bg-slate-200 dark:bg-gray-700 scroll-smooth">
		{isLoading ? (
			<Loading />
		) : user && session ? (
			<div className="h-full flex flex-col items-center justify-center p-3 gap-6">
				<ExploreTemplates />
				<CreateTemplate userId={user.user.id} />
			</div>
		) : (
			<div className="h-full flex flex-col items-center justify-center p-3 gap-6">
				<Link className='new-theme-button' href={'/pages/login'}>Login</Link>
				<ExploreTemplates />
			</div>
		)}
	</div>
  )
}

export default Home