import CONSTANT from "@/app/CONSTANT";
import { signinWithGoogle } from "@/lib/supabase/actions";

export const GoogleButton = () => {
    return (
        <form action={signinWithGoogle}>
            <button
                type="submit"
                className="flex justify-center items-center gap-2 p-4 bg-foreground/10 text-muted-foreground border-secondary border-2 rounded-md w-full">
                <img
                    src={CONSTANT.Icons.app.GoogleIcon}
                    className="size-5 rounded-full"
                    alt="Google Icon" />
                <p className="text-muted-foreground">
                    Sign in with Google
                </p>
            </button>
        </form>
    );
}