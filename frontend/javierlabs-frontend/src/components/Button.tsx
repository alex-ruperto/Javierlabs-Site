import '../styles/Button.css'
import {ReactElement} from "react";

interface ButtonProps {
    backgroundColor: string; // Background color for the button
    textColor: string;  // Color of the text
    text: string; // Text inside the button
}
/**
 * Button component
 * Reusable button with customizable background and text color.
 *
 * @param {ButtonProps} props - The properties for the button.
 * @returns {ReactElement} - The rendered Button component.
 */
export function Button({ backgroundColor, textColor, text }: ButtonProps): ReactElement {
    return (
        <button
            className = "button"
            style = {{
                backgroundColor,
                color: textColor
            }}
        >
            {text}
        </button>
    );
};