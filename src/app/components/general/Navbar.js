'use client'
import React from 'react'
import { logoutUser } from '@/app/actions/session'
import Link from 'next/link'
import { useTranslation } from "react-i18next";
import { useAppContext } from '../context/provider';

const Navbar = ({ session }) => {

    const { toggleTheme } = useAppContext()
    const { t, i18n } = useTranslation('common');

    const changeLanguage = async (lng) => {
        await i18n.changeLanguage(lng);
    }

    return (
        <>
            <div className='w-screen h-[50px] flex flex-row-reverse items-center p-3 gap-3 fixed shadow-lg'>
                {session ? (
                    <>
                    <button onClick={() => logoutUser()}>Logout</button>
                    <Link href={'/pages/profile'}>Profle</Link>
                    <Link href={'/pages/home'}>Dashboard</Link>
                    <Link href={'/pages/settings'}>Settings</Link>
                    <button onClick={() => changeLanguage('en')}>English</button>
                    <button onClick={() => changeLanguage('es')}>Spanish</button>
                    <button className="" onClick={() => toggleTheme()}>Toggle</button>
                </>
                ) : (
                    <>
                    <button onClick={() => changeLanguage('en')}>English</button>
                    <button onClick={() => changeLanguage('es')}>Spanish</button>
                    <button className="" onClick={() => toggleTheme()}>Toggle</button>
                    </>
            )}
            </div>
        </>
  )
}

export default Navbar