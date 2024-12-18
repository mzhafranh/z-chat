import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Example: Fetch chat messages from an API
export const fetchMessages = createAsyncThunk(
  'chat/fetchMessages',
  async (conversationId, thunkAPI) => {
    try {
      const response = await fetch(`/api/chat/${conversationId}`);
      if (!response.ok) throw new Error('Failed to fetch messages');
      const data = await response.json();
      return data; // The payload for fulfilled
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

// Example: Send a message to the backend
export const sendMessage = createAsyncThunk(
  'chat/sendMessage',
  async ({ conversationId, message }, thunkAPI) => {
    try {
      const response = await fetch(`/api/chat/${conversationId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message }),
      });
      if (!response.ok) throw new Error('Failed to send message');
      const data = await response.json();
      return data; // Message data
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

// Initial state
const initialState = {
  currentContact: '',
  contactList: [],
  messages: [], // Array to hold chat messages
  loading: false, // For loading states
  error: null, // To store error messages
};

// The chat slice
const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    // Clear chat messages
    clearChat: (state) => {
      state.messages = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Handle fetchMessages
      .addCase(fetchMessages.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMessages.fulfilled, (state, action) => {
        state.loading = false;
        state.messages = action.payload; // Set messages
      })
      .addCase(fetchMessages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Handle sendMessage
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.messages.push(action.payload); // Append new message
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { clearChat } = chatSlice.actions;
export default chatSlice.reducer;
