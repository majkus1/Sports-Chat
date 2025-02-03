import React, { useState, useContext } from "react";
import { UserContext } from "@/components/UserContext";
import { GiPlayButton } from "react-icons/gi";
import { useTranslation } from "react-i18next";

export default function LoginModal({ isOpen, onRequestClose, onLogin }) {
  const [usernameInput, setUsernames] = useState("");
  const [password, setPassword] = useState("");
  const { setToken, setUsername } = useContext(UserContext);
  const { t } = useTranslation("common");

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: usernameInput, password }),
      credentials: "include",
    });

    if (response.ok) {
      const data = await response.json();
      setToken(data.token);
      setUsername(data.username);
      onLogin(data.token);
      alert(t("login_success"));
      onRequestClose();
    } else {
      const errorMessage = await response.text();
      alert(errorMessage);
    }
  };

  return (
    <div>
      <div className="overlay" onClick={onRequestClose}>
        <div className="modal" onClick={(e) => e.stopPropagation()}>
          <h2>{t("logging")}</h2>
          <form onSubmit={handleSubmit}>
            <div>
              <label>{t("usern")}</label>
              <input
                type="text"
                value={usernameInput}
                onChange={(e) => setUsernames(e.target.value)}
                required
              />
            </div>
            <div>
              <label>{t("passw")}</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn-to-login">
              <GiPlayButton style={{ marginRight: "5px" }} /> {t("logi")}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
