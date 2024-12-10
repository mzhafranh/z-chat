export default function ChatItem() {
    return (
        <>
            <div className="flex items-start">
                <div className="bg-white font-sans text-black px-4 py-2 rounded-2xl max-w-sm border border-solid mb-2 break-words">
                    Halo
                </div>
            </div>

            <div className="flex items-start">
                <div className="bg-white font-sans text-black px-4 py-2 rounded-2xl max-w-sm border border-solid mb-20 break-words">
                    Lagi dimana?
                </div>
            </div>

            <div className="flex items-start justify-end">
                <div className="bg-blue-500 font-sans text-white px-4 py-2 rounded-2xl max-w-sm mb-2 break-words">
                    Lagi di rumah bang
                </div>
            </div>
        </>
    )
}