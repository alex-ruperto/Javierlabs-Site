import {ReactElement} from 'react';
import "./ChatThread.css";

export interface Message {
    id: string; // Unique identifier for each message
    text: string; // Message text context
    sender: 'user' | 'bot'; // Sender is either a user or a bot.
}

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