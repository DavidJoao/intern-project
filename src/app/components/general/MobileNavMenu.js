import React, { useEffect, useState } from 'react'
import { CiLogout, CiUser, CiSettings, CiLight } from 'react-icons/ci'
import { GoMoon } from 'react-icons/go'
import { MdOutlineDashboard, MdLanguage } from 'react-icons/md'
import { useAppContext } from '../context/provider'
import { icons } from '@/app/lib/icons'
import Link from 'next/link'
import { useTranslation } from 'react-i18next'
import { logoutUser } from '@/app/actions/session'
import { getMatchingTagsAPI } from '@/app/actions/templates'
import { navigate } from '@/app/lib/redirect'

const MobileNavMenu = ({ setIsOpen, isOpen, session}) => {
    const { t, i18n } = useTranslation('common');
    const { toggleTheme, theme } = useAppContext();
    const changeLanguage = async (lng) => {
        await i18n.changeLanguage(lng);
    }

    const [matchingTags, setMatchingTags] = useState([]); 
    const [searchQuery, setSearchQuery] = useState("")

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

    const handleSearch = async (e, searchQuery) => {
        e.preventDefault();
        console.log(searchQuery)
        navigate(`/pages/search/${searchQuery}`)
        setSearchQuery("")
        setIsOpen(false)
    }

    return (
		<>
			{session ? (
				<div
					className={`pt-[50px] p-3 ${
						isOpen === true ? "fixed" : "hidden"
					} md:hidden flex-col gap-2 items-center justify-center bg-white dark:bg-gray-800 z-[200] top-10 w-full`}>
					<Link
						className="nav-button border-b w-full p-2"
						href={"/pages/profile"}
						onClick={() => setIsOpen(false)}>
						{" "}
						<CiUser /> {t("profile")}{" "}
					</Link>
					<Link
						className="nav-button border-b w-full p-2"
						href={"/pages/home"}
						onClick={() => setIsOpen(false)}>
						{" "}
						<MdOutlineDashboard /> {t("dashboard")}
					</Link>
					<Link
						className="nav-button border-b w-full p-2"
						href={"/pages/settings"}
						onClick={() => setIsOpen(false)}>
						{" "}
						<CiSettings /> {t("settings")}{" "}
					</Link>
					<div className="nav-button border-b w-full p-2">
						{" "}
						<MdLanguage />
						<select
							className="bg-transparent text-gray-700 dark:text-gray-300 rounded border border-gray-300 dark:border-gray-600 p-1 focus:outline-none focus:ring focus:ring-blue-300 dark:focus:ring-blue-700"
							onChange={e => changeLanguage(e.target.value)}>
							<option value={"en"}>EN</option>
							<option value={"es"}>ES</option>
						</select>
					</div>
					{theme === "dark" ? (
						<button
							className="nav-button border-b w-full p-4"
							onClick={() => toggleTheme()}>
							<CiLight />
						</button>
					) : (
						<button
							className="nav-button border-b w-full p-4"
							onClick={() => toggleTheme()}>
							<GoMoon />
						</button>
					)}
					<button
						className="nav-button border-b w-full p-2"
						onClick={() => {
							logoutUser()
							setIsOpen(false)
						}}>
						{" "}
						<CiLogout />
						{t("logout")}
					</button>
					<form className="h-auto w-auto flex flex-row items-center justify-center gap-2 p-5 mx-auto">
						<input
							className="input w-full dark:bg-gray-700 dark:text-white dark:border-gray-600"
							placeholder={t("search-template")}
							value={searchQuery}
							onChange={e => setSearchQuery(e.target.value)}
						/>
						<button className="dark:text-gray-400" onClick={() => setIsOpen(false)}>
							{icons.search}
						</button>
						{Array.isArray(matchingTags) &&
							matchingTags.length > 0 &&
							searchQuery !== "" && (
								<ul className="absolute top-full w-[200px] bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg shadow-lg z-50 p-1 flex flex-col gap-1">
									<li
										className="new-theme-gray-button cursor-pointer"
										onClick={e => handleSearch(e, searchQuery)}>
										{searchQuery}...
									</li>
									{matchingTags.map((tag, index) => (
										<li
											key={index}
											onClick={async e => {
												setSearchQuery(tag)
												await handleSearch(e, tag)
											}}
											className="new-theme-gray-button cursor-pointer">
											{" "}
											{tag}{" "}
										</li>
									))}
								</ul>
							)}
					</form>
				</div>
			) : (
				<div className={`pt-[50px] p-3 ${ isOpen === true ? "flex" : "hidden" } md:hidden flex-col gap-2 items-center justify-center bg-white dark:bg-gray-800 dark:text-white`}>
					<div className="nav-button border-b w-full p-2">
						{" "}
						<MdLanguage />
						<select
							className="bg-transparent text-gray-700 dark:text-gray-300 rounded border border-gray-300 dark:border-gray-600 p-1 focus:outline-none focus:ring focus:ring-blue-300 dark:focus:ring-blue-700"
							onChange={e => changeLanguage(e.target.value)}>
							<option value={"en"}>EN</option>
							<option value={"es"}>ES</option>
						</select>
					</div>
                    <div className='nav-button border-b w-full p-2'>
                        {theme === "dark" ? (
                            <button onClick={() => toggleTheme()}>
                                <CiLight className="mx-auto" />
                            </button>
                        ) : (
                            <button onClick={() => toggleTheme()}>
                                <GoMoon className="mx-auto" />
                            </button>
                        )}
                    </div>
				</div>
			)}
		</>
	)
}

export default MobileNavMenu