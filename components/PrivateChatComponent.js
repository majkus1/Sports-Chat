// PrivateChatComponent.js
import { useState, useEffect, useContext, useRef } from "react";
import { UserContext } from "./UserContext";
import io from "socket.io-client";
import { useTranslation } from "react-i18next";

const socket = io("https://czatsportowy.pl", { withCredentials: true });

const PrivateChatComponent = ({ receiver }) => {
  const [messages, setMessages] = useState([]);
  const [currentMessage, setCurrentMessage] = useState("");
  const { token, username } = useContext(UserContext);
  const messagesContainerRef = useRef(null);
  const { t } = useTranslation("common");

  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    const sender = username || "Anonim";
    const chatId = [sender, receiver].sort().join("_");

    socket.emit("join_chat", chatId);

    const fetchMessages = async () => {
      try {
        const response = await fetch(`/api/getPrivateMessages?chatId=${chatId}`, {
          credentials: "include",
        });
        const data = await response.json();
        if (Array.isArray(data)) {
          setMessages(data);
        } else {
          console.error("Oczekiwano tablicy wiadomości, ale otrzymano:", data);
          setMessages([]);
        }
      } catch (error) {
        console.error("Błąd podczas pobierania wiadomości:", error);
      }
    };

    fetchMessages();

    socket.on("receive_private_message", (message) => {
      console.log("Otrzymano prywatną wiadomość:", message);
      if (message.chatId === chatId) {
        setMessages((prevMessages) => [...prevMessages, message]);
      }
    });

    return () => {
      socket.off("receive_private_message");
      socket.off("join_chat");
    };
  }, [receiver, username]);

  const handleSendMessage = async () => {
    if (!receiver) {
      console.error("Receiver is not defined!");
      return;
    }
    const sender = username || "Anonim";
    const chatId = [sender, receiver].sort().join("_");
    if (currentMessage.trim()) {
      try {
        const response = await fetch("/api/sendPrivateMessage", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username: sender,
            content: currentMessage,
            chatId,
          }),
          credentials: "include",
        });
        const data = await response.json();
        if (data.success) {
          const messageObject = {
            username: sender,
            content: currentMessage,
            chatId,
          };
          socket.emit("send_private_message", messageObject);
          setCurrentMessage("");
        } else {
          console.error(data.message);
        }
      } catch (error) {
        console.error("Błąd podczas wysyłania wiadomości:", error);
      }
    }
  };

  const formatDate = (timestamp) => {
    const messageDate = new Date(timestamp);
    const currentDate = new Date();
    if (
      messageDate.getDate() === currentDate.getDate() &&
      messageDate.getMonth() === currentDate.getMonth() &&
      messageDate.getFullYear() === currentDate.getFullYear()
    ) {
      return messageDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    } else {
      return messageDate.toLocaleString([], {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      });
    }
  };

  return (
    <div className="private-content-chat">
      <div>
        <div className="messages-container" ref={messagesContainerRef}>
          {messages.map((msg, idx) => (
            <div key={idx} className="message-one">
              <strong>{msg.username}</strong>: {msg.content}
              <span style={{ marginLeft: "10px", fontSize: "0.8em", color: "gray" }}>
                {formatDate(msg.timestamp)}
              </span>
            </div>
          ))}
        </div>
      </div>
      {token ? (
        <div className="send-public-chat">
          <input
            value={currentMessage}
            onChange={(e) => setCurrentMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
            type="text"
            placeholder={t("write")}
          />
          <button onClick={handleSendMessage}>{t("sent")}</button>
        </div>
      ) : (
        <p>Musisz się zalogować, aby napisać wiadomość.</p>
      )}
    </div>
  );
};

export default PrivateChatComponent;
