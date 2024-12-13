import './Navbar.css';
import menu from '../../assets/Menu.svg';
import {Button} from '../button component/Button.tsx';
import {ReactElement, useState} from "react";

export function Navbar(): ReactElement {
    const [isMenuOpen, setIsMenuOpen] = useState(false); // State tracking of the hamburger menu visibility

    function toggleMenu() {
        setIsMenuOpen(!isMenuOpen);
    }

    return (
        <nav className="navbar">
            {/* Centered Logo */}
            <div className="navbar-logo">.javierlabs</div>

            {/* Hamburger menu for mobile */}
            <div className="hamburger-menu" onClick={toggleMenu}>
                <img src={menu} alt="Menu"></img>
            </div>

            {/* Navigation Buttons*/}
            <div className={`navbar-buttons ${isMenuOpen ? 'open' : ''}`}>
                <Button
                    backgroundColor="var(--gruvbox-fg0)"
                    textColor="var(--gruvbox-gray2)"
                    text="home"
                    to="/"
                />

                <Button
                    backgroundColor="var(--gruvbox-bg3)"
                    textColor="var(--gruvbox-gray2)"
                    text="about"
                    to="/about"
                />

                <Button
                    backgroundColor="var(--gruvbox-bg1)"
                    textColor="var(--gruvbox-gray2)"
                    text="socials"
                    to="/socials"
                />
            </div>
        </nav>
    );
}
