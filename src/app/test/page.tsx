'use client'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAddressBook, faPaperPlane, faXmark } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";

export default function Page() {
    const [isContactListOpen, setContactListOpen] = useState(false);

    const toggleContactList = () => setContactListOpen(!isContactListOpen);
    return (
        <div className="flex justify-center h-screen items-center bg-gray-900 text-gray-100">
            <div className="container w-full h-screen lg:py-12 flex flex-col lg:flex-row transition-all duration-300 ease-in-out">
                {/* ContactBox */}
                <div className={`bg-gray-800  text-gray-100 flex flex-col transition-all duration-300 ease-in-out 
                                ${isContactListOpen ? "translate-x-0 z-50" : "-translate-x-full lg:translate-x-0 z-0"} 
                                fixed lg:static top-0 left-0 lg:z-auto w-full lg:w-3/12 h-full`}>
                    <div className="flex items-center justify-between p-4 text-white lg:hidden border border-l-0 border-t-0 border-r-0 border-b-black mb-2">
                        <h1 className="font-bold text-gray-300 text-2xl">Contacts</h1>
                        <button
                            onClick={toggleContactList}
                            className="text-gray-400 hover:text-gray-200 focus:outline-none"
                        >
                            <FontAwesomeIcon icon={faXmark} className="fa-2xl" />
                        </button>
                    </div>
                    <h1 className="hidden lg:block font-bold text-gray-300 text-center text-2xl p-4 border border-r-0 border-l-0 border-t-0 border-b-black mb-2" style={{height:"8%"}}>
                        Contacts
                    </h1>
                    <div className="h-full overflow-y-auto scrollbar-custom px-1 mr-1" style={{height:"92%"}}>
                        <button className="text-gray-100 text-lg w-full text-left bg-amber-600 px-4 py-2 mb-1 rounded-md">
                            Contact 1
                        </button>
                        <button className="text-gray-400 w-full text-lg px-4 py-2 text-left hover:bg-amber-600 hover:text-white mb-1 rounded-md">
                            Contact 2
                        </button>
                    </div>
                    <button className="text-red-400 border font-bold text-sm border-red-500 rounded-lg px-5 py-2 mx-4 lg:mx-12 my-4 hover:bg-red-500 hover:text-white focus:bg-red-600">
                        LOG OUT
                    </button>
                </div>

                {/* ChatBox */}
                <div className="w-full lg:w-9/12 h-full flex flex-col">
                    {/* Recipient name with icon button */}
                    <div className="flex-none h-1/12 bg-gray-800 border-b border-l border-black relative">
                        {/* Icon Button */}
                        <button
                            onClick={toggleContactList}
                            className="absolute top-1/2 left-4 transform -translate-y-1/2 lg:hidden text-gray-400 p-2 focus:outline-none hover:text-gray-300"
                        >
                            <FontAwesomeIcon icon={faAddressBook} className="fa-2xl" />
                        </button>

                        {/* Recipient Name */}
                        <h1 className="font-bold text-gray-300 text-center text-2xl p-4">
                            Recipient Name
                        </h1>
                    </div>

                    {/*Chat List */}
                    <div className="bg-gray-800 border-l border-black border-t-0 border-r-0 border-b-0 h-full p-5 flex flex-grow flex-col">
                        <div className="overflow-y-auto px-4 scrollbar-custom flex-grow">
                            <div className="flex items-start justify-end">
                                <div className="bg-amber-500 text-white font-sans px-4 py-2 rounded-2xl max-w-sm mb-2 break-words">
                                    <p>Chat 1</p>
                                </div>
                            </div>
                            <div className="flex items-start">
                                <div className="bg-gray-700 text-gray-100 border border-gray-600 font-sans px-4 py-2 rounded-2xl max-w-sm mb-2 break-words">
                                    <p>Chat 2</p>
                                </div>
                            </div>
                        </div>
                        <form className="mt-4">
                            <div className="flex flex-row">
                                <textarea
                                    id="message"
                                    name="message"
                                    className="block w-full mr-2 text px-3 py-2 rounded-lg border border-gray-600 bg-gray-700 text-gray-100 shadow-md focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500 resize-none overflow-y-auto scrollbar-custom"
                                    placeholder="Write a message..."
                                    rows={1}
                                    style={{ minHeight: "40px", maxHeight: "100px" }}
                                    onInput={(e) => {
                                        e.target.style.height = "auto"; // Reset the height
                                        e.target.style.height = `${e.target.scrollHeight}px`; // Set the new height based on content
                                    }}
                                    required
                                />
                                <button className="w-9 h-9 bg-amber-500 text-white rounded-lg flex items-center justify-center align-bottom hover:bg-amber-600 focus:outline-none focus:ring focus:ring-amber-300">
                                    <FontAwesomeIcon icon={faPaperPlane} className="fa-lg" />
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>

    );
}