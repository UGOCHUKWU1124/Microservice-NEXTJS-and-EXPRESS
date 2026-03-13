    import { forwardRef } from "react";
    type InputProps = BaseProps & React.InputHTMLAttributes<HTMLInputElement>;
    type TextareaProps = BaseProps &
    React.TextareaHTMLAttributes<HTMLTextAreaElement>;

    interface BaseProps {
    label?: string;
    className?: string;
    type?: "text" | "password" | "email" | "number" | "textarea";
    }

    type Props = InputProps | TextareaProps;

    const Input = forwardRef<HTMLInputElement | HTMLTextAreaElement, Props>(
    ({ label, type = "text", className, ...props }, ref) => {
        return (
        <div className="w-full">
            {label && (
            <label className="block mb-2 font-semibold text-gray-300 dark:text-white">
                {label}
            </label>
            )}

            {type === "textarea" ? (
            <textarea
                ref={ref as React.Ref<HTMLTextAreaElement>}
                className={`w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300 dark:bg-gray-800 dark:text-white dark:border-gray-600 bg-transparent ${className}`}
                {...(props as TextareaProps)}
            />
            ) : (
                <input
                ref={ref as React.Ref<HTMLInputElement>}
                type={type} // because of the union type
                className={`w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300 dark:bg-gray-800 dark:text-white dark:border-gray-600 bg-transparent ${className}`}
                {...(props as InputProps)}
                />
            )}
        </div>
        );
    }
    );

    Input.displayName = "Input";

    export default Input;
