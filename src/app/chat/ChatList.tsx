import { useDispatch, useSelector } from "react-redux";
import ChatItem from "./ChatItem";
import { AppDispatch, RootState } from "../store/store";
import { useEffect, useRef, useState } from "react";
import { addNotification, fetchMessages, receiveMessage, refreshMessages, setChatAccessTime, updateEditedMessage } from "../store/slices/chatSlice";
import { getSocket } from "../components/SocketProvider";
import ChatTemporaryItem from "./ChatTemporaryItem";

export default function ChatList() {
    const dispatch = useDispatch<AppDispatch>();
    const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
    const chatContainerRef = useRef<HTMLDivElement>(null);
    const currentContactRef = useRef<string | null>(null);
    const [isFetching, setIsFetching] = useState(false);
    const socket = getSocket();

    const { currentContact, messageList, page, totalPage, chatAccessTime, tempMessageList, loading } = useSelector((state: RootState) => state.chat);
    const { username } = useSelector((state: RootState) => state.user);

    useEffect(() => {
        currentContactRef.current = currentContact;
        dispatch(setChatAccessTime());
        dispatch(refreshMessages({ senderId: username, recipientId: currentContact, token }));
    }, [currentContact]);

    useEffect(() => {
        socket.on(`${username}`, (message) => {
            console.log(`Received Message on ${username}`)
            if (message.senderId === currentContactRef.current && message.recipientId === username) {
                dispatch(receiveMessage(message))
                console.log("ReceiveMessage executed")
            } else {
                dispatch(addNotification(message.senderId))
                console.log("addNotification executed")
            }
        })
        return () => {
            socket.off(`${username}`);
        };
    }, [socket])

    useEffect(() => {
        socket.on(`${username}-edit`, (message) => {
            console.log(`Received Edit Message on ${username}`)
            console.log(message)
            if (message.data.senderId === currentContactRef.current && message.data.recipientId === username) {
                console.log("Receive Edit Message executed")
                dispatch(updateEditedMessage(message))
            }
        })
        return () => {
            socket.off(`${username}`);
        };
    }, [socket])

    const handleScroll = () => {
        if (chatContainerRef.current && !isFetching && page < totalPage) {
            const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;
            const isNearTop = ((-1) * scrollTop) + clientHeight > scrollHeight - 100;
            // console.log((((-1) * scrollTop) + clientHeight), (scrollHeight - 100))

            if (isNearTop) {
                setIsFetching(true);
                dispatch(fetchMessages({
                    senderId: username,
                    recipientId: currentContact,
                    token,
                    page: page + 1,
                    chatAccessTime
                }))
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


    const nodeListTemp = tempMessageList.map(
        (message, index) => <ChatTemporaryItem
            key={message.id}
            id={message.id}
            content={message.content}
            senderId={message.senderId}
            recipientId={message.recipientId}
        />
    )

    const nodeList = messageList.map(
        (message, index) => <ChatItem
            key={message.id}
            id={message.id}
            content={message.content}
            senderId={message.senderId}
            recipientId={message.recipientId}
            updatedAt={message.updatedAt}
        />
    )

    return (
        <div
            ref={chatContainerRef}
            className="overflow-y-auto h-full flex flex-col-reverse px-4 pb-4 scrollbar-custom">
            {nodeListTemp}
            {nodeList}
        </div>
    )
}