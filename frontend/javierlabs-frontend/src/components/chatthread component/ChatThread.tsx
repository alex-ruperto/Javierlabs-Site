import {ReactElement} from 'react';
import "./ChatThread.css";

export type Message = {
    text: string;
    sender: 'user' | 'bot';
};

type ChatThreadProps = {
    messages: Message[];
};

export function ChatThread({messages}: ChatThreadProps): ReactElement {
    return (
        <div className="chatbox-thread">
            {messages.map((message, index) => (
                <div
                    key={index}
                    className={`chat-message ${message.sender === 'user' ? 'user-message' : 'bot-message'}`}
                >
                    {message.text}
                </div>
            ))}
        </div>
    )
}