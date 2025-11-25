import { useState, useRef } from "react";
import { chatWithGemini } from "@/ai/gemini.js";

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const [open, setOpen] = useState(false);
  const messagesEndRef = useRef(null);


  const handleSend = async (e) => {
  e.preventDefault();
  if (!input.trim()) return;

  
  const newMessage = { sender: "user", text: input };
  setMessages((prev) => [...prev, newMessage]);
  const userInput = input;
  setInput("");
  setThinking(true);

  messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });

  try {
    // Use Gemini API for chatbot responses
    const res = await chatWithGemini(userInput);

    if (res) {
      // Add bot reply message
      setMessages((prev) => [...prev, { sender: "bot", text: res }]);
    } else {
      setMessages((prev) => [...prev, { sender: "bot", text: "Sorry, I couldn't process your request." }]);
    }
  } catch (error) {
    console.error("Chat error:", error);
    setMessages((prev) => [...prev, { sender: "bot", text: "An error occurred. Please try again." }]);
  } finally {
    setThinking(false);
  }
};
return(
 <div className="fixed bottom-6 right-10 z-50">
      {/* Floating Chat Button */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="w-14 h-14 rounded-full bg-green-600 shadow-lg flex items-center justify-center text-white ring-4 ring-white hover:scale-105 transform transition"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-7 h-7"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4-.85L3 21l1.85-4A9.863 9.863 0 013 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
        </button>
      )}

      {/* Chat Panel */}
      {open && (
        <div className="w-[400px] max-w-[90vw] h-80 bg-white rounded-2xl shadow-2xl mt-4 overflow-hidden flex flex-col ring-1 ring-gray-200 animate-[slideUp_0.2s_ease-out]">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-green-500 to-lime-500 flex items-center justify-center text-white font-semibold">
                AI
              </div>
              <div>
                <div className="text-sm font-medium">Chat Assistant</div>
                <div className="text-xs text-gray-500">Ask anything!</div>
              </div>
            </div>

            <button
              onClick={() => {
                setOpen(false);
                setTimeout(() => {
                  setMessages([]);
                  setThinking(false);
                  setInput("");
                }, 150);
              }}
              className="p-2 rounded-md hover:bg-gray-100"
              title="Close chat"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4 text-gray-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 px-4 py-3 overflow-auto space-y-3 bg-white">
            {messages.length === 0 && (
              <div className="text-lg text-green-700 text-center">
                <p>
                  Hi! I’m your AI Assistant. I help farmers save water, boost
                  crop yield, and make irrigation decisions automatically.
                </p>
              </div>
            )}
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${
                  msg.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[80%] px-4 py-2 rounded-2xl shadow-sm ${
                    msg.sender === "user"
                      ? "bg-green-600 text-white rounded-br-none"
                      : "bg-gray-100 text-gray-800 rounded-bl-none"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}

            {thinking && (
              <div className="flex justify-start">
                <div className="bg-gray-100 px-4 py-2 rounded-2xl rounded-bl-none shadow-sm flex gap-1">
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                  <span
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  ></span>
                  <span
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0.4s" }}
                  ></span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <form
            onSubmit={handleSend}
            className="px-3 py-3 border-t border-gray-100 bg-white"
          >
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 rounded-full px-4 py-2 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-200"
              />
              <button
                type="submit"
                className="flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-green-600 text-white hover:bg-green-700 transition shrink-0"
              >
                Send
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                  />
                </svg>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default Chatbot;