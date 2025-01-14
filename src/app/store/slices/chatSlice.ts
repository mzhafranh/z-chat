import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';

interface getContactsParams {
  token: string | null;
  username: string;
}

interface addNotificationParams {
  token: string | null,
  senderId: string,
  recipientId: string
}

interface Contact {
  id: string,
  username: string,
  totalNotifications: number
}

interface sendMessageParams {
  token: string | null,
  message: string,
  sender: string,
  recipient: string
}

interface resendMessageParams {
  token: string | null,
  tempMessageId: string,
  message: string,
  sender: string,
  recipient: string
}

interface editMessageParams {
  token: string | null,
  id: string,
  newContent: string,
}

interface readMessageParams {
  token: string | null,
  senderId: string,
  recipientId: string
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
  timestamp: string,
  updatedAt: string | null,
  isRead: boolean
}

interface ChatState {
  currentContact: string,
  contactList: Contact[],
  tempMessageList: Message[],
  messageList: Message[],
  page: number,
  totalPage: number,
  loading: boolean,
  error: string | null,
  chatAccessTime: string,
  isContactListOpen: boolean
}

export const fetchMessages = createAsyncThunk(
  'chat/fetchMessages',
  async ({ senderId, recipientId, token, page, chatAccessTime }: fetchMessagesParams, { dispatch, rejectWithValue }) => {
    try {

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
      return rejectWithValue(error || 'An unexpected error occurred');
    }
  }
);

export const refreshMessages = createAsyncThunk(
  'chat/refreshMessages',
  async ({ senderId, recipientId, token }: refreshMessagesParams, { dispatch, rejectWithValue }) => {
    try {
      const response = await fetch(`/api/chat/messages`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          senderId: senderId, // Replace with actual sender ID
          recipientId: recipientId, // Replace with actual recipient ID
          page: 1
        }),
      });
      if (!response.ok) throw new Error('Failed to refresh messages');
      const data = await response.json();
      dispatch(setPage(1))
      dispatch(setTotalPage(data.pagination.totalPages))
      return data; // The payload for fulfilled
    } catch (error) {
      return rejectWithValue(error || 'An unexpected error occurred');
    }
  }
);

export const deleteMessage = createAsyncThunk(
  'chat/deleteMessage',
  async ({ token, id }: deleteMessageParams, { dispatch,  rejectWithValue }) => {
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
    } catch (error) {
      return rejectWithValue(error || 'An unexpected error occurred');
    }
  }
)

export const sendMessage = createAsyncThunk(
  'chat/sendMessage',
  async ({ token, message, sender, recipient }: sendMessageParams, { dispatch, rejectWithValue }) => {
    const tempMessageId = new Date().toISOString()

    dispatch(addTempMessage({
      id: tempMessageId,
      content: message,
      senderId: sender,
      recipientId: recipient,
      timestamp: new Date().toISOString(),
    }))

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
        return rejectWithValue(error || 'An unexpected error occurred');
      } else {
        const data = await response.json();
        dispatch(removeTempMessage(tempMessageId))
        return data; // Message data
      }
    } catch (error) {
      return rejectWithValue(error || 'An unexpected error occurred');
    }
  }
);

export const resendMessage = createAsyncThunk(
  'chat/resendMessage',
  async ({ token, tempMessageId, message, sender, recipient }: resendMessageParams, { dispatch, rejectWithValue }) => {
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
        return rejectWithValue(error || 'An unexpected error occurred');
      } else {
        const data = await response.json();
        dispatch(removeTempMessage(tempMessageId))
        return data; // Message data
      }
    } catch (error) {
      return rejectWithValue(error || 'An unexpected error occurred');
    }
  }
);

export const editMessage = createAsyncThunk(
  'chat/editMessage',
  async ({ token, id, newContent }: editMessageParams, { dispatch, rejectWithValue }) => {
    try {
      const response = await fetch(`/api/chat/messages`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: id,
          newContent: newContent // Replace with actual sender ID
        }),
      });
      if (!response.ok) {
        const error = await response.json()
        return rejectWithValue(error || 'An unexpected error occurred');
      } else {
        const data = await response.json();
        return data; // Message data
      }
    } catch (error) {
      return rejectWithValue(error || 'An unexpected error occurred');
    }
  }
);

export const readMessage = createAsyncThunk(
  'chat/readMessage',
  async ({ token, senderId, recipientId }: readMessageParams, { dispatch, rejectWithValue }) => {
    try {
      const response = await fetch(`/api/chat/messages/notification`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          senderId: senderId,
          recipientId: recipientId,
        }),
      });
      if (!response.ok) {
        const error = await response.json()
        return rejectWithValue(error || 'An unexpected error occurred');
      } else {
        const data = await response.json();
        return data;
      }
    } catch (error) {
      return rejectWithValue(error || 'An unexpected error occurred');
    }
  }
);

