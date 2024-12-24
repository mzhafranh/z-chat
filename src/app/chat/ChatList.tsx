import { useDispatch, useSelector } from "react-redux";
import ChatItem from "./ChatItem";
import { AppDispatch, RootState } from "../store/store";
import { useEffect, useRef } from "react";
import { refreshMessages } from "../store/slices/chatSlice";

export default function ChatList() {
    const dispatch = useDispatch<AppDispatch>();
    const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
    const chatContainerRef = useRef<HTMLDivElement>(null);


    const { currentContact, messageList } = useSelector((state: RootState) => state.chat);
    const { username } = useSelector((state: RootState) => state.user);

    useEffect(() => {
        dispatch(refreshMessages({ senderId: username, recipientId: currentContact, token }))
    }, [currentContact]);

    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [messageList]);

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