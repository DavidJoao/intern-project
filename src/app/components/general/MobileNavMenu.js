import React from 'react'
import { CiLogout, CiUser, CiSettings, CiLight } from 'react-icons/ci'
import { GoMoon } from 'react-icons/go'
import { MdOutlineDashboard, MdLanguage } from 'react-icons/md'
import { useAppContext } from '../context/provider'
import { icons } from '@/app/lib/icons'
import Link from 'next/link'
import { useTranslation } from 'react-i18next'
import { logoutUser } from '@/app/actions/session'


const MobileNavMenu = ({ setIsOpen, isOpen, session}) => {
    const { t, i18n } = useTranslation('common');
    const { toggleTheme, theme } = useAppContext();
    const changeLanguage = async (lng) => {
        await i18n.changeLanguage(lng);
    }
    return (
        <>
        { session ? (
            <div className={`pt-[50px] p-3 ${ isOpen === true ? 'flex' : 'hidden' } md:hidden flex-col gap-2 items-center justify-center bg-white dark:bg-gray-800`}>
                <button className="nav-button border-b w-full p-2" onClick={() => logoutUser()}> <CiLogout />Logout </button>
                <Link className="nav-button border-b w-full p-2" href={"/pages/profile"}> <CiUser /> Profile </Link>
                <Link className="nav-button border-b w-full p-2" href={"/pages/home"}> <MdOutlineDashboard /> Dashboard </Link>
                <Link className="nav-button border-b w-full p-2" href={"/pages/settings"}> <CiSettings /> Settings </Link>
                <div className="nav-button border-b w-full p-2"> <MdLanguage />
                    <select
                        className="bg-transparent text-gray-700 dark:text-gray-300 rounded border border-gray-300 dark:border-gray-600 p-1 focus:outline-none focus:ring focus:ring-blue-300 dark:focus:ring-blue-700"
                        onChange={e => changeLanguage(e.target.value)}>
                        <option value={"en"}>EN</option>
                        <option value={"es"}>ES</option>
                    </select>
                </div>
                {theme === "dark" ? (
                    <button className="" onClick={() => toggleTheme()}>
                        <CiLight />
                    </button>
                ) : (
                    <button className="" onClick={() => toggleTheme()}>
                        <GoMoon />
                    </button>
                )}
                <form className="h-auto w-auto flex flex-row items-center justify-center gap-2 p-5 mx-auto">
                    <input
                        className="input w-full dark:bg-gray-700 dark:text-white dark:border-gray-600"
                        placeholder={t("search-template")}
                    />
                    <button className="dark:text-gray-400">{icons.search}</button>
                </form>
            </div>
        ) : (
            <div className={`pt-[50px] p-3 ${ isOpen === true ? 'flex' : 'hidden' } md:hidden flex-col gap-2 items-center justify-center bg-white dark:bg-gray-800`}>
                <div className="nav-button border-b w-full p-2"> <MdLanguage />
                    <select
                        className="bg-transparent text-gray-700 dark:text-gray-300 rounded border border-gray-300 dark:border-gray-600 p-1 focus:outline-none focus:ring focus:ring-blue-300 dark:focus:ring-blue-700"
                        onChange={e => changeLanguage(e.target.value)}>
                        <option value={"en"}>EN</option>
                        <option value={"es"}>ES</option>
                    </select>
                </div>
            </div>
            
        ) }
        </>
	)
}

export default MobileNavMenu