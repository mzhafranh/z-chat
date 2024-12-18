interface ContactItemProps {
    id: string;
    username: string;
    currentContact: string | null;
}

const ContactItem: React.FC<ContactItemProps> = ({ id, username, currentContact }) => {
    return (
        <>
            {username === currentContact ? (
                <h1 className="text-white text-md bg-blue-500 px-4 py-2">{username}</h1>
            ) : (
                <h1 className="text-gray-500 text-md px-4 py-2">{username}</h1>
            )}
        </>
    )
}
export default ContactItem;
