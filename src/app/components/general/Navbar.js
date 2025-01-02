'use client'
import React, { useState, useEffect } from 'react'
import { logoutUser } from '@/app/actions/session'
import Link from 'next/link'
import { useTranslation } from "react-i18next";
import { useAppContext } from '../context/provider';
import { CiLogout, CiUser, CiSettings, CiLight, CiMenuBurger } from "react-icons/ci";
import { FiSun } from "react-icons/fi";
import { MdOutlineDashboard, MdLanguage } from "react-icons/md";
import { GoMoon } from "react-icons/go";
import { icons } from '@/app/lib/icons';
import MobileNavMenu from './MobileNavMenu';
import { navigate } from '@/app/lib/redirect';
import { getMatchingTagsAPI } from '@/app/actions/templates';
import { useAuth } from '@/app/hooks/useAuth';

const Navbar = ({ session }) => {

    const user = useAuth();

    const { toggleTheme, theme } = useAppContext()
    const { t, i18n } = useTranslation('common');
    const [isOpen, setIsOpen] = useState(false)
    const [searchQuery, setSearchQuery] = useState("")
    const [matchingTags, setMatchingTags] = useState([]); 
    const [username, setUsername] = useState("")


    const changeLanguage = async (lng) => {
        await i18n.changeLanguage(lng);
    }

    const handleSearch = async (e, searchQuery) => {
        e.preventDefault();
        console.log(searchQuery)
        navigate(`/pages/search/${searchQuery}`)
        setSearchQuery("")
    }

    useEffect(() => {
        if (user?.user?.name) setUsername(user?.user?.name)
    }, [user])

    useEffect(() => {
        const fetchTags = async () => {
            if (searchQuery.trim() === '') {
                setMatchingTags([]);
                return;
            }
            try {
                const { data } = await getMatchingTagsAPI(searchQuery);
                console.log(data)
                setMatchingTags(data.tags || []);
            } catch (error) {
                console.log("Error fetching Tags:", error);
                setMatchingTags([]);
            }
        };
        fetchTags();
    }, [searchQuery]);


    return (
        <>
            <div className="w-screen h-[50px] hidden md:flex flex-row-reverse items-center p-3 gap-3 fixed top-0 left-0 z-[101] shadow-lg bg-white dark:bg-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700">
                {session ? (
                    <>
                    <button className='nav-button' onClick={() => logoutUser()}><CiLogout/>{t("logout")}</button>
                    <Link className='nav-button' href={'/pages/profile'}><CiUser />{t("profile")}</Link>
                    <Link className='nav-button' href={'/pages/home'}><MdOutlineDashboard />{t("dashboard")}</Link>
                    <Link className='nav-button' href={'/pages/settings'}><CiSettings />{t("settings")}</Link>
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
					    <input className="input w-full dark:bg-gray-700 dark:text-white dark:border-gray-600" placeholder={t("search-template")} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}/>
					    <button className='dark:text-gray-400' onClick={(e) => handleSearch(e, searchQuery)}>{icons.search}</button>
                        {Array.isArray(matchingTags) && matchingTags.length > 0 && searchQuery !== '' && (
                            <ul className="absolute top-full w-[200px] bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg shadow-lg z-50 p-1 flex flex-col gap-1">
                                <li className='new-theme-gray-button cursor-pointer' onClick={(e) => handleSearch(e, searchQuery)}>{searchQuery}...</li>
                                {matchingTags.map((tag, index) => (
                                    <li key={index} onClick={async (e) => {
                                        setSearchQuery(tag)
                                        await handleSearch(e, tag)

                                    }} className='new-theme-gray-button cursor-pointer'> {tag} </li>
                                ))}
                            </ul>
                        )}
				    </form>
                    <p>{username}</p>
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
                        <button className="" onClick={() => toggleTheme()}><FiSun /></button>
                    ) : (
                        <button className="" onClick={() => toggleTheme()}><GoMoon /></button>
                    ) }
                    </>
            )}
            </div>
            <div className='flex items-center justify-center md:hidden w-full fixed top-0 z-[101] bg-white dark:bg-gray-900'>
                <button className='theme-button w-full' onClick={() => setIsOpen(!isOpen)}><CiMenuBurger className='mx-auto'/></button>
                { theme === 'dark' ? (
                        <button className="theme-button text-center" onClick={() => toggleTheme()}><CiLight className='mx-auto'/></button>
                    ) : (
                        <button className="theme-button text-center" onClick={() => toggleTheme()}><GoMoon className='mx-auto'/></button>
                    ) }
            </div>
            <MobileNavMenu isOpen={isOpen} setIsOpen={setIsOpen} session={session}/>
        </>
  )
}

export default Navbar