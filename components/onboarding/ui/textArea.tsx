export const TextArea = ({ label, name, id, placeholder,onChange,...props }: { label?: string, name: string, id: string, placeholder?: string, onChange?: React.ChangeEventHandler<HTMLTextAreaElement> }) => {
    return (
        <div className="flex gap-2 flex-col">
            {label && <label htmlFor={id}>{label}</label>}
            <textarea
                name={name}
                id={id}
                placeholder={placeholder}
                className="p-2 border-border border-2 rounded-md outline-none focus:border-primary transition resize-y min-h-[100px]"
                onChange={onChange}
                {...props}
            ></textarea>
        </div>
    )
}