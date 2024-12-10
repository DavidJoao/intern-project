'use client'
import { useTranslation } from "react-i18next";
import { navigate } from "./lib/redirect";

export default function Home() {

    const { t } = useTranslation('common');

    return (
        <div className="w-screen h-screen flex flex-col-reverse lg:flex-row basic-theme">
            <div className="w-full lg:w-1/2 h-1/2 lg:h-full center-col gap-2 p-4 rounded-l">
                <button className="theme-button" onClick={() => navigate('/pages/login')}>{t('login')}</button>
                <button className="theme-button" onClick={() => navigate('/pages/signup')}>{t('signup')}</button>
            </div>
            <div className="w-full lg:w-1/2 h-1/2 lg:h-full bg-primary rounded-r center-col p-4">
                <h2 className="text-3xl font-extrabold text-black dark:text-white sm:text-4xl center-col">
                    <span className="block text-center text-white">
                        {t("readyto")}
                    </span>
                    <span className="block text-black">
                        {t('login')}!
                    </span>
                </h2>
            </div>
        </div>
    );
}
