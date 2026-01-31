import Header from "../protected/components/header";

export default function BlogsLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex flex-col gap-2">
            <Header />
            <div className="">
                {children}
            </div>
        </div>
    );
}