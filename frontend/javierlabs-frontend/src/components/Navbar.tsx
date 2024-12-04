import React from 'react';
import '../styles/Navbar.css';
import Button from './Button.tsx';

const Navbar: React.FC = () => {
    return (
        <nav className="navbar">
            {/* Logo */}
            <div className="navbar-logo">.javierlabs</div>

            {/* Navigation Buttons*/}
            <div className="navbar-buttons">
                <Button
                    backgroundColor = "var(--gruvbox_fg0)"
                    textColor = "var(--gruvbox_gray2)"
                    text = "home"
                />

                <Button
                    backgroundColor = "var(--gruvbox_bg3)"
                    textColor = "var(--gruvbox_gray2)"
                    text = "about"
                />

                <Button
                    backgroundColor = "var(--gruvbox_bg1)"
                    textColor = "var(--gruvbox_gray2)"
                    text = "socials"
                />
            </div>
        </nav>
    );
};

export default Navbar;
