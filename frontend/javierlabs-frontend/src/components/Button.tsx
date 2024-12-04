import React, {ReactElement} from 'react';
import '../styles/Button.css'

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
const Button: React.FC<ButtonProps> = (props: ButtonProps): ReactElement => {
    const { backgroundColor, textColor, text } = props; // Destructured props

    return (
        <button
            className = "button"
            style = {{ backgroundColor, color: textColor }}
        >
            {text}
        </button>
    );
};

export default Button;