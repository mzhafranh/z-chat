import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';

interface getContactsParams {
  token: string | null;
}

interface Contact {
  id: string,
  username: string
}

interface Message {
  id: string,
  content: string,
  senderId: string,
  recipientId: string,
  timestamp: string
}

interface ChatState {
  currentContact: string | null,
  contactList: Contact[],
  messages: Message[],
  loading: boolean,
  error: string | null,
}

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

export const getContacts = createAsyncThunk(
  'chat/getContacts',
  async ({ token }: getContactsParams, { dispatch }) => {
    try {
      const response = await fetch("/api/user", {
        method: "GET",
        headers: { 'Authorization': `Bearer ${token}`, "Content-Type": "application/json" },
      });

      if (!response.ok) throw new Error('Failed to get contacts');
      const data = await response.json();
      return data; // Message data
    } catch (err) {
      console.log(err);
    }
  }
)

// Initial state
const initialState: ChatState = {
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
    setCurrentContact: (state, action) => {
      state.currentContact = action.payload;
    },
    clearChat: (state) => {
      state.messages = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Handle getContacts
      .addCase(getContacts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getContacts.fulfilled, (state, action) => {
        state.loading = false;
        state.contactList = action.payload; // Set messages
      })
      .addCase(getContacts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
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

export const { setCurrentContact, clearChat } = chatSlice.actions;
export default chatSlice.reducer;
