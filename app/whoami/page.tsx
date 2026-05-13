'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';

export default function Portfolio() {
    const [active, setActive] = useState('hero');

    useEffect(() => {
        const obs = new IntersectionObserver(
            entries => entries.forEach(e => e.isIntersecting && setActive(e.target.id)),
            { rootMargin: '-40% 0px -55% 0px' }
        );
        document.querySelectorAll('[data-s]').forEach(el => obs.observe(el));
        return () => obs.disconnect();
    }, []);

    const nav = [
        { id: 'about', label: 'About' },
        { id: 'skills', label: 'Skills' },
        { id: 'projects', label: 'Projects' },
        { id: 'experience', label: 'Experience' },
        { id: 'certifications', label: 'Certifications' },
    ];

    const skills = [
        { cat: 'Languages', color: '#185FA5', dot: '#DBEAFE', items: ['Python', 'C/C++', 'JavaScript', 'SQL', 'Bash', 'PowerShell'] },
        { cat: 'Frameworks', color: '#0F6E56', dot: '#9FE1CB', items: ['Node.js', 'React.js', 'FastAPI', 'TensorFlow', 'Scikit-learn'] },
        { cat: 'Security Tools', color: '#A32D2D', dot: '#F7C1C1', items: ['Nmap', 'Burp Suite', 'Metasploit', 'Wireshark', 'Snort', 'Nessus', 'Google Dorking'] },
        { cat: 'Forensics & Analysis', color: '#854F0B', dot: '#FAC775', items: ['Autopsy', 'FTK', 'Volatility', 'Log Analysis', 'Network Traffic Analysis'] },
        { cat: 'SIEM & Monitoring', color: '#3C3489', dot: '#CECBF6', items: ['Splunk', 'Microsoft Sentinel', 'Event Correlation', 'Threat Detection'] },
        { cat: 'OS & Networking', color: '#3B6D11', dot: '#C0DD97', items: ['Linux (Kali, Ubuntu)', 'Windows Server', 'TCP/IP', 'DNS', 'HTTP/S', 'VPN', 'IDS/IPS'] },
        { cat: 'Core Competencies', color: '#0F6E56', dot: '#5DCAA5', items: ['Vulnerability Assessment', 'Penetration Testing', 'Incident Response', 'Malware Analysis', 'OSINT', 'Cryptography'] },
        { cat: 'Standards', color: '#185FA5', dot: '#85B7EB', items: ['NIST CSF', 'MITRE ATT&CK', 'OWASP Top 10', 'ISO/IEC 27001', 'CIS Controls'] },
    ];

    const projects = [
        {
            title: 'apt-tracker',
            subtitle: 'Linux Package Audit Utility',
            date: 'Mar 2026',
            tags: ['Linux Security', 'System Monitoring', 'Bash'],
            desc: 'Zero-dependency Bash auditing tool that maintains a structured CSV log of all package install, remove, and upgrade events on Debian/Ubuntu systems. Supports system integrity monitoring and post-incident investigation via queryable software change history with action/time-period filtering.',
            badge: null,
            link: 'https://github.com/zero1byte/apt-tracker',
        },
        {
            title: 'Timestomping Detection in NTFS',
            subtitle: 'Security Tool Development',
            date: 'Mar 2026',
            tags: ['Python', 'C', 'FastAPI', 'React.js', 'Tailwind CSS'],
            desc: 'Security detection tool identifying timestamp manipulation on Windows NTFS volumes by cross-correlating $MFT, $UsnJrnl, and $LogFile artifacts. Features anomaly scoring, severity classification, and a full-stack React + FastAPI investigation dashboard for artifact review and data export.',
            badge: 'MITRE ATT&CK T1070.006',
            link: 'https://github.com/zero1byte/timestomping-detections-in-ntfs',
        },
        {
            title: 'Zerobytes.me Blog Portfolio',
            subtitle: 'Full-Stack Blog & Portfolio Platform',
            date: 'Nov 2025 – Present',
            tags: ['Next.js', 'React.js', 'TypeScript', 'Tailwind CSS', 'Supabase'],
            desc: 'Modern full-stack web application combining professional portfolio and technical blog platform. Features responsive design, markdown content rendering with code syntax highlighting, SEO optimization, and seamless integration with Supabase backend for content management and user authentication.',
            badge: null,
            link: '/',
        },
    ];

    const certs = [
        { name: 'Fortinet NSE 1 – Network Security Associate', org: 'Fortinet', date: 'Feb 2026' },
        { name: 'Fortinet NSE 3 – FortiGate 7.6 Operator', org: 'Fortinet', date: 'Mar 2026' },
        { name: 'File System Forensics Bootcamp', org: 'NFSU, Gandhinagar', date: 'Feb 2026' },
    ];

    const achievements = [
        { name: 'Cybersecurity Hackathon – Participant', org: 'NFSU, Gandhinagar', date: 'Mar 2026' },
        { name: 'Windows Forensics Analysis Bootcamp', org: 'CDAC, Thiruvananthapuram', date: 'Sep–Oct 2025' },
    ];

    return (
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] min-h-screen bg-portfolio-bg font-sans">
            {/* Sidebar */}
            <aside className="sticky top-0 h-screen lg:h-auto bg-portfolio-accent flex flex-col px-7 py-10 overflow-y-auto">
                <div className="w-14 h-14 rounded-full bg-white/12 flex items-center justify-center font-semibold text-white text-sm border border-white/18 mb-4 flex-shrink-0">
                    RM
                </div>
                <div className="text-white text-base font-semibold mb-1">Ramesh Mali</div>
                <div className="font-mono text-xs text-white/45 tracking-wide mb-8">cybersecurity student</div>

                <div className="font-mono text-xs text-white/30 tracking-widest uppercase mb-2.5">Navigation</div>
                <ul className="flex flex-col gap-0.5 mb-5">
                    {nav.map(n => (
                        <li key={n.id}>
                            <a 
                                href={`#${n.id}`} 
                                className={`flex items-center gap-2.5 px-2.5 py-2 rounded-md text-sm transition-all ${
                                    active === n.id 
                                        ? 'bg-white/11 text-white font-medium' 
                                        : 'text-white/55 hover:bg-white/8 hover:text-white'
                                }`}
                            >
                                <span className={`w-1.5 h-1.5 rounded-full transition-colors ${active === n.id ? 'bg-emerald-400' : 'bg-white/25'}`} />
                                {n.label}
                            </a>
                        </li>
                    ))}
                </ul>

                <div className="h-px bg-white/10 my-5" />

                <div className="font-mono text-xs text-white/30 tracking-widest uppercase mb-2.5">Contact</div>
                <div className="flex flex-col gap-2.5">
                    <div className="flex gap-2 text-xs text-white/40 break-words">
                        <span className="text-white/25 flex-shrink-0">@</span>
                        ramesh.95712897@gmail.com
                    </div>
                    <div className="flex gap-2 text-xs text-white/40">
                        <span className="text-white/25 flex-shrink-0">◎</span>
                        Gandhinagar, India
                    </div>
                </div>

                <div className="flex gap-2 mt-4">
                    {[
                        { l: 'https://img.freepik.com/premium-vector/vector-linkedin-apps-logo-rounded-asset-isolated_1004619-457.jpg?semt=ais_hybrid&w=740&q=80', url: 'https://www.linkedin.com/in/ramesh-mali-72301a28b/' },
                        { l: 'https://cdn-icons-png.flaticon.com/512/25/25231.png', url: 'https://github.com/zero1byte' },
                        { l: 'https://zerobytes.me/logo.png', url: 'https://zerobytes.me' },
                    ].map(s => (
                        <a 
                            key={s.l} 
                            href={s.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="relative inline-flex items-center justify-center w-8 h-8 rounded-md bg-white/7 border border-white/10 hover:bg-white/14 hover:text-white transition-all"
                        >
                            <Image src={s.l} alt="Social Link" fill className='bg-white rounded-full object-cover' />
                        </a>
                    ))}
                </div>
            </aside>

            {/* Main */}
            <main className="bg-portfolio-bg">
                {/* Hero */}
                <div className="bg-portfolio-surface border-b border-portfolio-border px-12 py-14" id="hero" data-s>
                    <div className="inline-flex items-center gap-1.5 font-mono text-xs text-portfolio-accent-mid bg-portfolio-accent-pale border border-emerald-300 px-2.5 py-1 rounded-full mb-6 tracking-widest">
                        <span className="w-1.5 h-1.5 rounded-full bg-portfolio-accent-mid animate-pulse" />
                        Open to opportunities
                    </div>
                    <h1 className="text-5xl font-semibold leading-tight tracking-tight text-portfolio-text mb-4">
                        Security Analyst &amp;<br />
                        <span className="text-portfolio-accent">Digital Forensics</span> Specialist
                    </h1>
                    <p className="text-base text-portfolio-text-2 max-w-2xl leading-relaxed mb-9">
                        Foundation in network security, ethical hacking, and digital forensics.
                        Hands-on experience in vulnerability analysis, incident response, and system behavior investigation.
                    </p>
                </div>

                {/* About */}
                <section className="px-12 py-12 border-b border-portfolio-border" id="about" data-s>
                    <div className="flex items-center gap-3 mb-7">
                        <span className="font-mono text-xs text-portfolio-accent-mid tracking-widest uppercase">01 — About</span>
                        <div className="h-px bg-portfolio-border flex-1" />
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                        <div className="bg-portfolio-surface border border-portfolio-border rounded-xl p-6">
                            <div className="font-mono text-xs text-portfolio-text-3 tracking-widest uppercase mb-4">Education</div>
                            <div className="pb-4 border-b border-portfolio-border mb-4">
                                <div className="text-sm font-medium text-portfolio-text mb-0.5">M.Sc. Digital Forensics &amp; Information Security</div>
                                <div className="text-sm font-medium text-portfolio-accent-mid mb-0.5">National Forensic Sciences University (NFSU)</div>
                                <div className="font-mono text-xs text-portfolio-text-3">Gandhinagar · Aug 2025 – Present</div>
                            </div>
                            <div>
                                <div className="text-sm font-medium text-portfolio-text mb-0.5">B.Sc. Computer Science</div>
                                <div className="text-sm font-medium text-portfolio-accent-mid mb-0.5">Central University of Rajasthan</div>
                                <div className="font-mono text-xs text-portfolio-text-3">CGPA: 6.47 · Oct 2022 – Jun 2025</div>
                            </div>
                        </div>
                        <div className="bg-portfolio-surface border border-portfolio-border rounded-xl p-6">
                            <div className="font-mono text-xs text-portfolio-text-3 tracking-widest uppercase mb-4">Objective</div>
                            <p className="text-sm text-portfolio-text-2 leading-relaxed">
                                Seeking to contribute to <mark className="bg-portfolio-accent-light text-portfolio-accent px-1 rounded">security operations</mark> and <mark className="bg-portfolio-accent-light text-portfolio-accent px-1 rounded">incident response</mark> through
                                disciplined, methodical analysis. Strong foundation in network security, ethical hacking, and digital
                                forensics with a focus on deepening practical expertise in threat detection and investigation workflows.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Skills */}
                <section className="px-12 py-12 border-b border-portfolio-border" id="skills" data-s>
                    <div className="flex items-center gap-3 mb-7">
                        <span className="font-mono text-xs text-portfolio-accent-mid tracking-widest uppercase">02 — Skills</span>
                        <div className="h-px bg-portfolio-border flex-1" />
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                        {skills.map(sk => (
                            <div key={sk.cat} className="bg-portfolio-surface border border-portfolio-border rounded-xl p-5">
                                <div className="font-mono text-xs tracking-widest uppercase mb-3 flex items-center gap-2" style={{ color: sk.color }}>
                                    <span className="w-1.5 h-1.5 rounded" style={{ background: sk.dot }} />
                                    {sk.cat}
                                </div>
                                <div className="flex flex-wrap gap-1.5">
                                    {sk.items.map(item => <span key={item} className="font-mono text-xs px-2 py-1 rounded bg-portfolio-surface-2 text-portfolio-text-2 border border-portfolio-border hover:bg-portfolio-accent-pale hover:border-emerald-300 hover:text-portfolio-accent-mid transition-all cursor-default">{item}</span>)}
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Projects */}
                <section className="px-12 py-12 border-b border-portfolio-border" id="projects" data-s>
                    <div className="flex items-center gap-3 mb-7">
                        <span className="font-mono text-xs text-portfolio-accent-mid tracking-widest uppercase">03 — Projects</span>
                        <div className="h-px bg-portfolio-border flex-1" />
                    </div>
                    <div className="flex flex-col gap-5">
                        {projects.map(p => (
                            <div key={p.title} className="bg-portfolio-surface border border-portfolio-border rounded-xl p-7 hover:border-portfolio-border-strong hover:shadow-sm transition-all">
                                <div className="flex justify-between items-start mb-1 gap-4 flex-wrap">
                                    <div>
                                        <div className="flex items-center gap-2 mb-0.5">
                                            <div className="font-mono text-base font-medium text-portfolio-text">{p.title}</div>
                                        </div>
                                        <div className="text-sm text-portfolio-accent-mid font-medium mb-3">{p.subtitle}</div>
                                    </div>
                                    <span className="font-mono text-xs text-portfolio-text-3 bg-portfolio-surface-2 border border-portfolio-border px-2 py-1 rounded whitespace-nowrap">{p.date}</span>
                                </div>
                                <div className="flex flex-wrap gap-1.5 mb-4">
                                    {p.tags.map(t => <span key={t} className="font-mono text-xs px-2 py-1 rounded bg-portfolio-surface-2 text-portfolio-text-2 border border-portfolio-border">{t}</span>)}
                                </div>
                                <p className="text-sm text-portfolio-text-2 leading-relaxed mb-4">{p.desc}</p>
                                <div className="flex items-center justify-between flex-wrap gap-3">
                                    {p.badge ? <span className="font-mono text-xs text-portfolio-amber bg-portfolio-amber-light border border-yellow-300 px-2 py-1 rounded">{p.badge}</span> : <span />}
                                    <a href={p.link} className="inline-flex items-center gap-1 font-mono text-xs text-portfolio-accent-mid hover:text-portfolio-accent transition-colors" target="_blank" rel="noopener noreferrer">View on GitHub →</a>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Experience */}
                <section className="px-12 py-12 border-b border-portfolio-border" id="experience" data-s>
                    <div className="flex items-center gap-3 mb-7">
                        <span className="font-mono text-xs text-portfolio-accent-mid tracking-widest uppercase">04 — Experience</span>
                        <div className="h-px bg-portfolio-border flex-1" />
                    </div>
                    <div className="bg-portfolio-surface border border-portfolio-border rounded-xl p-8">
                        <div className="flex justify-between items-start mb-6 gap-4 flex-wrap">
                            <div>
                                <div className="text-lg font-semibold text-portfolio-text mb-1">Frontend Developer</div>
                                <span className="inline-block font-mono text-xs text-portfolio-blue bg-portfolio-blue-pale border border-portfolio-blue-light px-2.5 py-1 rounded">Startup – Client Project (Remote)</span>
                            </div>
                            <div className="font-mono text-xs text-portfolio-text-3 bg-portfolio-surface-2 border border-portfolio-border px-3 py-1 rounded flex items-center gap-1.5 whitespace-nowrap">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                Nov 2025 – Present
                            </div>
                        </div>
                        <ul className="flex flex-col gap-2.5">
                            {[
                                'Developing a production-grade web application for an external client within a 4-member agile team using React.js.',
                                'Translating client requirements into responsive UI components with iterative delivery under real-world constraints.',
                                'Shipping features end-to-end across design, development, and testing phases in a startup environment.',
                            ].map(h => (
                                <li key={h} className="flex gap-2.5 items-start text-sm text-portfolio-text-2 leading-relaxed">
                                    <span className="text-portfolio-accent-mid text-xs mt-1 flex-shrink-0">▸</span>
                                    {h}
                                </li>
                            ))}
                        </ul>
                    </div>
                </section>

                {/* Certifications */}
                <section className="px-12 py-12" id="certifications" data-s>
                    <div className="flex items-center gap-3 mb-7">
                        <span className="font-mono text-xs text-portfolio-accent-mid tracking-widest uppercase">05 — Certifications &amp; Achievements</span>
                        <div className="h-px bg-portfolio-border flex-1" />
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-8">
                        {certs.map(c => (
                            <div key={c.name} className="bg-portfolio-surface border border-portfolio-border rounded-xl p-5 hover:border-portfolio-border-strong transition-all">
                                <div className="w-9 h-9 rounded-lg bg-portfolio-accent-pale border border-emerald-300 flex items-center justify-center text-base mb-3">▪</div>
                                <div className="text-sm font-medium text-portfolio-text mb-1">{c.name}</div>
                                <div className="font-mono text-xs text-portfolio-accent-mid mb-1">{c.org}</div>
                                <div className="font-mono text-xs text-portfolio-text-3">{c.date}</div>
                            </div>
                        ))}
                    </div>

                    <div className="flex items-center gap-3 mb-4">
                        <span className="font-mono text-xs text-portfolio-accent-mid tracking-widest uppercase">Achievements</span>
                        <div className="h-px bg-portfolio-border flex-1" />
                    </div>
                    <div className="flex flex-col gap-3">
                        {achievements.map(a => (
                            <div key={a.name} className="bg-portfolio-surface border border-portfolio-border rounded-lg px-5 py-3.5 flex items-center justify-between gap-4 flex-wrap">
                                <div className="flex items-center gap-2.5">
                                    <span className="w-5 h-5 rounded text-center text-xs font-bold bg-portfolio-amber-light text-portfolio-amber flex items-center justify-center flex-shrink-0">★</span>
                                    <span className="text-sm text-portfolio-text">{a.name}</span>
                                </div>
                                <div className="font-mono text-xs text-portfolio-text-3 text-right">
                                    {a.org}<br />{a.date}
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </main>
        </div>
    );
}