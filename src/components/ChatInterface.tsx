"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ChatMessage {
  id: string;
  content: string;
  sender: "user" | "ai";
  timestamp: Date;
  aiProvider?: "gpt" | "grok" | "deepseek";
  department?: string;
}

interface ChatInterfaceProps {
  onStatsUpdate: (stats: any) => void;
}

export default function ChatInterface({ onStatsUpdate }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      content: "Hello! I'm SKV.ChatGB, your AI assistant for UAE business services. I can help you with business setup, tax services, visa applications, document management, and more. How can I assist you today?",
      sender: "ai",
      timestamp: new Date(),
      aiProvider: "gpt",
    }
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedAI, setSelectedAI] = useState<"gpt" | "grok" | "deepseek">("gpt");
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ 
        behavior: "smooth",
        block: "end",
        inline: "nearest"
      });
    }, 100);
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const aiProviders = {
    gpt: { name: "ChatGPT", color: "bg-green-600", icon: "🤖" },
    grok: { name: "Grok", color: "bg-purple-600", icon: "⚡" },
    deepseek: { name: "DeepSeek", color: "bg-blue-600", icon: "🔍" },
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content: inputMessage,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: inputMessage,
          aiProvider: selectedAI,
          language: selectedLanguage,
          context: messages.slice(-5), // Send last 5 messages for context
        }),
      });

      const data = await response.json();

      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: data.response || "I'm sorry, I couldn't process your request right now. Please try again.",
        sender: "ai",
        timestamp: new Date(),
        aiProvider: selectedAI,
        department: data.department,
      };

      setMessages(prev => [...prev, aiMessage]);

      // Update stats
      onStatsUpdate((prevStats: any) => {
        const newStats = { ...prevStats, totalChats: prevStats.totalChats + 1 };
        localStorage.setItem("skv-chatbot-stats", JSON.stringify(newStats));
        return newStats;
      });

    } catch (error) {
      console.error("Error sending message:", error);
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: "I'm experiencing technical difficulties. Please try again or contact our support team at info@skvbusiness.com",
        sender: "ai",
        timestamp: new Date(),
        aiProvider: selectedAI,
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const quickActions = [
    "Business Setup in Dubai",
    "VAT Registration",
    "Employment Visa Requirements",
    "Golden Visa Eligibility",
    "Ejari Registration",
    "Trade License Renewal",
    "Bank Account Opening",
    "Document Attestation",
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* Chat Area */}
      <div className="lg:col-span-3">
        <Card className="bg-blue-900 border-blue-800 h-[600px] flex flex-col shadow-lg">
          <CardHeader className="flex-shrink-0 pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <CardTitle className="text-white">SKV.ChatGB</CardTitle>
                <Badge 
                  className={`${aiProviders[selectedAI].color} text-white`}
                >
                  {aiProviders[selectedAI].name}
                </Badge>
                <Badge variant="outline" className="text-blue-200 border-blue-400">
                  {selectedLanguage.toUpperCase()}
                </Badge>
              </div>
              <div className="text-sm text-blue-200">
                {messages.length} messages
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="flex-1 flex flex-col p-0">
            {/* Messages */}
            <div className="flex-1 px-4 overflow-y-auto">
              <div className="space-y-4 pb-4 h-full">
                {messages.map((message) => (
                  <div key={message.id} className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[80%] ${
                      message.sender === "user" 
                        ? "bg-blue-600 text-white" 
                        : "bg-blue-900/50 text-blue-100"
                    } rounded-lg p-3`}>
                      <div className="text-sm whitespace-pre-wrap">
                        {message.content}
                      </div>
                      <div className="flex items-center justify-between mt-2 text-xs opacity-70">
                        <span>{message.timestamp.toLocaleTimeString()}</span>
                        {message.aiProvider && (
                          <span>{aiProviders[message.aiProvider]?.name}</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-blue-900/50 text-blue-100 rounded-lg p-3">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                        <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-blue-700">
              <div className="flex items-center space-x-3">
                <Input
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Ask about business setup, visas, tax services..."
                  className="bg-blue-900/50 border-blue-600 text-white placeholder:text-blue-300"
                  onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                  disabled={isLoading}
                />
                <Button 
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim() || isLoading}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {isLoading ? "Sending..." : "Send"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sidebar */}
      <div className="space-y-4">
        {/* AI & Language Settings */}
        <Card className="bg-blue-900 border-blue-800 shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="text-white text-lg">Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-blue-200 text-sm mb-2 block">AI Provider</label>
              <Select value={selectedAI} onValueChange={(value) => setSelectedAI(value as "gpt" | "grok" | "deepseek")}>
                <SelectTrigger className="bg-blue-900/50 border-blue-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-blue-900 border-blue-600">
                  {Object.entries(aiProviders).map(([key, provider]) => (
                    <SelectItem key={key} value={key} className="text-white">
                      {provider.icon} {provider.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-blue-200 text-sm mb-2 block">Language</label>
              <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                <SelectTrigger className="bg-blue-900/50 border-blue-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-blue-900 border-blue-600">
                  <SelectItem value="en" className="text-white">🇺🇸 English</SelectItem>
                  <SelectItem value="ar" className="text-white">🇦🇪 العربية</SelectItem>
                  <SelectItem value="hi" className="text-white">🇮🇳 हिंदी</SelectItem>
                  <SelectItem value="ur" className="text-white">🇵🇰 اردو</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Quick Questions */}
        <Card className="bg-blue-900 border-blue-800 shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="text-white text-lg">Quick Questions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {quickActions.map((question, index) => (
              <Button
                key={index}
                variant="ghost"
                size="sm"
                onClick={() => setInputMessage(question)}
                className="w-full text-left text-blue-200 hover:text-white hover:bg-blue-700 justify-start p-2 h-auto"
              >
                {question}
              </Button>
            ))}
          </CardContent>
        </Card>

        {/* Contact Info */}
        <Card className="bg-blue-900 border-blue-800 shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="text-white text-lg">Contact</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div>
              <div className="text-white font-medium">General</div>
              <div className="text-blue-200">info@skvbusiness.com</div>
            </div>
            <div className="border-t border-blue-600 pt-2">
              <div className="text-white font-medium mb-2">Departments</div>
              <div className="space-y-1 text-blue-200 text-xs">
                <div>🏢 Tax: mohit@skvbusiness.com</div>
                <div>📋 Legal: sunil@skvbusiness.com</div>
                <div>🌍 Global: nikita@skvbusiness.com</div>
                <div>✈️ Visa: rahul@skvbusiness.com</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}