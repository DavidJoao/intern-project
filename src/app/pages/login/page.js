'use client'
import { navigate } from '@/app/lib/redirect';
import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import Link from 'next/link';
import { fetchUserStatusByEmail, signInUser } from '@/app/actions/user';
import { useRouter } from 'next/navigation';
import { logSession } from '@/app/actions/session';
import { useTranslation } from 'react-i18next';


const Login = () => {

    const router = useRouter();

    const { t } = useTranslation('common');

    const [session, setSession] = useState(null)
    const [errorMessage, setErrorMessage] = useState("")
    const [successMessage, setSuccessMessage] = useState("")

    const { register, handleSubmit, watch, formState: { errors } } = useForm();

    const onSubmit = async (data) => {
        setErrorMessage("");
        try {
            const userStatus = await fetchUserStatusByEmail(data.email)
            if (userStatus === 'blocked') {
              setErrorMessage("Account Blocked")
            } else {
              const response = await signInUser(data.email, data.password);
              if (response.error === null) {
                  navigate('/pages/home');
              } else if (response.error === 'CredentialsSignin') {
                setErrorMessage("Invalid Credentials")
              }
              router.refresh();
              return response
            }
        } catch (error) {
            return error
        }
    }

    useEffect(() => {
        const checkSession = async () => {
          try {
            const userSession = await logSession();
            setSession(userSession); 
    
            if (userSession) {
              router.push('/pages/home');
            }
          } catch (error) {
            console.error("Error fetching session", error);
          }
        };
        checkSession();
      }, [router]);

    return (
        <div className='w-screen h-screen center-col basic-theme'>
            <div className='w-full md:w-auto h-auto center-col p-3 gap-3'>
                <h1 className='font-bold text-3xl'>{t('login')}</h1>
                <form className='border-[1px] border-primary dark:border-none rounded w-full md:w-[400px] lg:w-[500px] p-3 white-theme center-col gap-3' onSubmit={handleSubmit(onSubmit)}>
                    <label>Email</label>
                    <input required className='input w-[70%] lowercase' {...register("email", { required: true })}/>
                    <label>{t('password')}</label>
                    <input required className='input w-[70%]' type='password'  {...register("password", { required: true })}/>
                    <button type='submit' className='theme-button w-[70%]'>{t("login")}</button>
                    <p className='error-message'>{errorMessage}</p>
                </form>
                <Link className='hover:underline underline-offset-2' href={'/pages/signup'}>{t('no-account')}</Link>
            </div>
        </div>
    )
}

export default Login