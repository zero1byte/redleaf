'use client';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export const BackgroundStyles = ({ children }: { children: React.ReactNode }) => {
    const { theme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return <div className="min-h-screen">{children}</div>;

    // Dark mode colors
    const darkBg = '#04a2cd3';
    const darkStroke = '#1E40AF';

    // Light mode colors
    const lightBg = '#F0F4F8';
    const lightStroke = '#93C5FD';

    const bgColor = theme === 'dark' ? darkBg : lightBg;
    const strokeColor = theme === 'dark' ? darkStroke : lightStroke;

    return (
        <div className="">
            <div className="fixed top-0 left-0 w-screen h-screen -z-10 overflow-hidden">
                <svg xmlns="http://www.w3.org/2000/svg" version="1.1" xmlnsXlink="http://www.w3.org/1999/xlink" width="100%" height="100%" preserveAspectRatio="xMidYMid slice" viewBox="0 0 1440 560" style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }}>
                    <g mask="url(&quot;#SvgjsMask1000&quot;)" fill="none">
                        <rect width="1440" height="560" x="0" y="0" fill={bgColor}></rect>
                        <use xmlnsXlink="http://www.w3.org/1999/xlink" xlinkHref="#SvgjsSymbol1007" x="0" y="0"></use>
                        <use xmlnsXlink="http://www.w3.org/1999/xlink" xlinkHref="#SvgjsSymbol1007" x="720" y="0"></use>
                    </g>
                    <defs>
                        <mask id="SvgjsMask1000">
                            <rect width="1440" height="560" fill="#ffffff"></rect>
                        </mask>
                        <path d="M-1 0 a1 1 0 1 0 2 0 a1 1 0 1 0 -2 0z" id="SvgjsPath1005"></path>
                        <path d="M-3 0 a3 3 0 1 0 6 0 a3 3 0 1 0 -6 0z" id="SvgjsPath1003"></path>
                        <path d="M-5 0 a5 5 0 1 0 10 0 a5 5 0 1 0 -10 0z" id="SvgjsPath1001"></path>
                        <path d="M2 -2 L-2 2z" id="SvgjsPath1004"></path>
                        <path d="M6 -6 L-6 6z" id="SvgjsPath1002"></path>
                        <path d="M30 -30 L-30 30z" id="SvgjsPath1006"></path>
                    </defs>
                    <symbol id="SvgjsSymbol1007">
                        <use xlinkHref="#SvgjsPath1001" x="30" y="30" stroke={strokeColor}></use>
                        <use xlinkHref="#SvgjsPath1002" x="30" y="90" stroke={strokeColor}></use>
                        <use xlinkHref="#SvgjsPath1001" x="30" y="150" stroke={strokeColor}></use>
                        <use xlinkHref="#SvgjsPath1002" x="30" y="210" stroke={strokeColor}></use>
                        <use xlinkHref="#SvgjsPath1002" x="30" y="270" stroke={strokeColor}></use>
                        <use xlinkHref="#SvgjsPath1003" x="30" y="330" stroke={strokeColor}></use>
                        <use xlinkHref="#SvgjsPath1001" x="30" y="390" stroke={strokeColor}></use>
                        <use xlinkHref="#SvgjsPath1002" x="30" y="450" stroke={strokeColor}></use>
                        <use xlinkHref="#SvgjsPath1002" x="30" y="510" stroke={strokeColor}></use>
                        <use xlinkHref="#SvgjsPath1001" x="30" y="570" stroke={strokeColor}></use>
                        <use xlinkHref="#SvgjsPath1004" x="90" y="30" stroke={strokeColor}></use>
                        <use xlinkHref="#SvgjsPath1003" x="90" y="90" stroke={strokeColor}></use>
                        <use xlinkHref="#SvgjsPath1001" x="90" y="150" stroke={strokeColor}></use>
                        <use xlinkHref="#SvgjsPath1001" x="90" y="210" stroke={strokeColor}></use>
                        <use xlinkHref="#SvgjsPath1004" x="90" y="270" stroke={strokeColor}></use>
                        <use xlinkHref="#SvgjsPath1002" x="90" y="330" stroke={strokeColor}></use>
                        <use xlinkHref="#SvgjsPath1001" x="90" y="390" stroke={strokeColor}></use>
                        <use xlinkHref="#SvgjsPath1002" x="90" y="450" stroke={strokeColor}></use>
                        <use xlinkHref="#SvgjsPath1002" x="90" y="510" stroke={strokeColor}></use>
                        <use xlinkHref="#SvgjsPath1004" x="90" y="570" stroke={strokeColor}></use>
                        <use xlinkHref="#SvgjsPath1002" x="150" y="30" stroke={strokeColor}></use>
                        <use xlinkHref="#SvgjsPath1005" x="150" y="90" stroke={strokeColor}></use>
                        <use xlinkHref="#SvgjsPath1005" x="150" y="150" stroke={strokeColor}></use>
                        <use xlinkHref="#SvgjsPath1001" x="150" y="210" stroke={strokeColor}></use>
                        <use xlinkHref="#SvgjsPath1002" x="150" y="270" stroke={strokeColor}></use>
                        <use xlinkHref="#SvgjsPath1005" x="150" y="330" stroke={strokeColor}></use>
                        <use xlinkHref="#SvgjsPath1004" x="150" y="390" stroke={strokeColor}></use>
                        <use xlinkHref="#SvgjsPath1002" x="150" y="450" stroke={strokeColor}></use>
                        <use xlinkHref="#SvgjsPath1002" x="150" y="510" stroke={strokeColor}></use>
                        <use xlinkHref="#SvgjsPath1001" x="150" y="570" stroke={strokeColor}></use>
                        <use xlinkHref="#SvgjsPath1001" x="210" y="30" stroke={strokeColor}></use>
                        <use xlinkHref="#SvgjsPath1006" x="210" y="90" stroke={strokeColor} strokeWidth="3"></use>
                        <use xlinkHref="#SvgjsPath1001" x="210" y="150" stroke={strokeColor}></use>
                        <use xlinkHref="#SvgjsPath1003" x="210" y="210" stroke={strokeColor}></use>
                        <use xlinkHref="#SvgjsPath1004" x="210" y="270" stroke={strokeColor}></use>
                        <use xlinkHref="#SvgjsPath1002" x="210" y="330" stroke={strokeColor}></use>
                        <use xlinkHref="#SvgjsPath1006" x="210" y="390" stroke={strokeColor} strokeWidth="3"></use>
                        <use xlinkHref="#SvgjsPath1001" x="210" y="450" stroke={strokeColor}></use>
                        <use xlinkHref="#SvgjsPath1001" x="210" y="510" stroke={strokeColor}></use>
                        <use xlinkHref="#SvgjsPath1001" x="210" y="570" stroke={strokeColor}></use>
                        <use xlinkHref="#SvgjsPath1006" x="270" y="30" stroke={strokeColor} strokeWidth="3"></use>
                        <use xlinkHref="#SvgjsPath1002" x="270" y="90" stroke={strokeColor}></use>
                        <use xlinkHref="#SvgjsPath1005" x="270" y="150" stroke={strokeColor}></use>
                        <use xlinkHref="#SvgjsPath1001" x="270" y="210" stroke={strokeColor}></use>
                        <use xlinkHref="#SvgjsPath1004" x="270" y="270" stroke={strokeColor}></use>
                        <use xlinkHref="#SvgjsPath1001" x="270" y="330" stroke={strokeColor}></use>
                        <use xlinkHref="#SvgjsPath1006" x="270" y="390" stroke={strokeColor} strokeWidth="3"></use>
                        <use xlinkHref="#SvgjsPath1004" x="270" y="450" stroke={strokeColor}></use>
                        <use xlinkHref="#SvgjsPath1006" x="270" y="510" stroke={strokeColor} strokeWidth="3"></use>
                        <use xlinkHref="#SvgjsPath1002" x="270" y="570" stroke={strokeColor}></use>
                        <use xlinkHref="#SvgjsPath1002" x="330" y="30" stroke={strokeColor}></use>
                        <use xlinkHref="#SvgjsPath1005" x="330" y="90" stroke={strokeColor}></use>
                        <use xlinkHref="#SvgjsPath1001" x="330" y="150" stroke={strokeColor}></use>
                        <use xlinkHref="#SvgjsPath1001" x="330" y="210" stroke={strokeColor}></use>
                        <use xlinkHref="#SvgjsPath1002" x="330" y="270" stroke={strokeColor}></use>
                        <use xlinkHref="#SvgjsPath1004" x="330" y="330" stroke={strokeColor}></use>
                        <use xlinkHref="#SvgjsPath1005" x="330" y="390" stroke={strokeColor}></use>
                        <use xlinkHref="#SvgjsPath1002" x="330" y="450" stroke={strokeColor}></use>
                        <use xlinkHref="#SvgjsPath1004" x="330" y="510" stroke={strokeColor}></use>
                        <use xlinkHref="#SvgjsPath1002" x="330" y="570" stroke={strokeColor}></use>
                        <use xlinkHref="#SvgjsPath1001" x="390" y="30" stroke={strokeColor}></use>
                        <use xlinkHref="#SvgjsPath1002" x="390" y="90" stroke={strokeColor}></use>
                        <use xlinkHref="#SvgjsPath1006" x="390" y="150" stroke={strokeColor} strokeWidth="3"></use>
                        <use xlinkHref="#SvgjsPath1002" x="390" y="210" stroke={strokeColor}></use>
                        <use xlinkHref="#SvgjsPath1002" x="390" y="270" stroke={strokeColor}></use>
                        <use xlinkHref="#SvgjsPath1001" x="390" y="330" stroke={strokeColor}></use>
                        <use xlinkHref="#SvgjsPath1002" x="390" y="390" stroke={strokeColor}></use>
                        <use xlinkHref="#SvgjsPath1002" x="390" y="450" stroke={strokeColor}></use>
                        <use xlinkHref="#SvgjsPath1002" x="390" y="510" stroke={strokeColor}></use>
                        <use xlinkHref="#SvgjsPath1001" x="390" y="570" stroke={strokeColor}></use>
                        <use xlinkHref="#SvgjsPath1005" x="450" y="30" stroke={strokeColor}></use>
                        <use xlinkHref="#SvgjsPath1001" x="450" y="90" stroke={strokeColor}></use>
                        <use xlinkHref="#SvgjsPath1002" x="450" y="150" stroke={strokeColor}></use>
                        <use xlinkHref="#SvgjsPath1004" x="450" y="210" stroke={strokeColor}></use>
                        <use xlinkHref="#SvgjsPath1004" x="450" y="270" stroke={strokeColor}></use>
                        <use xlinkHref="#SvgjsPath1005" x="450" y="330" stroke={strokeColor}></use>
                        <use xlinkHref="#SvgjsPath1001" x="450" y="390" stroke={strokeColor}></use>
                        <use xlinkHref="#SvgjsPath1001" x="450" y="450" stroke={strokeColor}></use>
                        <use xlinkHref="#SvgjsPath1002" x="450" y="510" stroke={strokeColor}></use>
                        <use xlinkHref="#SvgjsPath1005" x="450" y="570" stroke={strokeColor}></use>
                        <use xlinkHref="#SvgjsPath1001" x="510" y="30" stroke={strokeColor}></use>
                        <use xlinkHref="#SvgjsPath1004" x="510" y="90" stroke={strokeColor}></use>
                        <use xlinkHref="#SvgjsPath1001" x="510" y="150" stroke={strokeColor}></use>
                        <use xlinkHref="#SvgjsPath1001" x="510" y="210" stroke={strokeColor}></use>
                        <use xlinkHref="#SvgjsPath1001" x="510" y="270" stroke={strokeColor}></use>
                        <use xlinkHref="#SvgjsPath1001" x="510" y="330" stroke={strokeColor}></use>
                        <use xlinkHref="#SvgjsPath1004" x="510" y="390" stroke={strokeColor}></use>
                        <use xlinkHref="#SvgjsPath1002" x="510" y="450" stroke={strokeColor}></use>
                        <use xlinkHref="#SvgjsPath1006" x="510" y="510" stroke={strokeColor} strokeWidth="3"></use>
                        <use xlinkHref="#SvgjsPath1002" x="510" y="570" stroke={strokeColor}></use>
                        <use xlinkHref="#SvgjsPath1003" x="570" y="30" stroke={strokeColor}></use>
                        <use xlinkHref="#SvgjsPath1002" x="570" y="90" stroke={strokeColor}></use>
                        <use xlinkHref="#SvgjsPath1004" x="570" y="150" stroke={strokeColor}></use>
                        <use xlinkHref="#SvgjsPath1006" x="570" y="210" stroke={strokeColor} strokeWidth="3"></use>
                        <use xlinkHref="#SvgjsPath1002" x="570" y="270" stroke={strokeColor}></use>
                        <use xlinkHref="#SvgjsPath1001" x="570" y="330" stroke={strokeColor}></use>
                        <use xlinkHref="#SvgjsPath1005" x="570" y="390" stroke={strokeColor}></use>
                        <use xlinkHref="#SvgjsPath1002" x="570" y="450" stroke={strokeColor}></use>
                        <use xlinkHref="#SvgjsPath1001" x="570" y="510" stroke={strokeColor}></use>
                        <use xlinkHref="#SvgjsPath1001" x="570" y="570" stroke={strokeColor}></use>
                        <use xlinkHref="#SvgjsPath1004" x="630" y="30" stroke={strokeColor}></use>
                        <use xlinkHref="#SvgjsPath1001" x="630" y="90" stroke={strokeColor}></use>
                        <use xlinkHref="#SvgjsPath1002" x="630" y="150" stroke={strokeColor}></use>
                        <use xlinkHref="#SvgjsPath1001" x="630" y="210" stroke={strokeColor}></use>
                        <use xlinkHref="#SvgjsPath1002" x="630" y="270" stroke={strokeColor}></use>
                        <use xlinkHref="#SvgjsPath1002" x="630" y="330" stroke={strokeColor}></use>
                        <use xlinkHref="#SvgjsPath1001" x="630" y="390" stroke={strokeColor}></use>
                        <use xlinkHref="#SvgjsPath1001" x="630" y="450" stroke={strokeColor}></use>
                        <use xlinkHref="#SvgjsPath1002" x="630" y="510" stroke={strokeColor}></use>
                        <use xlinkHref="#SvgjsPath1005" x="630" y="570" stroke={strokeColor}></use>
                        <use xlinkHref="#SvgjsPath1004" x="690" y="30" stroke={strokeColor}></use>
                        <use xlinkHref="#SvgjsPath1002" x="690" y="90" stroke={strokeColor}></use>
                        <use xlinkHref="#SvgjsPath1001" x="690" y="150" stroke={strokeColor}></use>
                        <use xlinkHref="#SvgjsPath1003" x="690" y="210" stroke={strokeColor}></use>
                        <use xlinkHref="#SvgjsPath1001" x="690" y="270" stroke={strokeColor}></use>
                        <use xlinkHref="#SvgjsPath1002" x="690" y="330" stroke={strokeColor}></use>
                        <use xlinkHref="#SvgjsPath1001" x="690" y="390" stroke={strokeColor}></use>
                        <use xlinkHref="#SvgjsPath1001" x="690" y="450" stroke={strokeColor}></use>
                        <use xlinkHref="#SvgjsPath1004" x="690" y="510" stroke={strokeColor}></use>
                        <use xlinkHref="#SvgjsPath1005" x="690" y="570" stroke={strokeColor}></use>
                    </symbol>
                </svg>
            </div>
            <div>
                {children}
            </div>
        </div>
    )
}