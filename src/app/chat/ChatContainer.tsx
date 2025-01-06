import ChatBox from "./ChatBox";
import ContactBox from "./ContactBox";

export default function ChatContainer() {

    return (
        <div className="container w-full h-screen lg:py-12 flex flex-col lg:flex-row transition-all duration-300 ease-in-out">
            <ContactBox />
            <ChatBox />
        </div>
    )
}