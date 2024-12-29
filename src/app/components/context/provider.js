"use client"
import { SessionProvider } from 'next-auth/react'
import { createContext, useContext, useState, useEffect } from 'react'
import { I18nextProvider } from 'react-i18next';
import i18next from '../../lib/i18n';
import { fetchTemplates } from '@/app/actions/templates';
import { logSession } from '@/app/actions/session';

const AppContext = createContext();

const Provider = ( { children } ) => {

    const [appNotification, setAppNotification] = useState("");
    const [templates, setTemplates] = useState([]);
    const [theme, setTheme] = useState('light');

    useEffect(() => {
        loadAllTemplates();
  }, []);

    useEffect(() => {
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme) {
        document.documentElement.classList.toggle('dark', savedTheme === 'dark');
        setTheme(savedTheme);
      } else {
        const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const initialTheme = prefersDarkScheme ? 'dark' : 'light';
        document.documentElement.classList.toggle('dark', initialTheme === 'dark');
        setTheme(initialTheme);
      }
    }, []);
  
    const toggleTheme = () => {
      const newTheme = theme === 'dark' ? 'light' : 'dark';
      document.documentElement.classList.toggle('dark', newTheme === 'dark');
      setTheme(newTheme);
      localStorage.setItem('theme', newTheme);
    };

    const loadAllTemplates = async () => {
      const session = await logSession();
      if (session?.user) {
        const { data } = await fetchTemplates(session?.user);
        setTemplates(data?.templates || []);
      }
    }

    return (
        <SessionProvider>
            <I18nextProvider i18n={i18next}>
                <AppContext.Provider value={{ appNotification, setAppNotification, toggleTheme, theme, templates, loadAllTemplates }}>
                {children}
                </AppContext.Provider>
            </I18nextProvider>
        </SessionProvider>
    )
 }
 export default Provider

 export const useAppContext = () => useContext(AppContext); 