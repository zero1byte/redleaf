import CONSTANT from "@/app/CONSTANT"
import { ThemeSwitcher } from "@/components/theme-switcher"
import { Link } from "@/components/ui/Link"



export default function AuthHeader() {
    return (
        <div className="mb-8 text-center">
            <div className="fixed top-0 left-0 w-full p-4 bg-transparent border-b shadow-sm">
                <div className="w-full flex justify-between">
                    <div>
                        <Link className="text-2xl font-bold" href="/">
                            {CONSTANT.APP_NAME}
                        </Link>
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