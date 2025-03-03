'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import { Message } from '@/lib/validations/message';

interface ChatContextType {
  messages: Message[];
  addMessage: (message: Message) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider = ({ children, initialMessages }: { children: ReactNode; initialMessages: Message[] }) => {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
// console.log('messages from the cntext',messages)
  const addMessage = (message: Message) => {
    setMessages((prev) => [message, ...prev]);
  };

  return (
    <ChatContext.Provider value={{ messages, addMessage }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};