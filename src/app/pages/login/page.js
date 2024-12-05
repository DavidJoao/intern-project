'use client'
import { navigate } from '@/app/lib/redirect';
import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import Link from 'next/link';
import { signInUser } from '@/app/actions/user';
import { logoutUser } from '@/app/actions/session';
import { useRouter } from 'next/navigation';
import { logSession } from '@/app/actions/session';


const Login = () => {

    const router = useRouter();

    const [session, setSession] = useState(null)
    const [errorMessage, setErrorMessage] = useState("")
    const [successMessage, setSuccessMessage] = useState("")

    const { register, handleSubmit, watch, formState: { errors } } = useForm();

    const onSubmit = async (data) => {
        setErrorMessage("");
        try {
            const response = await signInUser(data.email, data.password);
            if (response.error === null) {
                navigate('/pages/home');
            }
            router.refresh();
            return response
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
            <div className='w-auto h-auto center-col p-3 gap-3'>
                <h1 className='font-bold text-3xl'>Login</h1>
                <form className='border-[1px] border-primary dark:border-none rounded w-[250px] md:w-[400px] lg:w-[500px] p-3 white-theme center-col gap-3' onSubmit={handleSubmit(onSubmit)}>
                    <label>Email</label>
                    <input required className='input w-[70%]' {...register("email", { required: true })}/>
                    <label>Password</label>
                    <input required className='input w-[70%]' type='password'  {...register("password", { required: true })}/>
                    <button type='submit' className='theme-button w-[70%]'>Login</button>
                    <button onClick={() => logoutUser()}>logout</button>
                </form>
                <Link className='hover:underline underline-offset-2' href={'/pages/signup'}>Do not have an account? Signup!</Link>
            </div>
        </div>
    )
}

export default Login