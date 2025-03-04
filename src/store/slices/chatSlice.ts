import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Message {
  id: string;
  text: string;
  sender: string;
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
      state.messages.unshift(action.payload); // Add message to the beginning
    },
    setInitialMessages: (state, action: PayloadAction<Message[]>) => {
      state.messages = action.payload; // Set initial messages
    },
  },
});

export const { addMessage, setInitialMessages } = chatSlice.actions;
export default chatSlice.reducer;
