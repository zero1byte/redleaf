import Header from "../protected/components/header";

export default function BlogsLayout({ children }: { children: React.ReactNode }) {
    return (
        <div>
            <div>
                <Header />
            </div>
            <div>
                {children}
            </div>
        </div>
    );
}