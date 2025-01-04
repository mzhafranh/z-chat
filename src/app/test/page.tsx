'use client'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAddressBook, faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";

export default function Page() {
    const [isContactListOpen, setContactListOpen] = useState(false);

    const toggleContactList = () => setContactListOpen(!isContactListOpen);
    return (
        <div className="flex justify-center h-screen items-center">
            <div className="container w-full h-screen lg:py-12 flex flex-col lg:flex-row transition-all duration-300 ease-in-out">
                {/* ContactBox */}
                <div
                    className={`bg-white border flex flex-col transition-all duration-300 ease-in-out 
          ${isContactListOpen ? "translate-x-0 z-50" : "-translate-x-full lg:translate-x-0 z-0"} 
          fixed lg:static top-0 left-0 lg:z-auto w-full lg:w-2/12 h-full`}
                >

                    <div className="flex items-center justify-between p-4 bg-blue-500 text-white lg:hidden">
                        <h1 className="font-bold">Contacts</h1>
                        <button
                            onClick={toggleContactList}
                            className="text-white hover:text-gray-200 focus:outline-none"
                        >
                            &times;
                        </button>
                    </div>
                    <h1 className="hidden lg:block font-bold text-gray-500 text-center text-2xl p-4">
                        Contacts
                    </h1>
                    <hr className="mb-4" />
                    <div className="h-full overflow-y-auto scrollbar-custom pr-1 mr-1">
                        <button className="text-white text-md w-full text-left bg-blue-500 px-4 py-2">Contact 1</button>
                        <button className="text-gray-500 w-full text-md px-4 py-2 text-left hover:bg-blue-500 hover:text-white">Contact 2</button>
                    </div>
                    <button className="text-red-500 border font-bold text-sm border-red-500 rounded-lg px-5 py-2 mx-4 lg:mx-12 my-4 hover:bg-red-600 hover:text-white focus:bg-red-800">
                        LOG OUT
                    </button>
                </div>


                {/* ChatBox */}
                <div className="w-full lg:w-10/12 h-full flex flex-col">
                    {/* Recipient name with icon button */}
                    <div className="bg-white border shadow-slate-500 relative">
                        {/* Icon Button */}
                        <button
                            onClick={toggleContactList}
                            className="absolute top-1/2 left-4 transform -translate-y-1/2 lg:hidden text-gray-500 p-2 focus:outline-none hover:text-gray-600"
                        >
                            <FontAwesomeIcon icon={faAddressBook} className="fa-2xl" />
                        </button>

                        {/* Recipient Name */}
                        <h1 className="font-bold text-gray-500 text-center text-2xl p-4">Recipient Name</h1>
                    </div>

                    <div className="bg-white border h-full p-5 flex flex-col">
                        <div className="overflow-y-auto h-full flex flex-col-reverse px-4 pb-4 scrollbar-custom">
                            <div className="flex items-start justify-end">
                                <div className="bg-blue-500 text-white font-sans px-4 py-2 rounded-2xl max-w-sm mb-2 break-words">
                                    <p>Chat 1</p>
                                </div>
                            </div>
                            <div className="flex items-start">
                                <div className="bg-white text-black border font-sans px-4 py-2 rounded-2xl max-w-sm mb-2 break-words">
                                    <p>Chat 2</p>
                                </div>
                            </div>
                        </div>
                        <form className="mt-4">
                            <div className="flex flex-row">
                                <textarea
                                    id="message"
                                    name="message"
                                    className="block w-full mr-2 text-sm px-3 rounded-lg border border-solid border-gray-300 shadow-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 resize-none"
                                    placeholder="Write a message..."
                                    required
                                />
                                <button className="w-9 h-9 bg-blue-500 text-white rounded-full flex items-center justify-center align-bottom hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-200">
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