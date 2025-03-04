import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { formatISO } from 'date-fns';

interface Message {
  id: string;
  content: string; // ✅ Changed from text to content
  sender: string;
  receiver: string;
  timestamp: string;
}

interface ChatState {
  messages: Message[];
}

const initialState: ChatState = {
  messages: [],
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    addMessage: (state, action: PayloadAction<Message>) => {
      const message = action.payload;
      message.timestamp = formatISO(new Date(message.timestamp));
      state.messages.unshift(message);
    },
    setInitialMessages: (state, action: PayloadAction<Message[]>) => {
      state.messages = action.payload; // Set initial messages
    },
  },
});

export const { addMessage, setInitialMessages } = chatSlice.actions;
export default chatSlice.reducer;
