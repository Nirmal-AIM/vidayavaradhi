"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, X, MessageSquare, Bot, User, LogIn, BookOpen, Lightbulb, HelpCircle, Info } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useAuthSession } from "@/hooks/use-auth-session";
import styles from './chatbot.module.css';

interface Message {
  id: string;
  content: string;
  sender: "user" | "bot";
  timestamp: Date;
  category?: string;
}

// No longer need ChatbotProps as we're using the useAuthSession hook

// Advanced response categories
const CATEGORIES = {
  GREETING: "greeting",
  COURSE: "course",
  HELP: "help",
  INFO: "info",
  RECOMMENDATION: "recommendation",
};

// More sophisticated response system with categories
const responseDatabase = [
  {
    keywords: ["hello", "hi", "hey", "greetings"],
    category: CATEGORIES.GREETING,
    responses: [
      "Hello! How can I assist you with your learning journey today?",
      "Hi there! Welcome to Vidyavaradhi. How may I help you?",
      "Greetings! I'm Vidya, your AI learning assistant. What can I do for you today?",
      "Hello! I'm here to help you navigate our educational resources. What are you looking for?"
    ]
  },
  {
    keywords: ["course", "class", "learn", "study", "training"],
    category: CATEGORIES.COURSE,
    responses: [
      "We offer a variety of courses in AI, data science, programming, and more. What subject interests you?",
      "Our courses are designed for different skill levels. Are you a beginner or do you have some experience?",
      "Vidyavaradhi has both self-paced and instructor-led courses. Which format do you prefer?",
      "We have specialized courses for technical skills and soft skills. Which area would you like to explore?"
    ]
  },
  {
    keywords: ["help", "support", "assist", "guidance"],
    category: CATEGORIES.HELP,
    responses: [
      "I can help you navigate courses, answer questions about content, or connect you with learning resources. What do you need?",
      "Need help? I can assist with course selection, technical issues, or learning strategies. Just let me know!",
      "How can I assist you today? I'm here to make your learning experience smoother.",
      "I'm your learning assistant - whether you need help finding resources or understanding concepts, I'm here for you."
    ]
  },
  {
    keywords: ["about", "vidyavaradhi", "platform", "company"],
    category: CATEGORIES.INFO,
    responses: [
      "Vidyavaradhi is an educational platform focused on empowering minds for an AI-driven future through personalized learning experiences.",
      "We are India's premier AI-powered learning platform, designed to bridge the gap between education and industry needs.",
      "Vidyavaradhi combines cutting-edge technology with pedagogical expertise to deliver transformative learning experiences.",
      "Our mission is to democratize quality education and make it accessible to learners across India."
    ]
  },
  {
    keywords: ["recommend", "suggestion", "advise", "best"],
    category: CATEGORIES.RECOMMENDATION,
    responses: [
      "Based on popular trends, our AI and data science courses are highly recommended for future-ready skills.",
      "For beginners, I'd recommend starting with our 'Introduction to Digital Literacy' course.",
      "If you're interested in career advancement, our 'Industry 4.0 Skills' certification is very valuable.",
      "Our most highly-rated course is 'Machine Learning for Real-World Applications' - it has excellent reviews!"
    ]
  }
];

// Context-aware follow-up responses
const followUpResponses: Record<string, string[]> = {
  [CATEGORIES.GREETING]: [
    "Is there something specific you'd like to learn about today?",
    "Are you looking for courses or general information about our platform?"
  ],
  [CATEGORIES.COURSE]: [
    "Would you like me to recommend specific courses based on your interests?",
    "Do you have any specific learning goals I can help you achieve?"
  ],
  [CATEGORIES.HELP]: [
    "Is there a particular area you need assistance with?",
    "Would you like me to connect you with our support team for more detailed help?"
  ],
  [CATEGORIES.INFO]: [
    "Would you like to know more about our teaching methodology?",
    "Are you interested in learning about our partnerships with industry leaders?"
  ],
  [CATEGORIES.RECOMMENDATION]: [
    "Would you like more personalized recommendations based on your background?",
    "Shall I tell you more about any of these recommended courses?"
  ]
};

