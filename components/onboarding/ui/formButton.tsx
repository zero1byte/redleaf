interface ButtonProps {
    children: React.ReactNode;
    onClick?: () => void;
    type?: boolean;
    className?: string;
}

export const Button = ({ children, onClick, type, className }: ButtonProps) => {
    return (
        <button
            onClick={onClick}
            className={`bg-secondary-foreground text-white p-2 rounded-md  px-4 transition ${className ? className : ''}`}
        >
            {children}
        </button>
    )
}