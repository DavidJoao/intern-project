'use client'
import { fetchAllUsers } from '@/app/actions/user'
import React, { useEffect, useState } from 'react'
import { useAuth } from '@/app/hooks/useAuth'
import Loading from '@/app/components/general/Loading'
import { useTranslation } from 'react-i18next'

const Settings = () => {

    const { t } = useTranslation('common');
    const user = useAuth();

    const [users, setUsers] = useState([])

    useEffect(() => {
        const initializeData = async () => {
            const { data } = await fetchAllUsers();
            setUsers(data.users);
        }
        initializeData();
    }, [])

  return (
    <>
    { user && users ? (
    <div className='pt-[50px] border-[1px] border-black w-sceen h-screen'>
        <div className="w-full h-full overflow-auto bg-gray-100 p-4">
            <table className="w-full border-collapse bg-white rounded-lg shadow">
                <thead>
                <tr className="text-left text-sm font-semibold text-gray-600 bg-gray-200">
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
                    <tr
                    key={index}
                    className="border-t hover:bg-gray-50 text-sm text-gray-700"
                    >
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
                        <button className="px-3 py-1 text-white rounded font-bold bg-blue-500 hover:bg-blue-600"> {user.status === "active" ? `${t("block")}` : `${t("unblock")}`} </button>
                    </td>
                    <td className="p-4">
                        <button className="px-3 py-1 text-white rounded font-bold bg-green-500 hover:bg-green-600"> {t("create-admin")} </button>
                    </td>
                    <td className="p-4">
                        <button className="px-3 py-1 text-white rounded font-bold bg-red-500 hover:bg-red-600"> {t("delete")} </button>
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