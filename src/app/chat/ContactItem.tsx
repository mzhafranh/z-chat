import { useDispatch } from "react-redux";
import { AppDispatch } from "../store/store";
import { setCurrentContact } from "../store/slices/chatSlice";

interface ContactItemProps {
    id: string;
    username: string;
    currentContact: string | null;
    currentUser: string
}

const ContactItem: React.FC<ContactItemProps> = ({ id, username, currentContact, currentUser}) => {
    const dispatch = useDispatch<AppDispatch>();

    const handleChangeContact = () => {
        dispatch(setCurrentContact(username))
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
                    <button className="text-gray-500 w-full text-md px-4 py-2 text-left hover:bg-blue-500 hover:text-white" onClick={handleChangeContact}>{username}</button>
                )}
            </>
        )
    }
}
export default ContactItem;
