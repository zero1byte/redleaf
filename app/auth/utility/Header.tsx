import CONSTANT from "@/app/CONSTANT"
import { ThemeSwitcher } from "@/components/theme-switcher"



export default function AuthHeader() {
    return (
        <div className="mb-8 text-center ">
            <div className="fixed top-0 left-0 w-full p-4 bg-transparent border-b border-b-foreground/10 shadow-sm sm:px-40">
                <div className="w-full flex justify-between">
                    <div className="flex gap-5 items-center font-semibold ">
                        <a href="/">{CONSTANT.APP_NAME}</a>
                    </div>
                    <div>

                    </div>
                    <div>
                        <ThemeSwitcher />
                    </div>
                </div>
            </div>
        </div>
    )
}