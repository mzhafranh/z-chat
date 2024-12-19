import { useDispatch, useSelector } from "react-redux";
import ChatItem from "./ChatItem";
import { AppDispatch, RootState } from "../store/store";
import { useEffect } from "react";
import { refreshMessages } from "../store/slices/chatSlice";

export default function ChatList() {
    const dispatch = useDispatch<AppDispatch>();
    const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;

    const { currentContact, messageList } = useSelector((state: RootState) => state.chat);
    const { username } = useSelector((state: RootState) => state.user);
    
    useEffect(() => {
        dispatch(refreshMessages({senderId: username, recipientId: currentContact, token}))
    }, [currentContact]);

    const nodeList = messageList.map(
        (message, index) => <ChatItem
        key= {message.id}
        id = {message.id}
        content = {message.content}
        senderId = {message.senderId}
        recipientId = {message.recipientId}
        username = {username}
        />
    )

    return (
        <div className="h-full">
            {nodeList}
        </div>
    )
}