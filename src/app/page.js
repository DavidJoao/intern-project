'use client'
import { useTranslation } from "react-i18next";

export default function Home() {

    const { t, i18n } = useTranslation('common');

    const changeLanguage = async (lng) => {
        await i18n.changeLanguage(lng);
    }

    return (
        <div>
            <h1>{t('welcome')}</h1>
            <p>{t('description')}</p>
            <button onClick={() => changeLanguage('en')}>English</button>
            <button onClick={() => changeLanguage('es')}>Spanish</button>
        </div>
    );
}
