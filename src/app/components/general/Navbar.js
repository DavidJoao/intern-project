'use client'
import React from 'react'
import { logoutUser } from '@/app/actions/session'
import Link from 'next/link'
import { useTranslation } from "react-i18next";
import { useAppContext } from '../context/provider';
import { CiLogout, CiUser, CiSettings, CiSun } from "react-icons/ci";
import { MdOutlineDashboard, MdLanguage } from "react-icons/md";
import { GoMoon } from "react-icons/go";
import { icons } from '@/app/lib/icons';

const Navbar = ({ session }) => {

    const { toggleTheme, theme } = useAppContext()
    const { t, i18n } = useTranslation('common');

    const changeLanguage = async (lng) => {
        await i18n.changeLanguage(lng);
    }

    return (
        <>
            <div className='w-screen h-[50px] flex flex-row-reverse items-center p-3 gap-3 fixed shadow-lg dark:text-white'>
                {session ? (
                    <>
                    <button className='flex flex-col items-center text-md' onClick={() => logoutUser()}><CiLogout/>Logout</button>
                    <Link className='flex flex-col items-center text-md' href={'/pages/profile'}><CiUser /> Profile</Link>
                    <Link className='flex flex-col items-center text-md' href={'/pages/home'}><MdOutlineDashboard />Dashboard</Link>
                    <Link className='flex flex-col items-center text-md' href={'/pages/settings'}><CiSettings /> Settings</Link>
                    <div className='flex flex-col items-center text-md'>
                        <MdLanguage />
                        <select className='bg-none text-black bg-slate-100/0 rounded' onChange={(e) => changeLanguage(e.target.value)}>
                            <option value={'en'}>EN</option>
                            <option value={'es'}>ES</option>
                        </select>
                    </div>
                    { theme === 'dark' ? (
                        <button className="" onClick={() => toggleTheme()}><CiSun /></button>
                    ) : (
                        <button className="" onClick={() => toggleTheme()}><GoMoon /></button>
                    ) }
                    <form className='h-auto w-auto flex flex-row items-center justify-center gap-2 p-5 mx-auto'>
					    <input className='input' placeholder={t("search-template")}/>
					    <button>{icons.search}</button>
				    </form>
                </>
                ) : (
                    <>
                    <div className='flex flex-col items-center text-md'>
                        <MdLanguage />
                        <select className='bg-none text-black bg-slate' onChange={(e) => changeLanguage(e.target.value)}>
                            <option value={'en'}>EN</option>
                            <option value={'es'}>ES</option>
                        </select>
                    </div>
                    { theme === 'dark' ? (
                        <button className="" onClick={() => toggleTheme()}><CiSun /></button>
                    ) : (
                        <button className="" onClick={() => toggleTheme()}><GoMoon /></button>
                    ) }
                    </>
            )}
            </div>
        </>
  )
}

export default Navbar