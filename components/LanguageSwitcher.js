import { useRouter } from 'next/router';
import { useContext } from 'react';
import { UserContext } from './UserContext';
import i18n from '@/i18n';

const LanguageSwitcher = ({ onLanguageChange }) => {
  const { setLanguage } = useContext(UserContext);
  const router = useRouter();

  const changeLanguage = (lng) => {
    if (onLanguageChange) {
      onLanguageChange();
    }

    setLanguage(lng);

    localStorage.setItem('language', lng);

    i18n.changeLanguage(lng);

    router.push(router.pathname, router.asPath, { locale: lng });
  };

  return (
    <div className='languageswitchers'>
      <button onClick={() => changeLanguage('en')} className='buttonlng'><img src='/img/united-kingdom.png' className='languageimg' /></button>
      <button onClick={() => changeLanguage('pl')} className='buttonlng'><img src='/img/poland.png' className='languageimg' /></button>
    </div>
  );
};

export default LanguageSwitcher;