export const getContacts = createAsyncThunk(
  'chat/getContacts',
  async ({ token, username }: getContactsParams, { dispatch, rejectWithValue }) => {
    try {
      const response = await fetch("/api/user/contacts", {
        method: "POST",
        headers: { 'Authorization': `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          username: username
        })
      });

      if (!response.ok) throw new Error('Failed to get contacts');
      const data = await response.json();
      return data; // Message data
    } catch (error) {
      return rejectWithValue(error || 'An unexpected error occurred');
    }
  }
)

export const addNotification = createAsyncThunk(
  'chat/addNotification',
  async ({ token, senderId, recipientId }: addNotificationParams, { dispatch }) => {
    try {
      const response = await fetch("/api/chat/messages/notification", {
        method: "POST",
        headers: { 'Authorization': `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          senderId,
          recipientId
        })
      });

      if (!response.ok) throw new Error('Failed to get notification');
      const data = await response.json();
      return data; // Message data
    } catch (err) {
    }
  }
)


// Initial state
const initialState: ChatState = {
  currentContact: 'Recipient',
  contactList: [],
  tempMessageList: [],
  messageList: [],
  page: 1,
  totalPage: 0,
  loading: false, // For loading states
  error: null, // To store error messages
  chatAccessTime: new Date().toISOString(),
  isContactListOpen: false
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
    receiveContact: (state, action) => {
      state.contactList.push(action.payload)
    },
    receiveMessage: (state, action) => {
      state.messageList.unshift(action.payload)
    },
    updateEditedMessage: (state, action) => {
      let newMessageList = state.messageList.map((message) =>
        message.id === action.payload.data.id
          ? { ...message, content: action.payload.data.content, updatedAt: action.payload.data.updatedAt }
          : message
      );
      state.messageList = newMessageList
    },
    addTempMessage: (state, action) => {
      state.tempMessageList.unshift(action.payload)
    },
    removeTempMessage: (state, action) => {
      state.tempMessageList = state.tempMessageList.filter(
        (message) => message.id !== action.payload
      );
    },
    setChatAccessTime(state) {
      state.chatAccessTime = new Date().toISOString();
    },
    toggleContactListState(state) {
      state.isContactListOpen = !(state.isContactListOpen)
    }
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
        state.contactList = action.payload;
      })
      .addCase(getContacts.rejected, (state, action) => {
        state.loading = false;
        state.error = "failed to get contacts";
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
        state.error = "failed to fetch messages";
      })
      .addCase(refreshMessages.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(refreshMessages.fulfilled, (state, action) => {
        state.loading = false;
        state.tempMessageList = []
        state.messageList = action.payload.messages; // Set messages
      })
      .addCase(refreshMessages.rejected, (state, action) => {
        state.loading = false;
        state.error = "failed to refresh messages";
      })
      .addCase(sendMessage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.loading = false;
        state.messageList.unshift(action.payload);
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.loading = false;
        state.error = "failed to send message";
      })
      .addCase(resendMessage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(resendMessage.fulfilled, (state, action) => {
        state.loading = false;
        state.messageList.unshift(action.payload);
      })
      .addCase(resendMessage.rejected, (state, action) => {
        state.loading = false;
        state.error = "failed to send message";
      })
      .addCase(editMessage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(editMessage.fulfilled, (state, action) => {
        state.loading = false;
        let newMessageList = state.messageList.map((message) =>
          message.id === action.payload.data.id
            ? { ...message, content: action.payload.data.content, updatedAt: action.payload.data.updatedAt }
            : message
        );
        state.messageList = newMessageList
      })
      .addCase(editMessage.rejected, (state, action) => {
        state.loading = false;
        state.error = "failed to edit message";
      })
      .addCase(readMessage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(readMessage.fulfilled, (state, action) => {
        state.loading = false;
        let newContactList = state.contactList.map((contact) =>
          contact.username === action.payload.contact
            ? { ...contact, totalNotifications: 0 }
            : contact
        );
        state.contactList = newContactList
      })
      .addCase(readMessage.rejected, (state, action) => {
        state.loading = false;
        state.error = "failed to send message";
      })
      .addCase(deleteMessage.fulfilled, (state, action) => {
        state.messageList = state.messageList.filter(
          (message) => message.id !== action.payload.id
        );
      })
      .addCase(deleteMessage.rejected, (state, action) => {
        state.error = "failed to delete message";
      })
      .addCase(addNotification.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addNotification.fulfilled, (state, action) => {
        state.loading = false;
        let newContactList = state.contactList.map((contact) =>
          contact.username === action.payload.senderId
            ? { ...contact, totalNotifications: action.payload.totalNotifications }
            : contact
        );
        state.contactList = newContactList
      })
      .addCase(addNotification.rejected, (state, action) => {
        state.loading = false;
        state.error = "failed to get notification";
      })
  },
});

export const { setCurrentContact, clearChat, setPage, setTotalPage, receiveMessage, setChatAccessTime, addTempMessage, removeTempMessage, receiveContact, toggleContactListState, updateEditedMessage } = chatSlice.actions;
export default chatSlice.reducer;
