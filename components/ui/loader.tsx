import { Loader2 } from "lucide-react";

export const Loader = ({ text }: { text?: string }) => {
    return (
        <div className="flex items-center justify-center flex-col w-full h-full min-h-screen py-10">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            {text && <p className="mt-4 text-center text-sm text-foreground">{text}</p>}
        </div>
    );
}