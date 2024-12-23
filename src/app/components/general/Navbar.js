'use client'
import React from 'react'
import { logoutUser } from '@/app/actions/session'
import Link from 'next/link'
import { useTranslation } from "react-i18next";
import { useAppContext } from '../context/provider';
import { CiLogout, CiUser, CiSettings, CiLight, CiSun } from "react-icons/ci";
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
            <div className="w-screen h-[50px] flex flex-row-reverse items-center p-3 gap-3 fixed top-0 left-0 z-[101] shadow-lg bg-white dark:bg-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700">
                {session ? (
                    <>
                    <button className='nav-button' onClick={() => logoutUser()}><CiLogout/>Logout</button>
                    <Link className='nav-button' href={'/pages/profile'}><CiUser /> Profile</Link>
                    <Link className='nav-button' href={'/pages/home'}><MdOutlineDashboard />Dashboard</Link>
                    <Link className='nav-button' href={'/pages/settings'}><CiSettings /> Settings</Link>
                    <div className='nav-button'>
                        <MdLanguage />
                        <select className="bg-transparent text-gray-700 dark:text-gray-300 rounded border border-gray-300 dark:border-gray-600 p-1 focus:outline-none focus:ring focus:ring-blue-300 dark:focus:ring-blue-700" onChange={(e) => changeLanguage(e.target.value)}>
                            <option value={'en'}>EN</option>
                            <option value={'es'}>ES</option>
                        </select>
                    </div>
                    { theme === 'dark' ? (
                        <button className="" onClick={() => toggleTheme()}><CiLight /></button>
                    ) : (
                        <button className="" onClick={() => toggleTheme()}><GoMoon /></button>
                    ) }
                    <form className='h-auto w-auto flex flex-row items-center justify-center gap-2 p-5 mx-auto'>
					    <input className="input w-full dark:bg-gray-700 dark:text-white dark:border-gray-600" placeholder={t("search-template")}/>
					    <button className='dark:text-gray-400'>{icons.search}</button>
				    </form>
                </>
                ) : (
                    <>
                    <div className='nav-button'>
                        <MdLanguage />
                        <select className="bg-transparent text-gray-700 dark:text-gray-300 rounded border border-gray-300 dark:border-gray-600 p-1 focus:outline-none focus:ring focus:ring-blue-300 dark:focus:ring-blue-700" onChange={(e) => changeLanguage(e.target.value)}>
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