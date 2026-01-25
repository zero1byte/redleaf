import { currentUser } from "@/app/services/user/currentUser";
import { LogoutButton } from "@/components/logout-button";
import { ThemeSwitcher } from "@/components/theme-switcher";

export default function Header() {
  // const [user, setUser] = useState<any | null>(null);

  // useEffect(() => {
  (async () => {
    const res = await currentUser();
    console.log(res);
    // setUser(res);
  })();
  // }, []);
  return (
    <header className="w-full flex justify-center border-b border-b-foreground/10 h-16">
      <div className="w-full max-w-5xl flex justify-between items-center p-3 px-5 text-sm">
        <div className="flex gap-5 items-center font-semibold">
          <a href="/">Redleaf</a>
        </div>
        <div className="flex gap-5 items-center">
          <a href="/dashboard">Dashboard</a>
          <a href="/settings">Settings</a>
          <ThemeSwitcher />
          <div>
            <LogoutButton />
          </div>
        </div>
      </div>
    </header>
  );
}