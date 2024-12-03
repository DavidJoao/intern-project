"use client"
import { SessionProvider } from 'next-auth/react'
import { createContext, useContext, useState } from 'react'
import { I18nextProvider } from 'react-i18next';
import i18next from '../../lib/i18n';

const AppContext = createContext();

const Provider = ( { children } ) => {

    const [appNotification, setAppNotification] = useState("")

    return (
        <SessionProvider>
            <I18nextProvider i18n={i18next}>
                <AppContext.Provider value={{ appNotification, setAppNotification }}>
                {children}
                </AppContext.Provider>
            </I18nextProvider>
        </SessionProvider>
    )
 }
 export default Provider

 export const useAppContext = () => useContext(AppContext); 