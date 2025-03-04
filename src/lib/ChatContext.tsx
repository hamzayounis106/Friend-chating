// 'use client';

// import {
//   createContext,
//   useContext,
//   useState,
//   ReactNode,
//   useCallback,
// } from 'react';
// import { Message } from '@/lib/validations/message';

// interface ChatContextType {
//   messages: Message[];
//   addMessage: (message: Message) => void;
// }

// const ChatContext = createContext<ChatContextType | undefined>(undefined);

// export const ChatProvider = ({
//   children,
//   initialMessages,
// }: {
//   children: ReactNode;
//   initialMessages: Message[];
// }) => {
//   const [messages, setMessages] = useState<Message[]>(initialMessages);

//   // Prevent unnecessary re-renders using useCallback
//   const addMessage = useCallback((message: Message) => {
//     setMessages((prev) => [message, ...prev]);
//   }, []);

//   return (
//     <ChatContext.Provider value={{ messages, addMessage }}>
//       {children}
//     </ChatContext.Provider>
//   );
// };

// export const useChat = () => {
//   const context = useContext(ChatContext);
//   if (!context) {
//     throw new Error('useChat must be used within a ChatProvider');
//   }
//   return context;
// };
