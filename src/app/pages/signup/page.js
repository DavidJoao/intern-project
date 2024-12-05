'use client'
import React, { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import Link from "next/link"
import { registerUser } from "@/app/actions/user"
import { navigate } from "@/app/lib/redirect"

const Signup = () => {

    const [errorMessage, setErrorMessage] = useState("")
    const [successMessage, setSuccessMessage] = useState("")
    const [buttonStatus, setButtonStatus] = useState(false)

    const { register, setError, clearErrors, handleSubmit, watch, formState: { errors } } = useForm();
    const password = watch("password");
    const confirmPassword = watch("confirmPassword");


    const onSubmit = async (data) => {
        setErrorMessage("")
        const response = await registerUser(data)
        if (response.status === 201){
            setSuccessMessage("Account Created Successfully! Redirecting to Login...")
            setTimeout(() => {
                navigate('/pages/login')
                setSuccessMessage("")
            }, 2000)
        } else if (response.status === 500){
            setErrorMessage("Email Already In Use")
        }
    }

    useEffect(() => {
        if (password !== confirmPassword) {
            setError("confirmPassword", {
                type: "manual",
                message: "Passwords do not match",
            });
            setButtonStatus(true)
            setErrorMessage("Passwords do not match");
        } else {
            clearErrors("confirmPassword");
            setButtonStatus(false)
            setErrorMessage("");
        }
    }, [password, confirmPassword, setError, clearErrors]);

	return (
		<div className="w-screen h-screen center-col basic-theme">
			<div className="w-auto h-auto center-col p-3 gap-3">
				<h1 className="font-bold text-3xl">Signup</h1>
				<form className="border-[1px] border-primary dark:border-none rounded w-[250px] md:w-[400px] lg:w-[500px] p-3 white-theme center-col gap-3" onSubmit={handleSubmit(onSubmit)}>
					<label>Email</label>
					<input required className="input w-[70%]" {...register("email", { required: true })}/>
					<label>Name</label>
					<input required className="input w-[70%]" {...register("name", { required: true })}/>
					<label>Password</label>
					<input required name="password" className="input w-[70%]" type="password" {...register("password", { required: true })}/>
					<label>Confirm Password</label>
					<input required name="confirmPassword" className="input w-[70%]" type="password" {...register("confirmPassword", { required: true })}/>
					<button type="submit" className="theme-button w-[70%]" disabled={buttonStatus}> Signup </button>
                    <p className="error-message">{errorMessage}</p>
                    <p className="success-message text-center">{successMessage}</p>
				</form>
                <Link className='hover:underline underline-offset-2' href={'/pages/login'}>Already have an account? Login!</Link>
			</div>
		</div>
	)
}

export default Signup
