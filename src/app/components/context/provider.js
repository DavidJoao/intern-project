"use client"
 import { SessionProvider } from 'next-auth/react'
 import { createContext, useContext, useState } from 'react'

 const AppContext = createContext();

 const Provider = ( { children } ) => {

    const [appNotification, setAppNotification] = useState("")

    return (
        <SessionProvider>
            <AppContext.Provider value={{ appNotification, setAppNotification }}>
                {children}
            </AppContext.Provider>
        </SessionProvider>
    )
 }
 export default Provider

 export const useAppContext = () => useContext(AppContext);