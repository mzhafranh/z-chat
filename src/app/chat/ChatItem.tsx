import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store/store";
import { deleteMessage } from "../store/slices/chatSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan } from "@fortawesome/free-solid-svg-icons";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { materialDark } from "react-syntax-highlighter/dist/esm/styles/prism";

interface ChatItemProps {
    id: string;
    content: string;
    senderId: string;
    recipientId: string;
}

const ChatItem: React.FC<ChatItemProps> = ({ id, content, senderId, recipientId }) => {
    const [isHovered, setIsHovered] = useState(false);
    const dispatch = useDispatch<AppDispatch>();
    const token = typeof window !== "undefined" ? localStorage.getItem("authToken") : null;

    const { username } = useSelector((state: RootState) => state.user);

    const onDelete = () => {
        dispatch(deleteMessage({ token, id }));
    };

    return (
        <div
            className={`flex items-start ${username === senderId ? "justify-end" : ""}`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className="relative flex items-center">
                {/* Delete Button */}
                {isHovered && username === senderId && (
                    <button
                        className="mr-1 px-1 py-1"
                        onClick={onDelete}
                    >
                        <FontAwesomeIcon icon={faTrashCan} className="fa-lg text-gray-600 hover:text-red-600" />
                    </button>
                )}
                {/* Message Content with Markdown and Syntax Highlighting */}
                <div
                    className={`${username === senderId ? "bg-blue-500 text-white" : "bg-white text-black border"
                        } font-sans px-4 py-2 rounded-2xl max-w-sm mb-2 break-words`}
                >
                    <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                            h1: ({ children }) => <h1 className="text-2xl font-bold mb-4">{children}</h1>,
                            h2: ({ children }) => <h2 className="text-xl font-semibold mb-3">{children}</h2>,
                            h3: ({ children }) => <h3 className="text-lg font-medium mb-2">{children}</h3>,
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
                                <a href={href!} className="text-blue-300 underline" target="_blank" rel="noopener noreferrer">
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
                </div>
            </div>
        </div>
    );
};

export default ChatItem;
