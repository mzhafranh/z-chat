import { useDispatch, useSelector } from "react-redux";
import ChatItem from "./ChatItem";
import { AppDispatch, RootState } from "../store/store";
import { useEffect, useRef, useState } from "react";
import { clearChat, fetchMessages, receiveMessage, refreshMessages, setChatAccessTime } from "../store/slices/chatSlice";
import { getSocket } from "../components/SocketProvider";

export default function ChatList() {
    const dispatch = useDispatch<AppDispatch>();
    const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
    const chatContainerRef = useRef<HTMLDivElement>(null);
    const currentContactRef = useRef<string | null>(null);
    const [isFetching, setIsFetching] = useState(false);
    const socket = getSocket();


    const { currentContact, messageList, page, totalPage, chatAccessTime } = useSelector((state: RootState) => state.chat);
    const { username } = useSelector((state: RootState) => state.user);

    useEffect(() => {
        currentContactRef.current = currentContact;
        dispatch(setChatAccessTime());
        dispatch(refreshMessages({ senderId: username, recipientId: currentContact, token }));
    }, [currentContact]);

    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [messageList]);

    useEffect(() => {
        socket.on("message", (message) => {
            if (message.senderId === currentContactRef.current && message.recipientId === username){
                console.log("ReceiveMessage executed")
                dispatch(receiveMessage(message))
            }
        })
        return () => {
            socket.off("message");
        };
    }, [socket])

    const handleScroll = () => {
        if (chatContainerRef.current && !isFetching && page < totalPage) {
            const { scrollTop } = chatContainerRef.current;
            if (scrollTop < 50) {
                setIsFetching(true);
                dispatch(fetchMessages({ senderId: username, recipientId: currentContact, token, page: page + 1, chatAccessTime}))
                    .finally(() => setIsFetching(false));
            }
        }
    };

    useEffect(() => {
        const chatContainer = chatContainerRef.current;

        if (chatContainer) {
            chatContainer.addEventListener("scroll", handleScroll);
        }

        return () => {
            if (chatContainer) {
                chatContainer.removeEventListener("scroll", handleScroll);
            }
        };
    }, [isFetching, page, totalPage, chatContainerRef]);

    const nodeList = messageList.map(
        (message, index) => <ChatItem
            key={message.id}
            id={message.id}
            content={message.content}
            senderId={message.senderId}
            recipientId={message.recipientId}
        />
    )

    return (
        <div
            ref={chatContainerRef}
            className="overflow-y-auto h-full flex flex-col-reverse px-4 pb-4">
            {nodeList}
        </div>
    )
}