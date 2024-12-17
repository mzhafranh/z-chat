import ChatList from "./ChatList";
import ChatReceiver from "./ChatReceiver";

export default function ChatBox() {
    return (
        <div className="container w-10/12 flex flex-col">
            <ChatReceiver/>
            <div className="rounded-lg h-full shadow-centered shadow-slate-500 mt-5 p-5 flex flex-col">
                <ChatList/>
                <form>
                    <div className="flex flex-row">
                        <input
                            type="text"
                            id="message"
                            name="message"
                            className="block w-full mr-2 text-sm px-3 py-2 rounded-full border border-solid border-gray-300 shadow-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Write a message..."
                            required
                        />
                        <button className="w-9 h-9 bg-blue-500 text-white rounded-full flex items-center justify-center hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-200">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M12 5l7 7-7 7" />
                            </svg>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
