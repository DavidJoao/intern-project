'use client'
import Loading from '@/app/components/general/Loading'
import CreateTemplate from '@/app/components/templates/CreateTemplate'
import ExploreTemplates from '@/app/components/templates/ExploreTemplates'
import { useAuth } from '@/app/hooks/useAuth'
import { icons } from '@/app/lib/icons'
import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'

const Home = () => {

  const user = useAuth();
  const { t } = useTranslation('common');

  return (
		<>
			{user ? (
				<div className="w-screen h-screen flex flex-col pt-[50px] bg-slate-200">
					<div className="h-[90%] flex flex-row">
						<div className="h-full w-full md:w-[70%] flex flex-col items-center p-3">
							<p className="font-bold">{t("explore-templates")}</p>
							<ExploreTemplates />
						</div>
						<CreateTemplate userId={user.user.id} />
					</div>
				</div>
			) : (
				<Loading />
			)}
		</>
  )
}

export default Home