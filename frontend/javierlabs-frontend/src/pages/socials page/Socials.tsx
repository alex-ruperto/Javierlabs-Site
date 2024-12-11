import { ReactElement } from 'react';
import './Socials.css';
import { Navbar } from '../../components/navbar component/Navbar.tsx';
import github from '../../assets/Github.svg';
import linkedin from '../../assets/LinkedIn.svg';
import email from '../../assets/Email.svg';

export function Socials(): ReactElement {
    return (
        <div className="socials">
            <Navbar />
            <div className="socials-content-container">
                <div className="socials-image-group">
                    <img src={github} alt="GitHub"></img>
                    <img src={linkedin} alt="LinkedIn"></img>
                    <img src={email} alt="Email"></img>
                </div>
                <div className="socials-links">
                    <a href="https://github.com/alex-ruperto">https://github.com/alex-ruperto</a>
                    <a href="https://www.linkedin.com/in/alex-j-ruperto/">https://www.linkedin.com/in/alex-j-ruperto/</a>
                    <a href="alex.ruperto@javierlabs.com">alex.ruperto@javierlabs.com</a>
                </div>

            </div>
        </div>
    )
}