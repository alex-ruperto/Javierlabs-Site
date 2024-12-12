import { useState, useEffect, ReactElement } from 'react';
import './About.css';
import {Navbar} from '../../components/navbar component/Navbar.tsx';
import {Chatbox} from '../../components/chatbox component/Chatbox.tsx';
import {ChatThread, Message} from '../../components/chatthread component/ChatThread.tsx'
import circle from "../../assets/Circle.svg"


export function About(): ReactElement {
    // Controls the visibility of the blinking circle
    const [showCircle, setShowCircle] = useState(true);
    // Controls the visibility of the typewriter
    const [showTypewriter, setShowTypewriter] = useState(false);
    // Controls the visibility of the chat box
    const [showChatBox, setShowChatBox] = useState(false);
    // Controls the visibility of the chat thread
    const [showChatThread, setShowChatThread] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);

    const addMessage = (message: Message) => {
        setMessages((prevMessage) => [...prevMessage, message]);
        setShowTypewriter(false);
        setShowChatThread(true);
    };

    useEffect(() => {
        // Show typewriter effect after the circle has been displayed for three seconds.
        const timeout = setTimeout(() => {
            setShowChatBox(true);
            setShowCircle(false);
            setShowTypewriter(true);
        }, 3000); // wait 3 seconds before switching

        // Clean up timeout component on component unmount
        return () => clearTimeout(timeout);
        },
        []
    );



    return (
        <div className="about">
            <Navbar />

            <div className="about-content-container">
                {/* Show blinking circle first */}
                {showCircle && (
                    <div className="circle-container">
                        <img src={circle} alt="Circle"></img>
                    </div>
                )}

                { /* Show typewriter effect after the circle disappears */}
                {showTypewriter && messages.length === 0 && (
                    <div className="typewriter-container">
                        <div className="typewriter">What can I help you with?</div>
                        <div className="cursor"></div>
                    </div>
                )}

                {/* Chat Thread */}
                {showChatThread && (
                    <div className="chat-thread-container">
                        <ChatThread messages={messages} />
                    </div>
                )}

                {/* Chat Input Box */}
                {showChatBox && (
                    <div className="chatbox-container-wrapper">
                        <Chatbox addMessage={addMessage}/>
                    </div>
                )}



            </div>
        </div>
    );
}
