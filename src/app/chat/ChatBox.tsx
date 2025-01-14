import { KeyboardEvent, useEffect, useState } from "react";
import ChatList from "./ChatList";
import ChatReceiver from "./ChatReceiver";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store/store";
import { addNotification, sendMessage } from "../store/slices/chatSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane } from "@fortawesome/free-regular-svg-icons";
import { getSocket } from "../components/SocketProvider";


export default function ChatBox() {
    const dispatch = useDispatch<AppDispatch>();
    const [message, setMessage] = useState("");
    const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
    const { currentContact } = useSelector((state: RootState) => state.chat);
    const { username } = useSelector((state: RootState) => state.user);
    const socket = getSocket()

    const handleSubmit = async (e: any) => {
        e.preventDefault(); 

        if (!message.trim()) {
            return; 
        }

        if (socket) {
            const messageData = await dispatch(sendMessage({ token, message, sender: username, recipient: currentContact }))
            if (messageData.meta.requestStatus === "fulfilled") {
                socket.emit(`${currentContact}`, messageData.payload)
            }
            setMessage("")
        }
    };


    useEffect(() => {
        if (socket) {
            socket.on(`${username}`, (message) => {
                if (message.recipientId === username) {
                    dispatch(addNotification({token, senderId: message.senderId, recipientId: message.recipientId}))
                }
            })
            return () => {
                socket.off(`${username}`);
            }
        }
    }, [socket])

    return (
        <div className="w-full lg:w-9/12 h-full flex flex-col">
            <ChatReceiver />
            <div className="bg-gray-800 border-l border-black h-full p-5 flex flex-col" style={{ height: "92%" }}>
                {currentContact != "Recipient" ? (
                    <>
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
                                    className="block w-full mr-2 text px-3 py-2 rounded-lg border border-gray-600 bg-gray-700 text-gray-100 shadow-md focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500 resize-none overflow-y-auto scrollbar-custom"
                                    placeholder="Write a message..."
                                    rows={1}
                                    style={{ minHeight: "40px", maxHeight: "100px" }} // Controls the maximum height
                                    onInput={(e: any) => {
                                        e.target.style.height = "auto"; // Reset the height
                                        e.target.style.height = `${e.target.scrollHeight}px`; // Set the new height based on content
                                    }}
                                    required
                                />
                                <button className="w-11 h-10 bg-amber-500 text-white rounded-lg flex items-center justify-center align-bottom hover:bg-amber-600 focus:outline-none focus:ring focus:ring-amber-300">
                                    <FontAwesomeIcon icon={faPaperPlane} className="fa-lg" />
                                </button>
                            </div>
                        </form>
                    </>
                ) : (
                    <div className="flex w-full h-full items-center justify-center">
                        <p className="text-xl text-white">Select a chat to start messaging</p>
                    </div>
                )}
            </div>
        </div>
    );


}
