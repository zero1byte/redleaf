interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    type: string;
    name: string;
    id: string;
    placeholder?: string;
    msgType?: boolean;
    message?: string;
}
export const Input = ({ label, type, name, id, placeholder, msgType, message, ...props }: InputProps) => {
    return (
        <div className="flex gap-2 flex-col">
            {label && <label htmlFor={id}>{label}</label>}
            <input
                type={type}
                name={name}
                id={id}
                placeholder={placeholder}
                className="p-2 border-border border-2 rounded-md outline-none focus:border-primary transition"
                {...props}
            />
            <p>
                {/* Error message can be displayed here */}
                {
                    message ? (
                        msgType ? (<span className="text-sm text-green-600">{message}</span>
                        ) : (
                            <span className="text-sm text-red-600">{message}</span>
                        )) : null
                }
            </p>
        </div>
    )
}