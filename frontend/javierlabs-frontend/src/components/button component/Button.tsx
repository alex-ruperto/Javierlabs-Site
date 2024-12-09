import './Button.css'
import {ReactElement} from "react";
import {Link} from "react-router-dom";

interface ButtonProps {
    backgroundColor: string; // Background color for the button
    textColor: string;  // Color of the text
    text: string; // Text inside the button
    to?: string; // Optional route path for navigation
}
/**
 * Button component
 * Reusable button with customizable background and text color.
 *
 * @param {ButtonProps} props - The properties for the button.
 * @returns {ReactElement} - The rendered Button component.
 */
export function Button({ backgroundColor, textColor, text, to}: ButtonProps): ReactElement {
    const buttonStyle = {
        backgroundColor,
        color: textColor
    };

    if (to) {
        return (
            <Link to={to} className="button" style={buttonStyle}>
                {text}
            </Link>
        )
    }

    return (
        <button className="button" style={buttonStyle}>
            {text}
        </button>
    );
};