'use client'
import { useTranslation } from "react-i18next";
import { useAppContext } from "./components/context/provider";
import { navigate } from "./lib/redirect";

export default function Home() {

    const { toggleTheme } = useAppContext()
    const { t, i18n } = useTranslation('common');

    const changeLanguage = async (lng) => {
        await i18n.changeLanguage(lng);
    }

    return (
        <div className="w-screen h-screen flex flex-col-reverse lg:flex-row basic-theme">
            <div className="w-full lg:w-1/2 h-1/2 lg:h-full center-col gap-2 p-4 rounded-l">
                <button className="theme-button" onClick={() => navigate('/pages/login')}>Login</button>
                <button className="theme-button" onClick={() => navigate('/pages/signup')}>Signup</button>
            </div>
            <div className="w-full lg:w-1/2 h-1/2 lg:h-full bg-primary rounded-r center-col p-4">
                <h2 class="text-3xl font-extrabold text-black dark:text-white sm:text-4xl center-col">
                    <span class="block text-center text-white">
                        Ready to create forms?
                    </span>
                    <span class="block text-black">
                        Sign In!
                    </span>
                </h2>
            </div>
            <button className="theme-button fixed" onClick={() => toggleTheme()}>Toggle</button>
            {/* <h1>{t('welcome')}</h1>
            <p>{t('description')}</p>
            <button onClick={() => changeLanguage('en')}>English</button>
            <button onClick={() => changeLanguage('es')}>Spanish</button> */}
        </div>
    );
}
