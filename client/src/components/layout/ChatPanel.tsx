import { ChatMessage } from "@/types/index.types";
import {
  PaperAirplaneIconSolid,
  UserIcon,
  UsersIconSolid,
  TvIconSolid,
} from "./Icon"; // Assuming UserIcon is a generic user avatar
import * as React from "react";

const mockMessages: ChatMessage[] = [
  {
    id: "1",
    user: "User123",
    message: "Go Giants!",
    timestamp: "10:32",
    userColor: "text-sky-400",
  },
  {
    id: "2",
    user: "PadresFan_No1",
    message: "Padres will win this for sure!!!",
    timestamp: "10:33",
    userColor: "text-green-400",
  },
  {
    id: "3",
    user: "SportsLover",
    message: "Great game so far.",
    timestamp: "10:35",
    userColor: "text-yellow-400",
  },
  {
    id: "4",
    user: "Anonymous",
    message: "Anyone know the score of the other game?",
    timestamp: "10:36",
    userColor: "text-purple-400",
  },
  {
    id: "5",
    user: "Admin",
    message: "Please keep the chat respectful. Thanks!",
    timestamp: "10:38",
    userColor: "text-red-500 font-semibold",
  },
];

const ChatPanel: React.FC = () => {
  const [activeTab, setActiveTab] = React.useState<"general" | "match">(
    "general"
  );
  const [messages, setMessages] = React.useState<ChatMessage[]>(mockMessages);
  const [newMessage, setNewMessage] = React.useState("");

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() === "") return;
    const msg: ChatMessage = {
      id: String(Date.now()),
      user: "CurrentUser", // Replace with actual user
      avatar: "https://picsum.photos/seed/currentUser/32/32",
      message: newMessage,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      userColor: "text-orange-400",
    };
    setMessages((prev) => [...prev, msg]);
    setNewMessage("");
    // Auto scroll to bottom would be here
  };

  return (
    <div className="bg-slate-800 text-white rounded-lg shadow-xl flex flex-col h-[500px] max-h-[70vh]">
      {/* Tabs */}
      <div className="flex border-b border-slate-700">
        <button
          onClick={() => setActiveTab("general")}
          className={`flex-1 py-2 px-3 text-sm font-medium flex items-center justify-center space-x-1
            ${
              activeTab === "general"
                ? "bg-slate-700 text-yellow-400 border-b-2 border-yellow-400"
                : "text-gray-400 hover:bg-slate-700/50"
            }`}
        >
          <UsersIconSolid className="w-4 h-4" />
          <span>Chung</span>
        </button>
        <button
          onClick={() => setActiveTab("match")}
          className={`flex-1 py-2 px-3 text-sm font-medium flex items-center justify-center space-x-1
            ${
              activeTab === "match"
                ? "bg-slate-700 text-yellow-400 border-b-2 border-yellow-400"
                : "text-gray-400 hover:bg-slate-700/50"
            }`}
        >
          <TvIconSolid className="w-4 h-4" />
          <span>Trận Đấu</span>
        </button>
      </div>

      {/* Message Area */}
      <div className="flex-grow p-3 space-y-3 overflow-y-auto">
        {messages.map((msg) => (
          <div key={msg.id} className="flex items-start space-x-2 text-xs">
            {msg.avatar ? (
              <img
                src={msg.avatar}
                alt={msg.user}
                className="w-6 h-6 rounded-full flex-shrink-0"
              />
            ) : (
              <UserIcon className="w-6 h-6 rounded-full text-gray-500 bg-slate-700 p-0.5 flex-shrink-0" />
            )}
            <div className="flex-grow">
              <div className="flex items-baseline space-x-1.5">
                <span
                  className={`font-semibold ${msg.userColor || "text-sky-400"}`}
                >
                  {msg.user}
                </span>
                <span className="text-gray-500 text-[10px]">
                  {msg.timestamp}
                </span>
              </div>
              <p className="text-gray-300 leading-snug">{msg.message}</p>
            </div>
          </div>
        ))}
        <div id="chat-bottom" className="h-px"></div> {/* For scrolling */}
      </div>

      {/* Input Area */}
      <form
        onSubmit={handleSendMessage}
        className="p-2 border-t border-slate-700 flex items-center space-x-2"
      >
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Xem bình luận..."
          className="flex-grow bg-slate-700 border border-slate-600 rounded-md py-1.5 px-3 text-xs text-white placeholder-gray-500 focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500 outline-none"
          aria-label="Chat message input"
        />
        <button
          type="submit"
          className="bg-yellow-500 hover:bg-yellow-600 text-slate-900 p-1.5 rounded-md transition-colors"
          aria-label="Send message"
        >
          <PaperAirplaneIconSolid className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};

export default ChatPanel;
