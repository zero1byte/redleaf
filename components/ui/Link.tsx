export const Link = ({ children, href, ...props }: { children: React.ReactNode; href: string } & React.AnchorHTMLAttributes<HTMLAnchorElement>) => {
    return <a href={href} {...props}>{children}</a>;
}