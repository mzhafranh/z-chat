import { useDispatch } from "react-redux";
import { AppDispatch } from "../store/store";
import { readMessage, setCurrentContact } from "../store/slices/chatSlice";
import { getSocket } from "../components/SocketProvider";
import { useEffect, useRef, useState } from "react";


interface ContactItemProps {
    id: string;
    username: string;
    currentContact: string | null;
    currentUser: string;
    totalNotifications: number;
}

const ContactItem: React.FC<ContactItemProps> = ({ id, username, currentContact, currentUser, totalNotifications}) => {
    const dispatch = useDispatch<AppDispatch>();
    const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;

    // const socket = getSocket()
    // const currentContactRef = useRef<string | null>(null);
    // const [unreadCount, setUnreadCount] = useState<number>(0);

    // useEffect(() => {
    //     console.log("[ContactList]",username, totalNotifications);
    // }, []);

    // useEffect(() => {
    //     currentContactRef.current = currentContact;
    //     console.log("[Notification]",unreadCount)
    //     console.log(username, currentUser , currentContactRef.current)
    // }, [currentContact]);

    // useEffect(() => {
    //     socket.on(`${currentUser}`, (message) => {
    //         // console.log(message)
    //         // console.log(message.senderId, username, message.recipientId , currentUser , currentContactRef.current)
    //         if (message.senderId === username && message.recipientId === currentUser && currentContactRef.current != username){
    //             console.log(`Notification received on ${currentUser}`)
    //             setUnreadCount((prevCount) => prevCount + 1);
    //         }
    //     })
    //     return () => {
    //         socket.off(`${username}`);
    //     };
    // }, [socket])


    const handleChangeContact = () => {
        dispatch(setCurrentContact(username))
        dispatch(readMessage({token, senderId: username, recipientId: currentUser}))
        // setUnreadCount(0);
    }

    if (username === currentUser) {
        return
    }
    else {
        return (
            <>
                {username === currentContact ? (
                    <button className="text-gray-100 text-lg w-full text-left bg-amber-600 px-4 py-2 mb-1 rounded-md">{username}</button>
                ) : (
                    <button className="text-gray-400 w-full text-lg px-4 py-2 text-left hover:bg-amber-600 hover:text-white mb-1 rounded-md" onClick={handleChangeContact}>
                        {username}
                        {totalNotifications > 0 && <span className="ml-2 text-sm bg-red-500 text-white rounded-full px-1">{totalNotifications}</span>}
                        </button>
                )}
            </>
        )
    }
}
export default ContactItem;
