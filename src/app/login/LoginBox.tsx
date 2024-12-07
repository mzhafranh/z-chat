export default function LoginBox() {
    return (
        <div className="container w-96 m-3 p-3 rounded-lg shadow-centered shadow-slate-500 flex flex-col">
            <div className="">
                <h1 className="text-emerald-500 font-bold text-center">LOGIN</h1>
            </div>
            <hr className="mt-2"/>
            <div className="">
                <form action="" className="w-full">
                    <input
                        type="text"
                        id="name"
                        name="name"
                        className="mt-4 block w-full p-2 rounded border border-solid border-gray-300 shadow-md"
                        placeholder="Username"
                        required
                    />
                    <button
                        type="submit"
                        className="w-1/2 mt-4 block mx-auto bg-sky-500 text-white text-sm py-2 px-4 rounded hover:bg-sky-600 focus:outline-none focus:ring focus:ring-sky-200 focus:ring-opacity-50">
                        LOG IN
                    </button>
                </form>
            </div>
        </div>
    )
}