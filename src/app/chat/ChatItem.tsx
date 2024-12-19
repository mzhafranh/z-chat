interface ChatItemProps {
    id: string;
    content: string;
    senderId: string;
    recipientId: string;
    username: string;
}

const ChatItem: React.FC<ChatItemProps> = ({ id, content, senderId, recipientId, username }) => {
    return (
        <>
            {username === senderId ? (
                <div className="flex items-start justify-end">
                    <div className="bg-blue-500 font-sans text-white px-4 py-2 rounded-2xl max-w-sm mb-2 break-words">
                        {content}
                    </div>
                </div>
            ) : (
                <div className="flex items-start">
                <div className="bg-white font-sans text-black px-4 py-2 rounded-2xl max-w-sm border border-solid mb-2 break-words">
                    {content}
                </div>
            </div>
            )}
        </>
    )
}

export default ChatItem;