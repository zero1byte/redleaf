import CONSTANT from "@/app/CONSTANT";

export const GoogleButton = () => {
    return (
        <button className="flex justify-center items-center gap-2 p-4 bg-foreground text-background border-secondary border-2 rounded-md w-full">
            <img
                src={CONSTANT.Icons.app.GoogleIcon}
                className="size-5 rounded-full"
                alt="Google Icon" />
            Sign in with Google
        </button>
    );
}