import { useState } from "react";
import ChatList from "./ChatList";
import ChatReceiver from "./ChatReceiver";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store/store";
import { sendMessage } from "../store/slices/chatSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane } from "@fortawesome/free-regular-svg-icons";

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

        dispatch(sendMessage({ token, message, sender: username, recipient: currentContact }))
        setMessage("")
    };

    return (
        <div className="container h-full w-10/12 flex flex-col">
            <ChatReceiver />
            <div
                className="rounded-lg shadow-centered shadow-slate-500 mt-5 p-5 flex flex-col"
                style={{ height: "90%" }}
            >
                <ChatList />
                <form
                    onSubmit={handleSubmit}
                    className="mt-4"
                >
                    <div className="flex flex-row">
                        <textarea
                            id="message"
                            name="message"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter" && !e.shiftKey) {
                                    e.preventDefault(); // Prevents adding a new line
                                    handleSubmit(e); // Submit the form
                                }
                            }}
                            className="block w-full h-16 mr-2 text-sm px-3 py-2 rounded-lg border border-solid border-gray-300 shadow-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 resize-none"
                            placeholder="Write a message..."
                            required
                        />
                        <button
                            className="w-9 h-9 bg-blue-500 text-white rounded-full flex items-center justify-center align-bottom hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-200"
                        >
                            <FontAwesomeIcon icon={faPaperPlane} className="fa-lg" />
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
    
    
}
