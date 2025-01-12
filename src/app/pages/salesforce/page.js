'use client'
import { authenticateWithSalesforceAPI, checkForRegisteredUser } from '@/app/actions/user';
import Loading from '@/app/components/general/Loading';
import { useAuth } from '@/app/hooks/useAuth'
import { icons } from '@/app/lib/icons';
import React, { useEffect, useState } from 'react'

const Salesforce = () => {

    const user = useAuth();
    
    const initialForm = {
        firstName: "",
        lastName: "",
        email: user?.user?.email,
        account: "Itransition Project Course"
    }
    
    const [isLoading, setIsLoading] = useState(false)
    const [form, setForm] = useState(initialForm)
    const [foundContact, setFoundContact] = useState(null)

    useEffect(() => {
        setForm({...form, ['email']: user?.user.email})
    }, [user])
    
    useEffect(() => {
        if (user != null) {
            checkExistance()
        }
    }, [user])

    const checkExistance = async () => {
        const { data } = await checkForRegisteredUser(user?.user?.email)
        setFoundContact(data)
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({
            ...form,
            [name]: value
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true)
        await authenticateWithSalesforceAPI(form)
        setIsLoading(false)
        checkExistance()
    }

    
    if (!user) return <Loading />
    return (
    <div className='min-h-screen h-auto w-full dark:bg-gray-700 pt-[50px] flex flex-col items-center justify-center'>
        <form className='w-[300px] md:w-[500px] h-auto bg-slate-200 dark:bg-gray-800 rounded shadow-lg p-3 dark:text-slate-100 flex flex-col gap-2' onSubmit={handleSubmit}>

            <div>
                <label className='text-xs'>First Name</label>
                <input required name='firstName' value={form?.firstName} className='dark-input' onChange={handleChange}/>
            </div>

            <div>
                <label className='text-xs'>Last Name</label>
                <input required name='lastName' value={form?.lastName} className='dark-input' onChange={handleChange}/>

            </div>

            <div>
                <label className='text-xs'>Email</label>
                <input required name='email' value={form?.email} className='dark-input' onChange={handleChange}/>

            </div>

            <div>
                { foundContact?.message === "Contact found" ? (
                    <button className='new-theme-gray-button w-full' disabled>Email Already Linked To Salesforce</button>
                ) : (
                    <button type='submit' className='new-theme-button w-full'>{isLoading ? icons.loading : "Link Account"}</button>
                )}
            </div>

        </form>
    </div>
  )
}

export default Salesforce