'use client';

import axios from 'axios';
import { FC, useRef, useState } from 'react';
import { toast } from 'react-hot-toast';
import TextareaAutosize from 'react-textarea-autosize';
import Button from './custom-ui/Button';
import { Message } from '@/lib/validations/message';
import { addMessage } from '@/store/slices/chatSlice';
import { useDispatch } from 'react-redux';

interface ChatInputProps {
  chatPartner: User;
  chatId: string;
}

const ChatInput: FC<ChatInputProps> = ({ chatPartner, chatId }) => {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [input, setInput] = useState<string>('');

  const dispatch = useDispatch();

  const sendMessage = async () => {
    if (!input || isLoading) return;
    setIsLoading(true);

    try {
      const response = await axios.post('/api/message/send', {
        text: input,
        chatId,
      });
      const newMessage: Message = response.data;
      const formattedMessage = {
        ...newMessage,
        timestamp: new Date(newMessage.timestamp).toISOString(),
      };
      dispatch(addMessage(formattedMessage));
      setInput('');
      textareaRef.current?.focus();
    } catch {
      toast.error('Something went wrong. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='border-t border-gray-200 px-4 pt-4 mb-2 sm:mb-0'>
      <div className='relative flex-1 overflow-hidden rounded-lg shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-indigo-600'>
        <TextareaAutosize
          ref={textareaRef}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              sendMessage();
            }
          }}
          rows={1}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={`Message ${chatPartner?.name}`}
          className='block w-full resize-none border-0 bg-transparent text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:py-1.5 sm:text-sm sm:leading-6'
        />

        <div
          onClick={() => textareaRef.current?.focus()}
          className='py-2'
          aria-hidden='true'
        >
          <div className='py-px'>
            <div className='h-9' />
          </div>
        </div>

        <div className='absolute right-0 bottom-0 flex justify-between py-2 pl-3 pr-2'>
          <div className='flex-shrink-0'>
            <Button isLoading={isLoading} onClick={sendMessage} type='submit'>
              Post
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInput;
