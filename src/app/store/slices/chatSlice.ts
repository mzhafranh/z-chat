import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';

interface getContactsParams {
  token: string | null;
}

interface Contact {
  id: string,
  username: string
}

interface sendMessageParams {
  token: string | null,
  message: string,
  sender: string,
  recipient: string
}

interface fetchMessagesParams {
  token: string | null,
  senderId: string,
  recipientId: string,
  page: number,
  chatAccessTime: string
}

interface refreshMessagesParams {
  token: string | null,
  senderId: string,
  recipientId: string,
}

interface deleteMessageParams {
  token: string | null,
  id: string
}

interface Message {
  id: string,
  content: string,
  senderId: string,
  recipientId: string,
  timestamp: string
}

interface ChatState {
  currentContact: string,
  contactList: Contact[],
  messageList: Message[],
  page: number,
  totalPage: number,
  loading: boolean,
  error: string | null,
  chatAccessTime: string
}

// Example: Fetch chat messages from an API
export const fetchMessages = createAsyncThunk(
  'chat/fetchMessages',
  async ({ senderId, recipientId, token, page, chatAccessTime }: fetchMessagesParams, {dispatch}) => {
    try {
      console.log("fetchMessage - senderId:", senderId)
      console.log("fetchMessage - recipientId:", recipientId)
      console.log("fetchMessage - page:", page)
      const response = await fetch(`/api/chat/messages`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          senderId: senderId, // Replace with actual sender ID
          recipientId: recipientId, // Replace with actual recipient ID
          page: page,
          chatAccessTime: chatAccessTime
        }),
      });
      if (!response.ok) throw new Error('Failed to fetch messages');
      const data = await response.json();
      dispatch(setPage(data.pagination.currentPage))
      dispatch(setTotalPage(data.pagination.totalPages))
      return data; // The payload for fulfilled
    } catch (error) {
      console.log("Error fetching messages", error)
      return
    }
  }
);

export const refreshMessages = createAsyncThunk(
  'chat/refreshMessages',
  async ({ senderId, recipientId, token}: refreshMessagesParams, {dispatch}) => {
    try {
      console.log("refreshMessage - senderId:", senderId)
      console.log("refreshMessage - recipientId:", recipientId)
      const response = await fetch(`/api/chat/messages`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          senderId: senderId, // Replace with actual sender ID
          recipientId: recipientId, // Replace with actual recipient ID
          page: 1
        }),
      });
      if (!response.ok) throw new Error('Failed to fetch messages');
      const data = await response.json();
      dispatch(setPage(1))
      dispatch(setTotalPage(data.pagination.totalPages))
      return data; // The payload for fulfilled
    } catch (error) {
      console.log("Error fetching messages", error)
      return
    }
  }
);

export const deleteMessage = createAsyncThunk(
  'chat/deleteMessage',
  async ({ token, id }: deleteMessageParams, { dispatch }) => {
    try {
      const response = await fetch("/api/chat/messages", {
        method: "DELETE",
        headers: { 'Authorization': `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          id: id
        }),
      });

      if (!response.ok) throw new Error('Failed to delete message');
      const data = await response.json();
      return data; // Message data
    } catch (err) {
      console.log(err);
    }
  }
)

// Example: Send a message to the backend
export const sendMessage = createAsyncThunk(
  'chat/sendMessage',
  async ({ token, message, sender, recipient }: sendMessageParams) => {
    try {
      const response = await fetch(`/api/chat/`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: message,
          senderId: sender, // Replace with actual sender ID
          recipientId: recipient, // Replace with actual recipient ID
        }),
      });
      if (!response.ok) {
        const error = await response.json()
        console.log('Failed to send message', error);
      } else {
        const data = await response.json();
        console.log("Message sent successfully");
        return data; // Message data
      }
    } catch (error) {
      console.log("Failed to send message", error);
      return
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
  currentContact: 'Recipient',
  contactList: [],
  messageList: [], // Array to hold chat messages
  page: 1,
  totalPage: 0,
  loading: false, // For loading states
  error: null, // To store error messages
  chatAccessTime: new Date().toISOString()
};

// The chat slice
const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setCurrentContact: (state, action) => {
      state.currentContact = action.payload;
    },
    setPage: (state, action) => {
      state.page = action.payload;
    },
    setTotalPage: (state, action) => {
      state.totalPage = action.payload;
    },
    clearChat: (state) => {
      state.messageList = [];
    },
    receiveMessage: (state, action) => {
      state.messageList.unshift(action.payload)
    },
    setChatAccessTime(state) {
      state.chatAccessTime = new Date().toISOString();
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
      .addCase(fetchMessages.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMessages.fulfilled, (state, action) => {
        state.loading = false;
        state.messageList = [...state.messageList, ...action.payload.messages]; // Set messages
      })
      .addCase(fetchMessages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(refreshMessages.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(refreshMessages.fulfilled, (state, action) => {
        state.loading = false;
        state.messageList = action.payload.messages; // Set messages
      })
      .addCase(refreshMessages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Handle sendMessage
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.messageList.unshift(action.payload); // Append new message
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(deleteMessage.fulfilled, (state, action) => {
        state.messageList = state.messageList.filter(
          (message) => message.id !== action.payload.id
        );
      })
      .addCase(deleteMessage.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { setCurrentContact, clearChat, setPage, setTotalPage, receiveMessage, setChatAccessTime } = chatSlice.actions;
export default chatSlice.reducer;
