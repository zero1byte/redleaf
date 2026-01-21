
export const Form = ({ children, className }: { children: React.ReactNode, className?: string }) => {
    return (
        <div>
            <form className={`flex flex-col gap-4 w-full ${className ? className : ''}`}>
                {children}
            </form>
        </div>
    )
}