'use client'
import React, { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import Link from "next/link"
import { registerUser } from "@/app/actions/user"
import { navigate } from "@/app/lib/redirect"
import { logSession } from "@/app/actions/session"
import { useRouter } from "next/navigation"
import { useTranslation } from "react-i18next"
import { icons } from "@/app/lib/icons"

const Signup = () => {

    const { t } = useTranslation('common');

    const [session, setSession] = useState(null)
    const [errorMessage, setErrorMessage] = useState("")
    const [successMessage, setSuccessMessage] = useState("")
    const [buttonStatus, setButtonStatus] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const { register, setError, clearErrors, handleSubmit, watch, formState: { errors } } = useForm();
    const password = watch("password");
    const router = useRouter();
    const confirmPassword = watch("confirmPassword");


    const onSubmit = async (data) => {
        setIsLoading(true)
        setErrorMessage("")
        const response = await registerUser(data)
        if (response.status === 201){
            setSuccessMessage("Account Created Successfully! Redirecting to Login...")
            setTimeout(() => {
                navigate('/pages/login')
                setSuccessMessage("")
            }, 2000)
            setIsLoading(false)
        } else if (response.status === 500){
            setErrorMessage("Email Already In Use")
            setIsLoading(false)
        }
    }

    useEffect(() => {
        if (password !== confirmPassword) {
            setError("confirmPassword", {
                type: "manual",
                message: t("match"),
            });
            setButtonStatus(true)
            setErrorMessage(t("match"));
        } else {
            clearErrors("confirmPassword");
            setButtonStatus(false)
            setErrorMessage("");
        }
    }, [password, confirmPassword, setError, clearErrors]);

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
		<div className="w-screen h-screen center-col basic-theme">
			<div className="w-full h-auto center-col p-3 gap-3">
				<h1 className="font-bold text-3xl">{t("signup")}</h1>
				<form className="border-[1px] border-primary dark:border-none rounded w-full md:w-[400px] lg:w-[500px] p-3 white-theme center-col gap-3" onSubmit={handleSubmit(onSubmit)}>
					<label>Email</label>
					<input required className="input w-[70%] lowercase" {...register("email", { required: true })}/>
					<label>{t("name")}</label>
					<input required className="input w-[70%]" {...register("name", { required: true })}/>
					<label>{t("password")}</label>
					<input required name="password" className="input w-[70%]" type="password" {...register("password", { required: true })}/>
					<label>{t("confirm-password")}</label>
					<input required name="confirmPassword" className="input w-[70%]" type="password" {...register("confirmPassword", { required: true })}/>
					<button type="submit" className="theme-button w-[70%] flex justify-center" disabled={buttonStatus}> { isLoading ? icons.loading : t("signup")} </button>
                    <p className="error-message">{errorMessage}</p>
                    <p className="success-message text-center">{successMessage}</p>
				</form>
                <Link className='hover:underline underline-offset-2' href={'/pages/login'}>{t("have-account")}!</Link>
			</div>
		</div>
	)
}

export default Signup
