import ContactItem from "./ContactItem";
import { RootState } from "../store/store";
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch } from '../store/store';
import { useEffect } from "react";
import { getContacts, receiveContact } from "../store/slices/chatSlice";
import { getSocket } from "../components/SocketProvider";



export default function ContactList() {
    const dispatch = useDispatch<AppDispatch>();
    const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
    const socket = getSocket();

    const { contactList, currentContact } = useSelector((state: RootState) => state.chat);
    const { username } = useSelector((state: RootState) => state.user);

    useEffect(() => {
        dispatch(getContacts({ token }))
    }, []);

    useEffect(() => {
        socket.on(`contactList`, (contact) => {
            console.log(`Received New Contact ${contact.username}`)
            dispatch(receiveContact(contact))
        })
        return () => {
            socket.off(`contactList`);
        };
    }, [socket])

    const nodeList = contactList.map(
        (contact, index) => <ContactItem
            key={contact.id}
            id={contact.id}
            username={contact.username}
            currentContact={currentContact}
            currentUser={username}
        />
    )

    return (
        <div className="h-full overflow-y-auto scrollbar-custom pr-1 mr-1">
            {nodeList}
        </div>
    )
}