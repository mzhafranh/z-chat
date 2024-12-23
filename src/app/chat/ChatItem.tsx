import React, { useState } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan } from "@fortawesome/free-regular-svg-icons";
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store/store';
import { deleteMessage } from '../store/slices/chatSlice';

interface ChatItemProps {
    id: string;
    content: string;
    senderId: string;
    recipientId: string;
}

const ChatItem: React.FC<ChatItemProps> = ({ id, content, senderId, recipientId }) => {
    const [isHovered, setIsHovered] = useState(false);
    const dispatch = useDispatch<AppDispatch>();
    const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;

    const { username } = useSelector((state: RootState) => state.user);

    const onDelete = () => {
        dispatch(deleteMessage({token, id}))
    }

    return (
        <div
            className={`flex items-start ${username === senderId ? 'justify-end' : ''}`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className="relative flex items-center">
                {isHovered && username === senderId && (
                    <button
                        className="mr-1 px-1 py-1"
                        onClick={onDelete}
                    >
                        <FontAwesomeIcon icon={faTrashCan} className="fa-lg text-gray-600 hover:text-red-600" />
                    </button>
                )}
                <div
                    className={`${
                        username === senderId ? 'bg-blue-500 text-white' : 'bg-white text-black border'
                    } font-sans px-4 py-2 rounded-2xl max-w-sm mb-2 break-words`}
                >
                    {content}
                </div>
            </div>
        </div>
    );    
};

export default ChatItem;
