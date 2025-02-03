import { useState, useEffect, useContext } from "react";
import LoginModal from "./LoginModal";
import RegisterModal from "./RegisterModal";
import { UserContext } from "@/components/UserContext";
import UserPanel from "@/components/UserPanel";
import { GiPlayButton } from "react-icons/gi";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "./LanguageSwitcher";
import Link from "next/link";

export default function NavBar({ onLanguageChange }) {
  const [isRegisterModalOpen, setRegisterModalOpen] = useState(false);
  const [isLoginModalOpen, setLoginModalOpen] = useState(false);
  const { token, setToken, setUsername } = useContext(UserContext);
  const [isUserPanelVisible, setUserPanelVisible] = useState(false);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { t } = useTranslation("common");
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleLogin = (newToken) => {
    setToken(newToken);
    setLoginModalOpen(false);
  };

  const handleRegister = (newToken) => {
    setToken(newToken);
    setRegisterModalOpen(false);
  };

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/logout", {
        method: "POST",
        credentials: "include",
      });
      if (res.ok) {
        setToken(null);
        setUsername(null);
        setMobileMenuOpen(false);
      } else {
        console.error("Nie udało się wylogować");
      }
    } catch (error) {
      console.error("Błąd podczas wylogowywania:", error);
    }
  };

  return (
    <div>
      <div className="head-navbar">
        <Link href="/" style={{ textDecoration: "none", color: "#f8eded" }}>
          <h1>{t("welcome")}</h1>
        </Link>
        <p>{t("underwelcome")}</p>
      </div>
      <LanguageSwitcher onLanguageChange={onLanguageChange} />

      <div className="mobile-menu">
        {isMobileMenuOpen ? (
          <img
            src="/img/cross.png"
            className="menu-icon"
            onClick={() => {
              setMobileMenuOpen(false);
              setLoginModalOpen(false);
              setRegisterModalOpen(false);
            }}
          />
        ) : (
          <img
            src="/img/menu-bar.png"
            className="menu-icon"
            onClick={() => setMobileMenuOpen(true)}
          />
        )}
      </div>

      {isMobileMenuOpen && (
        <div className="mobile-dropdown">
          {token ? (
            <>
              <span className="you-log">{t("nowlog")}</span>
              <UserPanel />
              <button onClick={handleLogout} className="log-out-btn">
                <GiPlayButton /> {t("out")}
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setLoginModalOpen(true)}
                className="btn-login"
              >
                <GiPlayButton /> {t("logging")}
              </button>
              <LoginModal
                isOpen={isLoginModalOpen}
                onRequestClose={() => setLoginModalOpen(false)}
                onLogin={handleLogin}
              />
              <button
                onClick={() => setRegisterModalOpen(true)}
                className="btn-reg"
              >
                <GiPlayButton /> {t("register")}
              </button>
              <RegisterModal
                isOpen={isRegisterModalOpen}
                onRequestClose={() => setRegisterModalOpen(false)}
                onRegister={handleRegister}
              />
            </>
          )}
        </div>
      )}

      <div className="panel">
        {token ? (
          <div className="panel-login">
            <span className="you-log">{t("nowlog")}</span>
            <button
              className="panel-button"
              onClick={() => setUserPanelVisible(!isUserPanelVisible)}
            >
              <GiPlayButton /> Panel
            </button>
            <button onClick={handleLogout} className="log-out-btn">
              <GiPlayButton /> {t("out")}
            </button>
          </div>
        ) : (
          <div className="panellogreg">
            <button
              onClick={() => setLoginModalOpen(true)}
              className="btn-login"
            >
              <GiPlayButton /> {t("logging")}
            </button>
            <LoginModal
              isOpen={isLoginModalOpen}
              onRequestClose={() => setLoginModalOpen(false)}
              onLogin={handleLogin}
            />
            <button
              onClick={() => setRegisterModalOpen(true)}
              className="btn-reg"
            >
              <GiPlayButton /> {t("register")}
            </button>
            <RegisterModal
              isOpen={isRegisterModalOpen}
              onRequestClose={() => setRegisterModalOpen(false)}
              onRegister={handleRegister}
            />
          </div>
        )}
        {isClient &&
          (isUserPanelVisible || window.innerWidth > 900) &&
          <UserPanel />}
      </div>
    </div>
  );
}
