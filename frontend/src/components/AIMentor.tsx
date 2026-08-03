import { useState, useRef, useEffect } from "react";
import { useStore } from "../store/useStore";
import { MessageSquare, X, Send, Sparkles, Brain, Trash2 } from "lucide-react";

export default function AIMentor() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const { chatMessages, sendChatMessage, clearChat, isLoading } = useStore();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || isLoading) return;

    const message = input.trim();
    setInput("");
    await sendChatMessage(message);
  };

  const handleQuickQuestion = async (q: string) => {
    if (isLoading) return;
    await sendChatMessage(q);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  const quickQuestions = [
    "What should I learn next?",
    "Explain binary search.",
    "How do I boost my ATS score?",
    "Generate a 7-day study plan"
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Chat Window */}
      {isOpen && (
        <div className="w-[380px] h-[500px] mb-4 rounded-2xl border border-slate-700/60 shadow-2xl flex flex-col overflow-hidden bg-slate-900/95 backdrop-blur-lg">
          {/* Header */}
          <div className="bg-gradient-to-r from-primary to-secondary px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="bg-white/20 p-1.5 rounded-lg">
                <Brain className="h-5 w-5 text-white animate-pulse" />
              </div>
              <div>
                <h4 className="font-bold text-white text-sm">SkillForge AI Mentor</h4>
                <p className="text-[10px] text-cyan-100 flex items-center gap-0.5">
                  <Sparkles className="h-3 w-3" /> Online & Adaptive
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={clearChat}
                className="p-1 rounded hover:bg-white/10 text-white/80 hover:text-white"
                title="Clear Chat"
              >
                <Trash2 className="h-4 w-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded hover:bg-white/10 text-white/80 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Messages list */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 scroll-smooth">
            {chatMessages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm ${
                    msg.sender === "user"
                      ? "bg-primary text-white rounded-tr-none"
                      : "bg-slate-800 text-slate-200 border border-slate-700 rounded-tl-none"
                  }`}
                  style={{ whiteSpace: "pre-wrap" }}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-slate-800 text-slate-400 border border-slate-700 rounded-2xl rounded-tl-none px-4 py-2.5 text-sm flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce" />
                  <span className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce [animation-delay:0.2s]" />
                  <span className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce [animation-delay:0.4s]" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick recommendations */}
          {chatMessages.length === 1 && (
            <div className="px-4 py-2 border-t border-slate-800/80 bg-slate-900/40">
              <p className="text-[10px] text-slate-400 mb-1.5">Ask a quick question:</p>
              <div className="flex flex-wrap gap-1.5">
                {quickQuestions.map((q) => (
                  <button
                    key={q}
                    onClick={() => handleQuickQuestion(q)}
                    className="text-[10px] bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700/60 px-2 py-1 rounded-md transition-all text-left"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input field */}
          <form onSubmit={handleSend} className="p-3 border-t border-slate-800 flex gap-2 bg-slate-900">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask your mentor..."
              disabled={isLoading}
              className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-sm text-slate-100 focus:outline-none focus:border-primary disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="bg-primary hover:bg-primary-dark text-white p-2.5 rounded-xl transition-all disabled:opacity-50 flex items-center justify-center"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      )}

      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-gradient-to-r from-primary to-secondary text-white p-4 rounded-full shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center animate-float"
        title="AI Career Mentor"
      >
        {isOpen ? <X className="h-6 w-6" /> : <MessageSquare className="h-6 w-6" />}
      </button>
    </div>
  );
}
