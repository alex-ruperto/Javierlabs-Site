import { ReactElement } from 'react';
import { Navbar } from '../components/Navbar';

export function Socials(): ReactElement {
    return (
        <div className="about">
            <Navbar />
            <div className="content">
                <h1>Socials Page</h1>
                <p>
                    Socials PAge
                </p>
            </div>
        </div>
    );
}