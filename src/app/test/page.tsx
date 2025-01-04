'use client'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";

export default function Page() {
    return (
        <div className="flex justify-center h-screen items-center">
            <div className="container w-full h-screen py-12 rounded-lg flex flex-row">
                <div className="container w-2/12 rounded-lg shadow-centered shadow-slate-500 mr-5 flex flex-col">
                    <h1 className="font-bold text-gray-500 text-center text-2xl p-4">Contacts</h1>
                    <hr className="mb-4" />
                    <div className="h-full overflow-y-auto scrollbar-custom pr-1 mr-1">
                        <button className="text-white text-md w-full text-left bg-blue-500 px-4 py-2">Contact 1</button>
                        <button className="text-gray-500 w-full text-md px-4 py-2 text-left hover:bg-blue-500 hover:text-white">Contact 2</button>
                    </div>
                    <button className="text-red-500 border font-bold text-sm border-red-500 rounded-lg px-5 py-2 mx-12 my-4 hover:bg-red-600 hover:text-white focus:bg-red-800">LOG OUT</button>
                </div>
                <div className="container h-full w-10/12 flex flex-col">
                    <div className="rounded-lg shadow-centered shadow-slate-500"
                        style={{ height: "8%" }}>
                        <h1 className="font-bold text-gray-500 text-center text-2xl p-5">Recipient Name</h1>
                    </div>
                    <div
                        className="rounded-lg shadow-centered shadow-slate-500 mt-5 p-5 flex flex-col"
                        style={{ height: "90%" }}
                    >
                        <div className="overflow-y-auto h-full flex flex-col-reverse px-4 pb-4 scrollbar-custom">
                            <div className={`flex items-start justify-end`}>
                                <div className={"bg-blue-500 text-white font-sans px-4 py-2 rounded-2xl max-w-sm mb-2 break-words"}>
                                    <p>Chat 1</p>
                                </div>
                            </div>

                            <div className={`flex items-start`}>
                                <div className={"bg-white text-black border font-sans px-4 py-2 rounded-2xl max-w-sm mb-2 break-words"}>
                                    <p>Chat 2</p>
                                </div>
                            </div>
                        </div>
                        <form
                            className="mt-4"
                        >
                            <div className="flex flex-row">
                                <textarea
                                    id="message"
                                    name="message"
                                    className="block w-full mr-2 text-sm px-3 py-2 rounded-lg border border-solid border-gray-300 shadow-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 resize-none"
                                    placeholder="Write a message..."
                                    required
                                />
                                <button
                                    className="w-9 h-9 bg-blue-500 text-white rounded-full flex items-center justify-center align-bottom hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-200"
                                >
                                    <FontAwesomeIcon icon={faPaperPlane} className="fa-lg" />
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}