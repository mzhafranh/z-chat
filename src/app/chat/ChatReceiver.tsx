import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store/store";
import { faAddressBook } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { toggleContactListState } from "../store/slices/chatSlice";

export default function ChatReceiver() {
    const dispatch = useDispatch<AppDispatch>();

    const { currentContact } = useSelector((state: RootState) => state.chat);
    const toggleContactList = () => dispatch(toggleContactListState());


    return (
        <div className="bg-gray-800 border-l border-b border-black relative py-5" style={{height:"8%"}}>
            <button
                onClick={toggleContactList}
                className="absolute top-1/2 left-4 transform -translate-y-1/2 lg:hidden text-gray-400 p-2 focus:outline-none hover:text-gray-300"
            >
                <FontAwesomeIcon icon={faAddressBook} className="fa-2xl" />
            </button>

            <h1 className="font-bold text-gray-300 text-center text-2xl">
                {currentContact}
            </h1>
        </div>
    )
}