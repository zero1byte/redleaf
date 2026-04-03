import AuthHeader from "./utility/Header";
import { GoogleButton } from "./utility/mini/GoogleButton";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="relative bg-background min-h-screen flex flex-col justify-center items-center px-4 py-12 sm:px-6 lg:px-8">
            <AuthHeader />
            <div className="flex flex-col gap-6 mt-8 lg:w-1/3 w-full">
                {children}
                <GoogleButton />
            </div>
        </div>
    );
}

export default AuthLayout;