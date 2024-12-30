import { icons } from '@/app/lib/icons'
import React from 'react'
import { useTranslation } from 'react-i18next'

const Loading = () => {
  const { t } = useTranslation("common")
  return (
    <div className='flex flex-col items-center justify-center w-screen h-screen text-center general-bg gap-3'>
        <p className='text-center text-2xl font-semibold'>{t("loading")}</p>
        <p className='text-[100px] dark:text-white'>{icons.loading}</p>
    </div>
  )
}

export default Loading