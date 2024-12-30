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
                    <button className="text-white text-md w-full text-left bg-blue-500 px-4 py-2">{username}</button>
                ) : (
                    <button className="text-gray-500 w-full text-md px-4 py-2 text-left hover:bg-blue-500 hover:text-white" onClick={handleChangeContact}>
                        {username}
                        {unreadCount > 0 && <span className="ml-2 text-sm text-red-500">({unreadCount})</span>}
                        </button>
                )}
            </>
        )
    }
}
export default ContactItem;
