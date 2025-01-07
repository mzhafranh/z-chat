import { useDispatch } from "react-redux";
import { AppDispatch } from "../store/store";
import { setCurrentContact } from "../store/slices/chatSlice";
import { getSocket } from "../components/SocketProvider";
import { useEffect, useRef, useState } from "react";


interface ContactItemProps {
    id: string;
    username: string;
    currentContact: string | null;
    currentUser: string
}

const ContactItem: React.FC<ContactItemProps> = ({ id, username, currentContact, currentUser}) => {
    const dispatch = useDispatch<AppDispatch>();
    const socket = getSocket()
    const currentContactRef = useRef<string | null>(null);
    const [unreadCount, setUnreadCount] = useState<number>(0);

    // useEffect(() => {
    //     console.log("[ContactList]",currentContactRef.current, username, currentUser);
    // }, []);

    useEffect(() => {
        currentContactRef.current = currentContact;
    }, [currentContact]);

    useEffect(() => {
        socket.on(`${currentUser}`, (message) => {
            if (message.senderId === username && message.recipientId === currentUser && currentContactRef.current != username){
                console.log(`Contactlist received message ${currentUser}`)
                setUnreadCount((prevCount) => prevCount + 1);
            }
        })
        return () => {
            socket.off(`${username}`);
        };
    }, [socket])


    const handleChangeContact = () => {
        dispatch(setCurrentContact(username))
        setUnreadCount(0);
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
                        {unreadCount > 0 && <span className="ml-2 text-sm bg-amber-600 text-amber-200 rounded-full px-1">{unreadCount}</span>}
                        </button>
                )}
            </>
        )
    }
}
export default ContactItem;
