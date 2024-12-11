import { ReactElement } from 'react';
import { Navbar } from '../../components/navbar component/Navbar.tsx';
import github from '../../assets/Github.svg';
import linkedin from '../../assets/LinkedIn.svg';
import email from '../../assets/Email.svg';

export function Socials(): ReactElement {
    return (
        <div className="about">
            <Navbar />
            <div className="content">
                <h1>Socials Page</h1>
                <p>
                    Socials page
                </p>

                <img src={github} alt="GitHub"></img>
                <img src={linkedin} alt="LinkedIn"></img>
                <img src={email} alt="Email"></img>
            </div>
        </div>
    )
}