import React, { useState, useContext } from "react";
import { GiPlayButton } from "react-icons/gi";
import { useTranslation } from "react-i18next";
import { UserContext } from "@/components/UserContext";

export default function RegisterModal({ isOpen, onRequestClose, onRegister }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [usernameInput, setUsernameInput] = useState("");
  const { t } = useTranslation("common");
  const { setToken, setUsername } = useContext(UserContext);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch("/api/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password, username: usernameInput }),
      credentials: "include",
    });

    if (response.ok) {
      const data = await response.json();
      setUsername(data.username);
      setToken(data.token);

      alert(`Pomyślnie zarejestrowano jako ${data.username}!`);
      onRegister(data.token);
      onRequestClose();
    } else {
      const errorMessage = await response.text();
      alert(errorMessage);
    }
  };

  return (
    <div className="modalOverlay" onClick={onRequestClose}>
      <div className="modal-register" onClick={(e) => e.stopPropagation()}>
        <h2>{t("register")}</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label>{t("usern")}</label>
            <input
              type="text"
              value={usernameInput}
              onChange={(e) => setUsernameInput(e.target.value)}
              required
            />
          </div>
          <div>
            <label>{t("mail")}</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
          <button type="submit" className="btn-to-reg">
            <GiPlayButton style={{ marginRight: "5px" }} />
            {t("regi")}
          </button>
        </form>
      </div>
    </div>
  );
}
