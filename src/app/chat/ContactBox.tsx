import { useDispatch, useSelector } from "react-redux";
import ContactList from "./ContactList";
import { AppDispatch, RootState } from "../store/store";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { toggleContactListState } from "../store/slices/chatSlice";

export default function ContactBox() {
    const dispatch = useDispatch<AppDispatch>();
    const { isContactListOpen } = useSelector((state: RootState) => state.chat);
    const { username } = useSelector((state: RootState) => state.user);

    const toggleContactList = () => dispatch(toggleContactListState());

    const handleLogout = () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('zchatuser');
        window.location.href = "/login";
    };

    return (
        <div
            className={`bg-gray-800 h-full text-gray-100 flex flex-col transition-all duration-300 ease-in-out 
        ${isContactListOpen ? "translate-x-0 z-50" : "-translate-x-full lg:translate-x-0 z-0"} 
        fixed lg:static top-0 left-0 lg:z-auto w-full lg:w-3/12 h-full`}
        >
            {/* Mobile View */}
            <div
                className="lg:hidden border-b border-black flex items-center justify-between text-white py-5"
                style={{ height: "8%" }}
            >
                <h1 className="font-bold text-gray-300 text-2xl flex-grow flex items-center justify-center">
                    Contacts
                </h1>
                <button
                    onClick={toggleContactList}
                    className="text-gray-400 hover:text-gray-200 focus:outline-none pr-2"
                >
                    <FontAwesomeIcon icon={faXmark} className="fa-2xl" />
                </button>
            </div>

            {/* Desktop View */}
            <div
                className="hidden lg:flex items-center justify-center py-5"
                style={{ height: "8%" }}
            >
                <h1 className="font-bold text-gray-300 text-center text-2xl">
                    Contacts
                </h1>
            </div>

            <ContactList />
            <p className="text-amber-500 font-bold text-center my-2 text-lg">{username}</p>
            <button
                onClick={handleLogout}
                className="text-red-400 border font-bold text-sm border-red-500 rounded-lg px-5 py-2 mx-4 lg:mx-12 mb-4 hover:bg-red-500 hover:text-white focus:bg-red-600"
            >
                LOG OUT
            </button>
        </div>

    )
}

