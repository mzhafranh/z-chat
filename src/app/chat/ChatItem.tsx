import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store/store";
import { deleteMessage, editMessage } from "../store/slices/chatSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan, faPenToSquare, faCheckCircle, faXmarkCircle } from "@fortawesome/free-solid-svg-icons";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { materialDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { getSocket } from "../components/SocketProvider";

interface ChatItemProps {
    id: string;
    content: string;
    senderId: string;
    recipientId: string;
    updatedAt: string | null;
}

const ChatItem: React.FC<ChatItemProps> = ({ id, content, senderId, recipientId, updatedAt }) => {
    const [isHovered, setIsHovered] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editedContent, setEditedContent] = useState(content);
    const dispatch = useDispatch<AppDispatch>();
    const token = typeof window !== "undefined" ? localStorage.getItem("authToken") : null;
    const socket = getSocket()


    const { username } = useSelector((state: RootState) => state.user);

    // useEffect(() => {
    //     console.log("[MesssageList]",content, updatedAt);
    // }, []);

    const onDelete = () => {
        dispatch(deleteMessage({ token, id }));
    };

    const onSaveEdit = async () => {
        if (socket){
            const editedMessage = await dispatch(editMessage({ token, id, newContent: editedContent }));
            if (editedMessage.meta.requestStatus === "fulfilled") {
                socket.emit(`${recipientId}-edit`, editedMessage.payload)
                console.log(`socket emit on ${recipientId}-edit`)
            }
        }
        setIsEditing(false);
    };

    const onCancelEdit = () => {
        setEditedContent(content);
        setIsEditing(false);
    };

    return (
        <div
            className={`flex items-start ${username === senderId ? "justify-end" : ""}`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className="relative flex items-center">
                {/* Action Buttons */}

                <div className="mr-2 flex space-x-1">
                    {updatedAt && username === senderId && (
                        <p className="text-sm text-gray-500">(edited)</p>
                    )}
                    {isHovered && username === senderId && !isEditing && (
                        <>
                            <button className="px-1 py-1" onClick={() => setIsEditing(true)}>
                                <FontAwesomeIcon icon={faPenToSquare} className="fa-lg text-gray-600 hover:text-yellow-600" />
                            </button>
                            <button className="px-1 py-1" onClick={onDelete}>
                                <FontAwesomeIcon icon={faTrashCan} className="fa-lg text-gray-600 hover:text-red-600" />
                            </button>
                        </>
                    )}
                </div>
                <div
                    className={`${username === senderId ? "bg-amber-500 text-white" : "bg-gray-700 text-gray-100 border border-gray-600"
                        } font-sans px-4 py-2 rounded-2xl max-w-sm mb-2 break-words`}
                >
                    {isEditing ? (
                        <div>
                            <textarea
                                value={editedContent}
                                onChange={(e) => setEditedContent(e.target.value)}
                                className="w-full bg-gray-700 px-2 py-8 border rounded text-white scrollbar-custom"
                            />
                            <div className="flex justify-end space-x-2 mt-2">
                                <button className="px-1" onClick={onSaveEdit}>
                                    <FontAwesomeIcon icon={faCheckCircle} className="fa-lg text-white" />
                                </button>
                                <button className="px-1" onClick={onCancelEdit}>
                                    <FontAwesomeIcon icon={faXmarkCircle} className="fa-lg text-white" />
                                </button>
                            </div>
                        </div>
                    ) : (
                        <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                            components={{
                                h1: ({ children }) => <h1 className="text-2xl font-bold mb-4">{children}</h1>,
                                h2: ({ children }) => <h2 className="text-xl font-semibold mb-3">{children}</h2>,
                                h3: ({ children }) => <h3 className="text-lg font-mediummb-2">{children}</h3>,
                                p: ({ children }) => <p className="">{children}</p>,
                                pre: ({ children }) => <pre className="bg-gray-900 text-white p-4 rounded">{children}</pre>,
                                ul: ({ children }) => <ul className="list-disc pl-6">{children}</ul>,
                                ol: ({ children }) => <ol className="list-decimal pl-6">{children}</ol>,
                                li: ({ children }) => <li className="mb-1">{children}</li>,
                                hr: () => <hr className="my-6 border-gray-300" />,
                                table: ({ children }) => <table className="table-auto border-collapse w-full">{children}</table>,
                                th: ({ children }) => <th className="border px-4 py-2 bg-gray-100">{children}</th>,
                                td: ({ children }) => <td className="border px-4 py-2">{children}</td>,
                                img: ({ src, alt }) => <img src={src} alt={alt} className="max-w-full h-auto my-2" />,
                                a: ({ href, children }) => (
                                    <a href={href!} className="text-violet-500 underline" target="_blank" rel="noopener noreferrer">
                                        {children}
                                    </a>
                                ),
                                blockquote: ({ children }) => (
                                    <blockquote className="border-l-4 border-gray-300 pl-4 italic text-gray-600">
                                        {children}
                                    </blockquote>
                                ),
                                code: ({ inline, className, children, ...props }: any) => {
                                    const match = /language-(\w+)/.exec(className || "");
                                    const codeString = Array.isArray(children) ? children.join("") : String(children);
                                    return !inline && match ? (
                                        <SyntaxHighlighter
                                            style={materialDark}
                                            language={match[1]}
                                            PreTag="div"
                                            {...props}
                                        >
                                            {codeString.trim()}
                                        </SyntaxHighlighter>
                                    ) : (
                                        <code className={`${className} p-1 rounded`} {...props}>
                                            {codeString}
                                        </code>
                                    );
                                },
                            }}
                        >
                            {content}
                        </ReactMarkdown>
                    )}
                </div>
                    {updatedAt && username != senderId && (
                            <p className="text-sm text-gray-500 pl-2">(edited)</p>
                    )}
            </div>
        </div>
    );
};

export default ChatItem;
