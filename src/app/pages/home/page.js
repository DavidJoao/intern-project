'use client'
import Loading from '@/app/components/general/Loading'
import { useAuth } from '@/app/hooks/useAuth'
import { icons } from '@/app/lib/icons'
import React, { useEffect } from 'react'

const Home = () => {

  const user = useAuth();

  useEffect(() => {
    // console.log(user);
  }, [user]);

  return (
    <>
    {user ? (
        <div className='w-screen h-screen flex flex-col pt-[50px]'>
			{/* Search Section */}
			<div className='border-[1px] border-black h-[10%] flex items-center justify-center p-3'>
				<form className='border-[1px] border-red-500 h-auto w-auto flex flex-row items-center justify-center gap-2 p-5'>
					<input className='input' placeholder='Search Template'/>
					<button>{icons.search}</button>
				</form>
			</div>

			{/* Explore/Create */}
			<div className='border-[1px] border-black h-[90%] flex flex-row'>
				{/* Explore Templates */}
				<div className='border-[1px] border-blue-400 h-full w-full md:w-[70%] flex flex-col items-center p-3'>
					<p className='font-bold'>Explore Templates</p>
					{/* MAP TEMPLATES */}
					<div className='border-[1px] border-green-500 w-full h-full p-3'>

					</div>
				</div>

				{/* Create Template */}
				<div className='border-[1px] border-blue-400 h-full w-[30%] hidden md:flex flex-col items-center p-3'>
					<p className='font-bold'>Explore Templates</p>
					{/* MAP TEMPLATES */}
					<div className='border-[1px] border-green-500 w-full h-full p-3'>

					</div>
				</div>
			</div>
        </div>
    ) : (
        <Loading />
    )}
    </>
  )
}

export default Home