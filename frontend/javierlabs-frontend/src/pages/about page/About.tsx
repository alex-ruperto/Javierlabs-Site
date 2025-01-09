import { useState, useRef, useEffect, ReactElement } from 'react';
import './About.css';
import { Navbar } from '../../components/navbar component/Navbar.tsx';
import { Chatbox } from '../../components/chatbox component/Chatbox.tsx';
import { ChatThread, Message } from '../../components/chatthread component/ChatThread.tsx'
import circle from "../../assets/Circle.svg"


export function About(): ReactElement {
    // State that controls whether the request is still "loading"
    const [loading, setLoading] = useState(true);
    // Controls the visibility of the typewriter
    const [showTypewriter, setShowTypewriter] = useState(false);
    // Controls the visibility of the chat box
    const [showChatBox, setShowChatBox] = useState(false);
    // Controls the visibility of the chat thread
    const [showChatThread, setShowChatThread] = useState(false);
    // Conversation messages
    const [messages, setMessages] = useState<Message[]>([]);
    const threadContainerRef = useRef<HTMLDivElement>(null);
    // Replace with http://localhost:XXXX for local dev or import.meta.env.VITE_API_BASE_URL for prod
    const baseUrl = import.meta.env.VITE_API_BASE_URL;

    // Get or create the session ID
    function getOrCreateSessionId(): string {
        // Check if we already have a sessionId
        let sessionId = sessionStorage.getItem("sessionId");

        // If not, generate a fresh session Id
        if (!sessionId) {
            sessionId = crypto.randomUUID();
            sessionStorage.setItem("sessionId", sessionId);
        }
        return sessionId;
    }
    // Initialize assistant thread when the page loads
    async function initializeAssistantThread() {
        const sessionId = getOrCreateSessionId(); // Don't overwrite it if already exists.
        const requestUrl = `${baseUrl}/api/assistant/init?sessionId=${sessionId}`;
        try {
            const response = await fetch(requestUrl, { method: "POST" });
            console.log("Successfully retrieved assistant with Session ID: ", sessionId);
            if (!response.ok) {
                console.error("Failed to initialize assistant thread: ", response.statusText);
                addMessage({
                    text: `Error: Failed to initialize thread (${response.statusText})`,
                    sender: 'bot',
                });
            }
        } catch (error) {
            console.error("Error during thread initialization: ", error);
            addMessage({
                text: `Error: Failed to initialize thread (${error})`,
                sender: 'bot',
            });

        }
    }
    // Function to add a message with a unique ID
    function addMessage(message: Omit<Message, 'id'>): string {
        // Generate a unique ID for the message. This can be replaced by any UUID generator if needed.
        const id = crypto.randomUUID(); // Requires secure context (HTTPS) or a bundler polyfill for older browsers

        // Update the messages state with the new message
        setMessages((prevMessages) => [...prevMessages, { ...message, id }]);
        return id; // Return the ID of the newly added message
    }

    // Update a message by its unique ID
    function updateMessage(id: string, updatedMessage: Partial<Message>) {
        setMessages((prevMessages) =>
            prevMessages.map((msg) => {
                // If the message has the same ID, update it with new properties
                if (msg.id === id) {
                    return { ...msg, ...updatedMessage };
                }
                // Otherwise, return it as-is
                return msg;
            })
        );
    }


    useEffect(() => {
        const doAll = async () => {
            // Load Messages
            const savedMessages = sessionStorage.getItem("messages");
            if (savedMessages) {
                try {
                    const parsed = JSON.parse(savedMessages) as Message[];
                    if (parsed.length > 0) {
                        setMessages(parsed);
                        // Show the thread if there are messages
                        setShowChatThread(true);
                    }
                } catch (error) {
                    console.error("Failed to parse saved messages: ", error);
                }
            }

            // Initialize or retrieve the Assistant
            await initializeAssistantThread();

            setLoading(false);

            // If no messages so far, show the typewriter effect.
            setShowTypewriter(messages.length === 0);

            // Show chat input
            setShowChatBox(true);
        };

        doAll();
    }, []);

    // Set the session storage messages to the messages array.
    useEffect(() => {
        sessionStorage.setItem("messages", JSON.stringify(messages));
    }, [messages]);

    // Whenever messages change, OR the page finishes loading, OR the thread becomes visible scroll the .chat-thread-container
    useEffect(() => {
        if (!loading && showChatThread && threadContainerRef.current) {
            threadContainerRef.current.scrollTop = threadContainerRef.current.scrollHeight;
        }
    }, [loading, showChatThread, messages]);


    // While loading is true, ONLY show blinking circle (and the navbar if desired)
    if (loading) {
        return (
            <div className="about">
                <Navbar />
                <div className="about-content-container">
                    <div className="circle-container">
                        <img src={circle} alt="Circle" />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="about">
            <Navbar />

            <div className="about-content-container">
                {/* If we have zero messages, show the typewriter prompt */}
                {showTypewriter && messages.length === 0 && (
                    <div className="typewriter-container">
                        <div className="typewriter">What can I help you with?</div>
                        <div className="cursor"></div>
                    </div>
                )}

                {/* Chat Thread */}
                {showChatThread && (
                    <div className="chat-thread-container" ref={threadContainerRef}>
                        <ChatThread messages={messages} />
                    </div>
                )}

                {/* Chat Input Box */}
                {showChatBox && (
                    <div className="chatbox-container-wrapper">
                        <Chatbox
                            addMessage={addMessage}
                            updateMessage={updateMessage}
                            setShowChatThread={setShowChatThread} />
                    </div>
                )}
            </div>
        </div>
    );
}
