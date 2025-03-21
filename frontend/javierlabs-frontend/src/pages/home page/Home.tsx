﻿import { ReactElement } from 'react';
import { Navbar } from '../../components/navbar component/Navbar.tsx';
import './Home.css';

/**
 * Home page
 * Displays the site logo/description and the text editor section.
 *
 * @returns {ReactElement}
 */

export function Home(): ReactElement {
    return (
        <div className="home">

            {/* Render the Navbar */}
            <Navbar />

            {/* Main content container */}
            <div className="home-content-container">
                {/* Site Logo/DescriptionFrame */}
                <div className="logo-frame">
                    <div className="ascii-art">
                        <pre>
                            {`
   _             _           _       _
  (_) __ ___   _(_) ___ _ __| | __ _| |__  ___
  | |/ _\` \\ \\ / / |/ _ \\ '__| |/ _\` | '_ \\/ __|
  | | (_| |\\ V /| |  __/ |  | | (_| | |_) \\__ \\
 _/ |\\__,_| \\_/ |_|\\___|_|  |_|\\__,_|_.__/|___/
|__/
                            `}
                        </pre>

                    </div>
                    <ul>
                        <li>

                            <span className="key">Name: </span>
                            <span className="value">Alex Ruperto</span>
                        </li>
                        <li>
                            <span className="key">Company: </span>
                            <span className="value">Vanderlande</span>
                        </li>
                        <li>
                            <span className="key">Current Occupation: </span>
                            <span className="value">Software Engineer</span>

                        </li>
                        <li>
                            <span className="key">Degree: </span>
                            <span className="value">BS Computer Science</span>
                        </li>
                        <li>
                            <span className="key">College: </span>
                            <span className="value">Colorado State University Global</span>
                        </li>
                        <li>
                            <span className="key">Programming Languages: </span>
                            <span className="value">Python, Java, C#, Kotlin, JS/TS</span>

                        </li>
                        <li>
                            <span className="key">Open to Work? (Y/N): </span>
                            <span className="value">Y</span>
                        </li>
                        <li>
                            <span className="key">Location: </span>
                            <span className="value">Orlando, FL</span>
                        </li>
                    </ul>
                </div>

                {/* Text Editor Frame Frame */}
                <div className="editor-frame">
                    <div className="editor-text">
                        <p>
                            Hi, thank you for visiting my portfolio! Feel free to check out the
                            about page to have a chat with my personal assistant. The bot is
                            powered by the OpenAI Assistants API.
                            <br /><br />
                            If you're curious about this site's design, it is inspired by the
                            gruvbox theme for the Neovim text editor.
                        </p>

                    </div>
                </div>
            </div>
        </div>
    );
}
