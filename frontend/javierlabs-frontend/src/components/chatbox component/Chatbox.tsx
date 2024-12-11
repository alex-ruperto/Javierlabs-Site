import {useState, ReactElement} from 'react';
import "./Chatbox.css";
import React from "react";

type Message = {
    text: string;
    sender: 'user' | 'bot';
};

export function Chatbox(): ReactElement {
    /* messages is the state variable that stores the current list of chat messages
     setMessages is the function that updates the messages state.
     each message in the messages array is an object with the text and sender properties.
     */
    const [messages, setMessages] = useState<Message[]>([]);
    const handleInputChange= (e:React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value); // update the state with the input value
    }
    const [inputValue, setInputValue] = useState(''); // input field value

    const handleSubmit = () => {
        if (inputValue.trim() != '') {
            console.log('User Input: ', inputValue); // Handle user input

            // Add user's message to the chat
            const userMessage: Message = { text: inputValue, sender: 'user' };
            setMessages((prev) => [...prev, userMessage]);

            // Simulate a bot response
            const botMessage: Message = { text: `You said: ${inputValue}`, sender: 'bot'}
            setTimeout(() => {
                setMessages(prev => [...prev, botMessage]);
            }, 500);

            // Clear the text field
            setInputValue('');
        }
    }

    /**
     * Render the chat input UI
     * Includes an input field for the user to type and a button to submit the input.
     */

    return (
        <div className="chatbox-container">
            {/* Chat thread */}
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

            {/* Input field for user messages */}
            <div className="chatbox-input-container">

                <input
                    className="chatbox-input" // CSS class for styling the input field
                    type="text"
                    placeholder="Type your message..."
                    value={inputValue}
                    onChange={handleInputChange}
                />
                {/* Button submit the input */}
                <button
                    className="chatbox-submit-button"
                    onClick={handleSubmit}
                >
                    Send
                </button>
            </div>
        </div>

    );
}