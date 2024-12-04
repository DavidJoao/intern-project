'use client'
import React from "react"
import { useForm } from "react-hook-form"
import { navigate } from "@/app/lib/redirect"
import Link from "next/link"

const Signup = () => {

    const { register, handleSubmit, watch, formState: { errors } } = useForm();

    const onSubmit = async (data) => {
        console.log(data)
    }

	return (
		<div className="w-screen h-screen center-col basic-theme">
			<div className="w-auto h-auto center-col p-3 gap-3">
				<h1 className="font-bold text-3xl">Login</h1>
				<form className="border-[1px] border-primary dark:border-none rounded w-[250px] md:w-[400px] lg:w-[500px] p-3 white-theme center-col gap-3" onSubmit={handleSubmit(onSubmit)}>
					<label>Email</label>
					<input required className="input w-[70%]" {...register("email", { required: true })}/>
					<label>Password</label>
					<input required className="input w-[70%]" type="password" {...register("password", { required: true })}/>
					<button type="submit" className="theme-button w-[70%]"> Signup </button>
				</form>
                <Link className='hover:underline underline-offset-2' href={'/pages/login'}>Already have an account? Login!</Link>
			</div>
		</div>
	)
}

export default Signup
