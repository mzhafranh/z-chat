import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store/store";

export default function ChatReceiver() {
    const dispatch = useDispatch<AppDispatch>();

    const { currentContact } = useSelector((state: RootState) => state.chat);

    return (
        <div className="rounded-lg shadow-centered shadow-slate-500"
        style={{height:"8%"}}>
                <h1 className="font-bold text-gray-500 text-center text-2xl p-5">{currentContact}</h1>
        </div>
    )
}