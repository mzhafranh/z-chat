export default function ChatContainer() {
    return (
        <div className="container w-full h-screen py-12 rounded-lg flex flex-row">
            <div className="container h- w-2/12 rounded-lg shadow-centered shadow-slate-500 mr-5 flex flex-col">
                <h1 className="font-bold text-gray-500 text-center text-2xl p-4">Contacts</h1>
                <hr className="mb-4" />
                <div className="h-full">
                    <h1 className="text-white text-md bg-blue-500 px-4 py-2">John Smith</h1>
                    <h1 className="text-gray-500 text-md px-4 py-2">Cid Kagenou</h1>
                    <h1 className="text-gray-500 text-md px-4 py-2">Shadow</h1>
                    <h1 className="text-gray-500 text-md px-4 py-2">Mundane Mann</h1>
                    <h1 className="text-gray-500 text-md px-4 py-2">Jimina Senen</h1>
                </div>
                <button className="text-red-500 border font-bold text-sm border-red-500 rounded-lg px-5 py-2 mx-12 my-4">LOG OUT</button>
            </div>
            <div className="container w-10/12 flex flex-col">
                <div className="rounded-lg shadow-centered shadow-slate-500">
                    <h1 className="font-bold text-gray-500 text-center text-2xl p-5">John Smith</h1>
                </div>
                <div className="rounded-lg h-full shadow-centered shadow-slate-500 mt-5 p-5 flex flex-col">
                    <div className="h-full">
                        <div className="flex items-start">
                            <div className="bg-white font-sans text-black px-4 py-2 rounded-full max-w-xs border border-solid mb-2">
                                Halo
                            </div>
                        </div>

                        <div className="flex items-start">
                            <div className="bg-white font-sans text-black px-4 py-2 rounded-full max-w-xs border border-solid mb-20">
                                Lagi dimana?
                            </div>
                        </div>

                        <div className="flex items-start justify-end">
                            <div className="bg-blue-500 font-sans text-white px-4 py-2 rounded-full max-w-xs mb-2">
                                Lagi di rumah bang
                            </div>
                        </div>

                    </div>
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
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" className="w-6 h-6">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M5 12h14M12 5l7 7-7 7" />
                                </svg>
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}