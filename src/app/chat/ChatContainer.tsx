import ChatBox from "./ChatBox";
import ContactBox from "./ContactBox";

export default function ChatContainer() {
    
    return (
        <div className="container w-full h-screen py-12 rounded-lg flex flex-row">
            <ContactBox />
            <ChatBox />
        </div>
    )
}