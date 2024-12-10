'use client'
import React from 'react'
import { useAuth } from '@/app/hooks/useAuth';
import Loading from '@/app/components/general/Loading';

const Profile = () => {

    const user = useAuth();

  return (
    <>
    { user ? (
        <div>

        </div>
    ) : (
        <Loading />
    ) }
    </>
  )
}

export default Profile