import ContactItem from "./ContactItem";
import { RootState } from "../store/store";
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch } from '../store/store';
import { useEffect } from "react";
import { getContacts } from "../store/slices/chatSlice";


export default function ContactList() {
    const dispatch = useDispatch<AppDispatch>();
    const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;

    const { contactList, currentContact } = useSelector((state: RootState) => state.chat);
    const { username } = useSelector((state: RootState) => state.user);
    
    useEffect(() => {
        dispatch(getContacts({token}))
    }, []);

    const nodeList = contactList.map(
        (contact, index) => <ContactItem
        key= {contact.id}
        id = {contact.id}
        username = {contact.username}
        currentContact = {currentContact}
        currentUser = {username}
        />
    )

    return (
        <div className="h-full">
            {nodeList}  
        </div>
    )
}