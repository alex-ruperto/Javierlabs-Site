import { useState, useEffect, ReactElement } from 'react';
import './About.css';
import {Navbar} from '../../components/navbar component/Navbar.tsx';
import circle from "../../assets/Circle.svg"
import {Chatbox} from '../../components/chatbox component/Chatbox.tsx';

export function About(): ReactElement {
    // This tracks whether to show the typewriter effect
    const [showTypewriter, setShowTypewriter] = useState(false);

    useEffect(() => {
        const timeout = setTimeout(() => {
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
                {!showTypewriter ? (
                    <div className="circle">
                        <img src={circle} alt="Circle"></img>
                    </div>
                ) : (
                    <div className="typewriter-container">
                        <div className="typewriter">What can I help you with?</div>
                        <div className="cursor"></div>
                    </div>
                )}

                <Chatbox />
            </div>
        </div>
    );
}
