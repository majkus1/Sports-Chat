import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import "../styles/LoginModal.scss";
import "../styles/All.scss";
import { UserContext } from "@/components/UserContext";
import { appWithTranslation } from "next-i18next";
import i18n from "@/i18n";

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const [token, setToken] = useState(null);
  const [username, setUsername] = useState(null);
  const [language, setLanguage] = useState("pl");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/auth/me", {
          credentials: "include",
        });
        if (res.ok) {
          const data = await res.json();
          setUsername(data.username);
          setToken(true);
        }
      } catch (err) {
        console.error("Błąd podczas sprawdzania autoryzacji:", err);
      }
    };
    fetchUser();
  }, []);

  const changeLanguage = (lng) => {
    setLanguage(lng);
    localStorage.setItem("language", lng);
    i18n.changeLanguage(lng);
  };

  useEffect(() => {
    const urlLanguage = router.locale || "pl";
    const savedLanguage = localStorage.getItem("language");
    if (!savedLanguage || savedLanguage !== urlLanguage) {
      setLanguage(urlLanguage);
      i18n.changeLanguage(urlLanguage);
      localStorage.setItem("language", urlLanguage);
    }
  }, [router.locale]);

  useEffect(() => {
    if (!router.asPath.startsWith("/pl") && !router.asPath.startsWith("/en")) {
      router.replace("/pl");
    }
  }, []);

  return (
    <UserContext.Provider
      value={{
        token,
        setToken,
        username,
        setUsername,
        language,
        setLanguage: changeLanguage,
      }}
    >
      <Component {...pageProps} />
    </UserContext.Provider>
  );
}

export default appWithTranslation(MyApp);
