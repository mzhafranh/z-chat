import ContactList from "./ContactList";

export default function ContactBox() {
    return (
        <div className="container h- w-2/12 rounded-lg shadow-centered shadow-slate-500 mr-5 flex flex-col">
            <h1 className="font-bold text-gray-500 text-center text-2xl p-4">Contacts</h1>
            <hr className="mb-4" />
            <ContactList/>
            <button className="text-red-500 border font-bold text-sm border-red-500 rounded-lg px-5 py-2 mx-12 my-4">LOG OUT</button>
        </div>
    )
}

