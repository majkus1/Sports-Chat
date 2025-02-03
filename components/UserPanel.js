import { useState, useEffect, useContext } from "react";
import { UserContext } from "./UserContext";
import Modal from "./Modal";
import PrivateChatComponent from "./PrivateChatComponent";
import io from "socket.io-client";
import { useTranslation } from "react-i18next";

const socket = io("http://localhost:3000", { withCredentials: true });

const UserPanel = () => {
  const [isPrivateChatOpen, setPrivateChatOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [chatHistory, setChatHistory] = useState([]);
  const { token, username } = useContext(UserContext);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const { t } = useTranslation("common");

  const handleSearch = async (query) => {
    if (!query) return;
    try {
      const response = await fetch(`/api/searchUsers?query=${query}`);
      const data = await response.json();
      if (data.success) {
        setSearchResults(data.users);
      }
    } catch (error) {
      console.error("Error during user search:", error);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      handleSearch(searchQuery);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const fetchChatHistory = async () => {
    if (username) {
      try {
        const response = await fetch(`/api/getChatHistory?username=${username}`);
        const data = await response.json();
        setChatHistory(data);
      } catch (error) {
        console.error("Błąd podczas pobierania historii czatów:", error);
      }
    }
  };

  useEffect(() => {
    fetchChatHistory();
    socket.on("receive_message", (message) => {
      if (message.receiver === username) {
        fetchChatHistory();
      }
    });
    socket.on("receive_private_message", (message) => {
      console.log("Private message received:", message);
      if (message.receiver === username) {
        fetchChatHistory();
      }
    });
    return () => {
      socket.off("receive_message");
      socket.off("receive_private_message");
    };
  }, [username, token]);

  const openPrivateChat = (chatUsername) => {
    if (chatUsername === username) {
      console.warn("Nie możesz otworzyć czatu z samym sobą.");
      return;
    }
    setSelectedUser(chatUsername);
    setPrivateChatOpen(true);
  };

  const closeModal = () => {
    setPrivateChatOpen(false);
    setSelectedUser(null);
    fetchChatHistory();
  };

  if (!token) return null;

  return (
    <div>
      {isPrivateChatOpen && (
        <Modal onClose={closeModal}>
          <PrivateChatComponent receiver={selectedUser} />
        </Modal>
      )}
      <div className="history-chat">
        <h2>{t("privc")}</h2>
        <ul>
          {chatHistory.map((chat) => (
            <li key={chat.username}>
              <span onClick={() => openPrivateChat(chat.username)}>
                {chat.username}{" "}
                {chat.lastMessageDate && (
                  <span>
                    (
                    {new Date(chat.lastMessageDate).toLocaleDateString() ===
                    new Date().toLocaleDateString()
                      ? "dziś "
                      : new Date(chat.lastMessageDate).toLocaleDateString([], {
                          year: "numeric",
                          month: "2-digit",
                          day: "2-digit",
                        }) + " "}
                    {new Date(chat.lastMessageDate).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                    )
                  </span>
                )}
              </span>
            </li>
          ))}
        </ul>
      </div>
      <div className="box-search">
        <input
          type="text"
          placeholder={t("usersea")}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button onClick={() => handleSearch(searchQuery)} className="search-btn">
          {t("searc")}
        </button>
        <ul>
          {searchResults.map((user) => (
            <li
              key={user.username}
              onClick={() => openPrivateChat(user.username)}
              style={{ cursor: "pointer" }}
            >
              {user.username}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default UserPanel;
