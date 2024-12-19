import { useState } from "react";
import ChatList from "./ChatList";
import ChatReceiver from "./ChatReceiver";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store/store";
import { sendMessage } from "../store/slices/chatSlice";

export default function ChatBox() {
    const dispatch = useDispatch<AppDispatch>();
    const [message, setMessage] = useState("");
    const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
    const { currentContact } = useSelector((state: RootState) => state.chat);
    const { username } = useSelector((state: RootState) => state.user);

    const handleSubmit = async (e) => {
      e.preventDefault(); // Prevent the default form submission behavior
  
      if (!message.trim()) {
        return; // Don't send an empty message
      }
      
      const messageSent = await dispatch(sendMessage({token, message, sender:username, recipient:currentContact}))
      if (messageSent) {
        setMessage("")
      }
    };

    return (
        <div className="container w-10/12 flex flex-col">
            <ChatReceiver/>
            <div className="rounded-lg h-full shadow-centered shadow-slate-500 mt-5 p-5 flex flex-col">
                <ChatList/>
                <form onSubmit={handleSubmit}>
                    <div className="flex flex-row">
                        <input
                            type="text"
                            id="message"
                            name="message"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            className="block w-full mr-2 text-sm px-3 py-2 rounded-full border border-solid border-gray-300 shadow-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Write a message..."
                            required
                        />
                        <button className="w-9 h-9 bg-blue-500 text-white rounded-full flex items-center justify-center hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-200">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M12 5l7 7-7 7" />
                            </svg>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
