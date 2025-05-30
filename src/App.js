import React, { useState } from "react";
import "./App.css";

function App() {
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState([
    { role: "bot", content: "Bienvenue chez Matrix Télécoms ! Comment puis-je vous aider avec nos solutions de télécommunications ?" }
  ]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleSend = async () => {
    if (!query.trim()) return;

    // Ajouter le message de l'utilisateur à la liste
    const updatedMessages = [...messages, { role: "user", content: query }];
    setMessages(updatedMessages);
    setLoading(true);

    try {
      const res = await fetch("https://f1a9-41-92-184-172.ngrok-free.app/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query }),
      });

      const data = await res.json();
      // Ajouter la réponse du bot à la liste des messages
      setMessages([...updatedMessages, { role: "bot", content: data.response }]);
    } catch (error) {
      setMessages([...updatedMessages, { role: "bot", content: "Erreur lors de la communication avec l'assistant." }]);
      console.error(error);
    } finally {
      setLoading(false);
      setQuery(""); // Réinitialiser le champ de saisie
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {!isOpen && (
        <button onClick={toggleChat} className="chatbot-toggle">
          🤖
        </button>
      )}
      {isOpen && (
        <div className="chatbot-container">
          <div className="chatbot-header">
            <span className="header-icon">✨</span>
            <h1>Assistant Virtuel</h1>
            <button onClick={toggleChat} className="close-button">
              ✕
            </button>
          </div>
          <div className="chatbot-messages">
            {messages.map((msg, index) => (
              <div key={index} className={`message ${msg.role === "user" ? "user-message" : "bot-message"}`}>
                <span className="message-content">{msg.content}</span>
                {msg.role === "bot" && (
                  <span className="message-timestamp">
                    {new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
                  </span>
                )}
              </div>
            ))}
            {loading && <div className="loader">Chargement...</div>}
          </div>
          <div className="chatbot-footer">
            <div className="input-container">
              <textarea
                placeholder="Écrivez votre message..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                rows="1"
              />
              <button onClick={handleSend} disabled={loading} className="send-button">
                ➤
              </button>
            </div>
            <p className="footer-text">
              Il s'agit d'un assistant alimenté par l'IA. Les réponses sont automatisées et peuvent ne pas toujours être exactes. Pour des informations définitives, veuillez contacter le support.
            </p>
          </div>
        </div>
      )}
    </>
  );
}

export default App;
