import { useDispatch, useSelector } from "react-redux";
import ChatItem from "./ChatItem";
import { AppDispatch, RootState } from "../store/store";
import { useEffect, useRef, useState } from "react";
import { fetchMessages, refreshMessages } from "../store/slices/chatSlice";

export default function ChatList() {
    const dispatch = useDispatch<AppDispatch>();
    const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
    const chatContainerRef = useRef<HTMLDivElement>(null);
    const [isFetching, setIsFetching] = useState(false);


    const { currentContact, messageList, page, totalPage } = useSelector((state: RootState) => state.chat);
    const { username } = useSelector((state: RootState) => state.user);

    useEffect(() => {
        dispatch(refreshMessages({ senderId: username, recipientId: currentContact, token, page: 1 }))
    }, [currentContact]);

    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [messageList]);

    const handleScroll = () => {
        if (chatContainerRef.current && !isFetching && page < totalPage) {
            const { scrollTop } = chatContainerRef.current;
            if (scrollTop < 50) {
                setIsFetching(true);
                dispatch(fetchMessages({ senderId: username, recipientId: currentContact, token, page: page + 1 }))
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