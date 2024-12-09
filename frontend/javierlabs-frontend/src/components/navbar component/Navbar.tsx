import './Navbar.css';
import {Button} from '../button component/Button.tsx';

export function Navbar() {
    return (
        <nav className="navbar">
            {/* Logo */}
            <div className="navbar-logo">.javierlabs</div>

            {/* Navigation Buttons*/}
            <div className="navbar-buttons">
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
