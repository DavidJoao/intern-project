'use client'
import { deleteUser, fetchAllUsers, switchBlock, switchRoles } from '@/app/actions/user'
import React, { useEffect, useState } from 'react'
import { useAuth } from '@/app/hooks/useAuth'
import Loading from '@/app/components/general/Loading'
import { useTranslation } from 'react-i18next'
import { logoutUser } from '@/app/actions/session'
import { navigate } from '@/app/lib/redirect'
import { useAppContext } from '@/app/components/context/provider'

const Settings = () => {

    const { loadAllTemplates } = useAppContext();
    const { t } = useTranslation('common');
    const user = useAuth();

    const [users, setUsers] = useState([])

    useEffect(() => {
        initializeData();
    }, [])

    const initializeData = async () => {
        const { data } = await fetchAllUsers();
        setUsers(data.users);
    }

    const handleRoleSwitch = async (e, userId) => {
        e.preventDefault()
        try {
              await switchRoles(userId);
              await initializeData();
        } catch (error) {
            console.log(error)
            return error
        }
    }

    const handleBlockSwitch = async (e, userId) => {
        e.preventDefault()
        try {
                const updatedUser = await switchBlock(userId);
                await initializeData();
                console.log(updatedUser)
                if (userId === user.user.id && updatedUser.data.user.status === "blocked"){
                    logoutUser();
                    navigate('/pages/login')
                }
        } catch (error) {
            console.log(error)
            return error
        }
    }

    const handleUserDeletion = async (e, userId) => {
        e.preventDefault();
        try {
            await deleteUser(userId)
            if (userId === user.user.id) {
                await logoutUser();
                navigate('/pages/login')
            }
            await initializeData();
            await loadAllTemplates();
        } catch (error) {
            console.log(error)
            return error;
        }
    }

  return (
    <>
    { user && users ? (
    <div className='pt-[50px] border-[1px] border-black w-sceen h-screen'>
        <div className="w-full h-full overflow-auto bg-gray-100 p-4 dark:bg-gray-900 overflow-auto">
            <table className="w-full border-collapse bg-white rounded-lg shadow">
                <thead>
                <tr className="text-left text-sm font-semibold text-gray-600 bg-gray-200 dark:bg-gray-700 dark:text-white">
                    <th className="p-4">{t("name")}</th>
                    <th className="p-4">Email</th>
                    <th className="p-4">{t("status")}</th>
                    <th className="p-4">{t("block-unblock")}</th>
                    <th className="p-4">{t("make-admin")}</th>
                    <th className="p-4">{t("delete-user")}</th>
                </tr>
                </thead>
                <tbody>
                {users.map((user, index) => (
                    <tr key={index} className="border-t hover:bg-gray-50 text-sm text-gray-700 dark:bg-gray-600 dark:hover:bg-gray-700 dark:text-white">
                    <td className="p-4">{user.name}</td>
                    <td className="p-4">{user.email}</td>
                    <td className="p-4">
                        <span
                        className={`px-2 py-1 text-xs font-semibold rounded ${
                            user.status === "Active"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                        >
                        {user.status}
                        </span>
                    </td>
                    <td className="p-4">
                    { user.status === 'active' ? (
                            <button className="px-3 py-1 new-theme-button" onClick={(e) => handleBlockSwitch(e, user.id)}> {t("block")} </button>
                        ) : (
                            <button className="px-3 py-1 new-theme-button" onClick={(e) => handleBlockSwitch(e, user.id)}> {t("unblock")} </button>
                        )}
                    </td>
                    <td className="p-4">
                        { user.role === 'admin' ? (
                            <button className="px-3 py-1 new-theme-button" onClick={(e) => handleRoleSwitch(e, user.id)}> {t("remove-admin")} </button>
                        ) : (
                            <button className="px-3 py-1 new-theme-button" onClick={(e) => handleRoleSwitch(e, user.id)}> {t("create-admin")} </button>
                        )}
                    </td>
                    <td className="p-4">
                        <button className="px-3 py-1 new-theme-red-button" onClick={(e) => handleUserDeletion(e, user.id)}> {t("delete")} </button>
                    </td>
                    </tr>
                ))}
                </tbody>
            </table>
            </div>
    </div>
    ) : (
    <Loading />
    ) }
    </>
  )
}

export default Settings