export function Chatbot() {
  const { toast } = useToast();
  const { session, isLoading } = useAuthSession();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [lastCategory, setLastCategory] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Extract user information from session
  const userId = session?.userId || "guest";
  const userName = session?.name || "Guest";
  const userType = session?.isAuthenticated ? session.role : "guest";
  
  // Load chat history from localStorage on component mount
  useEffect(() => {
    const storedMessages = localStorage.getItem(`vidya_chat_${userId || 'guest'}`);
    if (storedMessages) {
      try {
        const parsedMessages = JSON.parse(storedMessages);
        // Convert string timestamps back to Date objects
        const messagesWithDateObjects = parsedMessages.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        }));
        setMessages(messagesWithDateObjects);
      } catch (e) {
        console.error("Failed to parse stored messages", e);
        initializeChat();
      }
    } else {
      initializeChat();
    }
  }, [userId]);

  // Save messages to localStorage whenever they change
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem(`vidya_chat_${userId || 'guest'}`, JSON.stringify(messages));
    }
  }, [messages, userId]);

  const initializeChat = useCallback(() => {
    const greeting = userType === "guest" 
      ? "Hello! I'm Vidya, your learning assistant. How can I help you today?"
      : `Welcome back, ${userName || 'valued learner'}! How can I assist you with your ${userType} journey today?`;
    
    setMessages([{
      id: "1",
      content: greeting,
      sender: "bot",
      timestamp: new Date(),
      category: CATEGORIES.GREETING
    }]);
  }, [userName, userType]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // More sophisticated response generation
  const generateResponse = (userMessage: string): { response: string; category: string } => {
    const lowercaseMessage = userMessage.toLowerCase();
    
    // Try to match with a category based on keywords
    for (const categoryData of responseDatabase) {
      for (const keyword of categoryData.keywords) {
        if (lowercaseMessage.includes(keyword)) {
          const responses = categoryData.responses;
          const response = responses[Math.floor(Math.random() * responses.length)];
          
          // If we have a previous category and it matches current, maybe add a follow-up
          if (lastCategory === categoryData.category && Math.random() > 0.5) {
            const followUps = followUpResponses[categoryData.category];
            const followUp = followUps[Math.floor(Math.random() * followUps.length)];
            return { 
              response: `${response} ${followUp}`, 
              category: categoryData.category 
            };
          }
          
          return { 
            response, 
            category: categoryData.category 
          };
        }
      }
    }
    
    // If no category matched, use a default response
    const defaultResponses = [
      "That's an interesting question. Let me help you with that.",
      "I understand you're asking about that. Our resources cover this topic extensively.",
      "Great question! You can find more information in our learning modules.",
      "I'd be happy to assist you with that. Could you provide more details?",
      "That's something our platform can definitely help with. Let me guide you.",
    ];
    
    return { 
      response: defaultResponses[Math.floor(Math.random() * defaultResponses.length)],
      category: "general"
    };
  };

  const handleSendMessage = () => {
    if (!input.trim()) return;
    
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      sender: "user",
      timestamp: new Date(),
    };
    
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);
    
    // Simulate bot typing delay
    setTimeout(() => {
      const { response, category } = generateResponse(input);
      
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: response,
        sender: "bot",
        timestamp: new Date(),
        category
      };
      
      setMessages((prev) => [...prev, botResponse]);
      setLastCategory(category);
      setIsTyping(false);
    }, 1000);
  };

  const handleClearHistory = () => {
    localStorage.removeItem(`vidya_chat_${userId || 'guest'}`);
    initializeChat();
    toast({
      title: "Chat history cleared",
      description: "Your conversation history has been reset.",
    });
  };

  // Get icon based on message category
  const getCategoryIcon = (category?: string) => {
    switch(category) {
      case CATEGORIES.COURSE:
        return <BookOpen size={16} className="mr-1" />;
      case CATEGORIES.HELP:
        return <HelpCircle size={16} className="mr-1" />;
      case CATEGORIES.INFO:
        return <Info size={16} className="mr-1" />;
      case CATEGORIES.RECOMMENDATION:
        return <Lightbulb size={16} className="mr-1" />;
      default:
        return null;
    }
  };

  return (
    <>
      {/* Floating chat button */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 right-4 rounded-full w-14 h-14 shadow-lg bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 z-50 flex items-center justify-center transition-transform hover:scale-105"
        aria-label="Open chat"
      >
        {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
      </Button>

      {/* Chat window */}
      {isOpen && (
        <Card className="fixed bottom-20 right-4 w-80 sm:w-96 h-[500px] shadow-xl z-50 flex flex-col animate-fade-in border-2 border-indigo-100 dark:border-indigo-900 rounded-2xl overflow-hidden">
          {/* Chat header */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8 bg-white">
                <Bot size={20} className="text-indigo-600" />
              </Avatar>
              <div>
                <h3 className="font-medium">Vidya Assistant</h3>
                <p className="text-xs opacity-90">
                  {userId ? `Chatting as ${userName || userId}` : 'Guest Mode'}
                </p>
              </div>
            </div>
            <div className="flex gap-1">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={handleClearHistory}
                className="text-white hover:bg-white/20"
                title="Clear chat history"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 6h18"></path>
                  <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                  <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                </svg>
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setIsOpen(false)}
                className="text-white hover:bg-white/20"
              >
                <X size={18} />
              </Button>
            </div>
          </div>

          {/* User authentication status */}
          {!userId && (
            <div className="bg-amber-50 dark:bg-amber-900/30 p-2 text-xs flex items-center justify-center gap-1 border-b border-amber-100 dark:border-amber-800">
              <LogIn size={12} />
              <span>You're in guest mode. <a href="/login" className="text-indigo-600 dark:text-indigo-400 font-medium hover:underline">Sign in</a> for personalized assistance.</span>
            </div>
          )}

          {/* Messages area */}
          <ScrollArea className="flex-1 p-4 bg-gradient-to-b from-indigo-50/50 to-white dark:from-gray-900/50 dark:to-gray-950">
            <div className="flex flex-col gap-3">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.sender === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-2xl shadow-sm ${
                      message.sender === "user"
                        ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white"
                        : "bg-white dark:bg-gray-800 border border-indigo-100 dark:border-gray-700"
                    }`}
                  >
                    {message.sender === "bot" && message.category && (
                      <div className="flex items-center text-xs text-indigo-600 dark:text-indigo-400 mb-1 font-medium">
                        {getCategoryIcon(message.category)}
                        {message.category.charAt(0).toUpperCase() + message.category.slice(1)}
                      </div>
                    )}
                    <p className="text-sm">{message.content}</p>
                    <p className="text-xs opacity-70 mt-1 flex justify-end">
                      {message.timestamp.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="max-w-[80%] p-3 rounded-2xl bg-white dark:bg-gray-800 border border-indigo-100 dark:border-gray-700 shadow-sm">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce"></div>
                      <div className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                      <div className="w-2 h-2 rounded-full bg-indigo-600 animate-bounce" style={{ animationDelay: "0.4s" }}></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          {/* Input area */}
          <div className="p-3 border-t bg-white dark:bg-gray-900">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex gap-2"
            >
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 border-indigo-200 dark:border-indigo-800 focus-visible:ring-indigo-500"
              />
              <Button 
                type="submit" 
                size="icon"
                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
              >
                <Send size={18} />
              </Button>
            </form>
          </div>
        </Card>
      )}
    </>
  );
}