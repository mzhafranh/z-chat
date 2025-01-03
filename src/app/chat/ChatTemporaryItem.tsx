import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store/store";
import {  resendMessage } from "../store/slices/chatSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRotateRight } from "@fortawesome/free-solid-svg-icons";
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
}

const ChatTemporaryItem: React.FC<ChatItemProps> = ({ id, content, senderId, recipientId }) => {
    const dispatch = useDispatch<AppDispatch>();
    const token = typeof window !== "undefined" ? localStorage.getItem("authToken") : null;
    const socket = getSocket();

    const { username } = useSelector((state: RootState) => state.user);

    const onResend = async () => {
        const messageData = await dispatch(resendMessage({ token, tempMessageId: id, message: content, sender: username, recipient: recipientId }))
        if (messageData.meta.requestStatus === "fulfilled") {
            socket.emit(`${recipientId}`, messageData.payload)
            console.log("socket emit from resend on",recipientId)
        }
    };

    return (
        <div
            className={`flex items-start ${username === senderId ? "justify-end" : ""}`}
        >
            <div className="relative flex items-center">
                {/* Delete Button */}
                { username === senderId && (
                    <button
                        className="mr-1 px-1 py-1"
                        onClick={onResend}
                    >
                        <FontAwesomeIcon icon={faRotateRight} className="fa-lg text-gray-600 hover:text-blue-600" />
                    </button>
                )}
                {/* Message Content with Markdown and Syntax Highlighting */}
                <div
                    className={`${
                        username === senderId ? "bg-green-500 text-white" : "bg-white text-black border"
                    } font-sans px-4 py-2 rounded-2xl max-w-sm mb-2 break-words`}
                >
                    <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                            a: ({ href, children }) => (
                                <a href={href!} className="text-blue-300 underline" target="_blank" rel="noopener noreferrer">
                                    {children}
                                </a>
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

export default ChatTemporaryItem;
