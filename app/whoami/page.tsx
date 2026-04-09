'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';

const css = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&family=DM+Mono:wght@400;500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html { scroll-behavior: smooth; }

  :root {
    --bg: #F7F6F3;
    --surface: #FFFFFF;
    --surface-2: #F0EEE9;
    --border: #E5E2DB;
    --border-strong: #C8C4BB;
    --text: #1A1A18;
    --text-2: #52524E;
    --text-3: #8A8880;
    --accent: #1B4332;
    --accent-light: #D8F3DC;
    --accent-mid: #40916C;
    --accent-pale: #F0FAF4;
    --blue: #1E3A5F;
    --blue-light: #DBEAFE;
    --blue-pale: #F0F6FF;
    --amber: #78350F;
    --amber-light: #FEF3C7;
  }

  body {
    font-family: 'DM Sans', sans-serif;
    background: var(--bg);
    color: var(--text);
    font-size: 15px;
    line-height: 1.6;
    -webkit-font-smoothing: antialiased;
  }

  .mono { font-family: 'DM Mono', monospace; }

  .page { display: grid; grid-template-columns: 280px 1fr; min-height: 100vh; }

  /* ── Sidebar ── */
  .sidebar {
    position: sticky; top: 0; height: 100vh;
    background: var(--accent);
    display: flex; flex-direction: column;
    padding: 2.5rem 1.75rem;
    overflow-y: auto;
  }

  .sidebar-avatar {
    width: 56px; height: 56px; border-radius: 50%;
    background: rgba(255,255,255,0.12);
    display: flex; align-items: center; justify-content: center;
    font-size: 1.1rem; font-weight: 600; color: #fff;
    letter-spacing: -0.5px; margin-bottom: 1rem;
    border: 1.5px solid rgba(255,255,255,0.18);
    flex-shrink: 0;
  }

  .sidebar-name { font-size: 1.15rem; font-weight: 600; color: #fff; margin-bottom: 3px; line-height: 1.2; }
  .sidebar-role { font-family: 'DM Mono', monospace; font-size: 0.68rem; color: rgba(255,255,255,0.45); letter-spacing: 0.04em; margin-bottom: 2rem; }

  .sidebar-divider { height: 1px; background: rgba(255,255,255,0.1); margin: 1.25rem 0; }

  .sidebar-label { font-family: 'DM Mono', monospace; font-size: 0.6rem; letter-spacing: 0.14em; color: rgba(255,255,255,0.3); text-transform: uppercase; margin-bottom: 0.6rem; }

  .sidebar-nav { list-style: none; display: flex; flex-direction: column; gap: 2px; }

  .snav-link {
    display: flex; align-items: center; gap: 9px;
    padding: 0.5rem 0.65rem; border-radius: 6px;
    color: rgba(255,255,255,0.55); text-decoration: none;
    font-size: 0.875rem; transition: background 0.15s, color 0.15s;
  }
  .snav-link:hover { background: rgba(255,255,255,0.08); color: #fff; }
  .snav-link.active { background: rgba(255,255,255,0.11); color: #fff; font-weight: 500; }

  .snav-dot { width: 5px; height: 5px; border-radius: 50%; background: rgba(255,255,255,0.25); flex-shrink: 0; transition: background 0.15s; }
  .snav-link.active .snav-dot { background: #6EE7B7; }

  .sidebar-contact { display: flex; flex-direction: column; gap: 0.55rem; margin-top: auto; }
  .sc-item { display: flex; align-items: flex-start; gap: 7px; font-family: 'DM Mono', monospace; font-size: 0.67rem; color: rgba(255,255,255,0.4); word-break: break-all; line-height: 1.5; }
  .sc-icon { color: rgba(255,255,255,0.25); margin-top: 1px; flex-shrink: 0; }

  .sidebar-socials { display: flex; gap: 7px; margin-top: 1rem; }
  .ss-btn {
    display: inline-flex; align-items: center; justify-content: center;
    width: 30px; height: 30px; border-radius: 6px;
    background: rgba(255,255,255,0.07); border: 1px solid rgba(255,255,255,0.1);
    color: rgba(255,255,255,0.5); font-family: 'DM Mono', monospace; font-size: 0.65rem;
    text-decoration: none; transition: background 0.15s, color 0.15s;
  }
  .ss-btn:hover { background: rgba(255,255,255,0.14); color: #fff; }

  /* ── Main ── */
  .main { background: var(--bg); }

  /* Hero */
  .hero { padding: 3.5rem 3rem 3rem; background: var(--surface); border-bottom: 1px solid var(--border); }

  .eyebrow {
    display: inline-flex; align-items: center; gap: 6px;
    font-family: 'DM Mono', monospace; font-size: 0.68rem;
    color: var(--accent-mid); background: var(--accent-pale);
    border: 1px solid #B7E4C7; padding: 3px 10px;
    border-radius: 20px; margin-bottom: 1.5rem; letter-spacing: 0.04em;
  }

  .status-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--accent-mid); animation: blink 2.5s ease-in-out infinite; }
  @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.3} }

  .hero-h1 { font-size: 2.5rem; font-weight: 600; line-height: 1.1; letter-spacing: -0.03em; color: var(--text); margin-bottom: 1rem; }
  .hero-h1 em { font-style: normal; color: var(--accent); }
  .hero-sub { font-size: 0.95rem; color: var(--text-2); max-width: 500px; line-height: 1.75; margin-bottom: 2.25rem; }

  .hero-stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1px; background: var(--border); border: 1px solid var(--border); border-radius: 10px; overflow: hidden; max-width: 520px; }
  .hstat { background: var(--surface); padding: 1rem 1.1rem; }
  .hstat-val { font-size: 1.4rem; font-weight: 600; color: var(--text); letter-spacing: -0.03em; line-height: 1; margin-bottom: 3px; }
  .hstat-label { font-size: 0.65rem; color: var(--text-3); font-family: 'DM Mono', monospace; letter-spacing: 0.03em; }

  /* Section */
  .section { padding: 3rem; border-bottom: 1px solid var(--border); }
  .section:last-child { border-bottom: none; }

  .sec-label { display: flex; align-items: center; gap: 12px; margin-bottom: 1.75rem; }
  .sec-label-text { font-family: 'DM Mono', monospace; font-size: 0.62rem; color: var(--accent-mid); letter-spacing: 0.13em; text-transform: uppercase; white-space: nowrap; }
  .sec-label-line { height: 1px; background: var(--border); flex: 1; }

  /* Cards */
  .card { background: var(--surface); border: 1px solid var(--border); border-radius: 10px; padding: 1.5rem; }
  .card-lbl { font-family: 'DM Mono', monospace; font-size: 0.62rem; color: var(--text-3); letter-spacing: 0.09em; text-transform: uppercase; margin-bottom: 1rem; }

  /* About */
  .about-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.25rem; }
  .edu-item { margin-bottom: 1.1rem; }
  .edu-item:last-child { margin-bottom: 0; }
  .edu-deg { font-size: 0.875rem; font-weight: 500; color: var(--text); margin-bottom: 2px; line-height: 1.4; }
  .edu-school { font-size: 0.8rem; color: var(--accent-mid); font-weight: 500; margin-bottom: 2px; }
  .edu-meta { font-family: 'DM Mono', monospace; font-size: 0.67rem; color: var(--text-3); }
  .obj-text { font-size: 0.875rem; color: var(--text-2); line-height: 1.8; }
  .obj-text mark { background: var(--accent-light); color: var(--accent); padding: 1px 4px; border-radius: 3px; font-weight: 500; }

  /* Skills */
  .skills-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1.25rem; }
  .skill-card { background: var(--surface); border: 1px solid var(--border); border-radius: 10px; padding: 1.2rem 1.4rem; }
  .skill-cat { font-family: 'DM Mono', monospace; font-size: 0.62rem; letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 0.8rem; display: flex; align-items: center; gap: 7px; }
  .skill-dot { width: 6px; height: 6px; border-radius: 2px; flex-shrink: 0; }
  .tags { display: flex; flex-wrap: wrap; gap: 5px; }
  .tag { font-family: 'DM Mono', monospace; font-size: 0.67rem; padding: 3px 8px; border-radius: 4px; background: var(--surface-2); color: var(--text-2); border: 1px solid var(--border); transition: background 0.15s, border-color 0.15s, color 0.15s; cursor: default; }
  .tag:hover { background: var(--accent-pale); border-color: #B7E4C7; color: var(--accent); }

  /* Projects */
  .proj-list { display: flex; flex-direction: column; gap: 1.25rem; }
  .proj-card { background: var(--surface); border: 1px solid var(--border); border-radius: 10px; padding: 1.75rem; transition: border-color 0.15s, box-shadow 0.15s; }
  .proj-card:hover { border-color: var(--border-strong); box-shadow: 0 2px 12px rgba(0,0,0,0.05); }
  .proj-top { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 4px; gap: 1rem; flex-wrap: wrap; }
  .proj-icon { font-size: 1.4rem; margin-right: 0.5rem; flex-shrink: 0; }
  .proj-title-group { display: flex; align-items: center; }
  .proj-title { font-family: 'DM Mono', monospace; font-size: 0.975rem; font-weight: 500; color: var(--text); }
  .proj-subtitle { font-size: 0.8rem; color: var(--accent-mid); font-weight: 500; margin-bottom: 0.85rem; }
  .proj-date { font-family: 'DM Mono', monospace; font-size: 0.62rem; color: var(--text-3); background: var(--surface-2); border: 1px solid var(--border); padding: 3px 8px; border-radius: 4px; white-space: nowrap; }
  .proj-desc { font-size: 0.85rem; color: var(--text-2); line-height: 1.75; margin-bottom: 1.1rem; }
  .proj-footer { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 0.75rem; }
  .badge-mitre { font-family: 'DM Mono', monospace; font-size: 0.62rem; color: var(--amber); background: var(--amber-light); border: 1px solid #FDE68A; padding: 3px 8px; border-radius: 4px; letter-spacing: 0.03em; }
  .proj-link { display: inline-flex; align-items: center; gap: 4px; font-family: 'DM Mono', monospace; font-size: 0.68rem; color: var(--accent-mid); text-decoration: none; transition: color 0.15s; }
  .proj-link:hover { color: var(--accent); }

  /* Experience */
  .exp-card { background: var(--surface); border: 1px solid var(--border); border-radius: 10px; padding: 2rem; }
  .exp-top { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1.4rem; gap: 1rem; flex-wrap: wrap; }
  .exp-role { font-size: 1rem; font-weight: 600; color: var(--text); margin-bottom: 5px; }
  .exp-co { font-family: 'DM Mono', monospace; font-size: 0.7rem; color: var(--blue); background: var(--blue-pale); border: 1px solid var(--blue-light); padding: 3px 9px; border-radius: 4px; display: inline-block; }
  .exp-period { font-family: 'DM Mono', monospace; font-size: 0.67rem; color: var(--text-3); background: var(--surface-2); border: 1px solid var(--border); padding: 4px 11px; border-radius: 4px; display: flex; align-items: center; gap: 6px; }
  .exp-pdot { width: 5px; height: 5px; border-radius: 50%; background: #6EE7B7; animation: blink 2.5s infinite; }
  .exp-list { list-style: none; display: flex; flex-direction: column; gap: 0.6rem; }
  .exp-item { display: flex; gap: 10px; align-items: flex-start; font-size: 0.85rem; color: var(--text-2); line-height: 1.65; }
  .exp-arr { color: var(--accent-mid); font-size: 0.65rem; margin-top: 4px; flex-shrink: 0; }

  /* Certs */
  .certs-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 1.25rem; margin-bottom: 1.75rem; }
  .cert-card { background: var(--surface); border: 1px solid var(--border); border-radius: 10px; padding: 1.4rem 1.25rem; transition: border-color 0.15s; }
  .cert-card:hover { border-color: var(--border-strong); }
  .cert-icon { width: 34px; height: 34px; border-radius: 8px; background: var(--accent-pale); border: 1px solid #B7E4C7; display: flex; align-items: center; justify-content: center; font-size: 15px; margin-bottom: 0.9rem; }
  .cert-name { font-size: 0.8rem; font-weight: 500; color: var(--text); margin-bottom: 4px; line-height: 1.4; }
  .cert-org { font-family: 'DM Mono', monospace; font-size: 0.62rem; color: var(--accent-mid); margin-bottom: 2px; }
  .cert-date { font-family: 'DM Mono', monospace; font-size: 0.62rem; color: var(--text-3); }

  /* Achievements */
  .ach-list { display: flex; flex-direction: column; gap: 0.75rem; }
  .ach-item { display: flex; align-items: center; justify-content: space-between; background: var(--surface); border: 1px solid var(--border); border-radius: 8px; padding: 0.85rem 1.2rem; gap: 1rem; flex-wrap: wrap; }
  .ach-name { font-size: 0.85rem; color: var(--text); display: flex; align-items: center; gap: 9px; }
  .ach-star { width: 20px; height: 20px; border-radius: 4px; background: var(--amber-light); display: flex; align-items: center; justify-content: center; font-size: 11px; color: var(--amber); flex-shrink: 0; }
  .ach-meta { font-family: 'DM Mono', monospace; font-size: 0.62rem; color: var(--text-3); text-align: right; }

  /* Responsive */
  @media (max-width: 900px) {
    .page { grid-template-columns: 1fr; }
    .sidebar { position: relative; height: auto; }
    .about-grid, .skills-grid, .certs-grid { grid-template-columns: 1fr; }
    .hero { padding: 2.5rem 1.75rem; }
    .section { padding: 2.5rem 1.75rem; }
    .hero-stats { grid-template-columns: repeat(2,1fr); }
  }
`;

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
            icon: '',
            title: 'apt-tracker',
            subtitle: 'Linux Package Audit Utility',
            date: 'Mar 2026',
            tags: ['Linux Security', 'System Monitoring', 'Bash'],
            desc: 'Zero-dependency Bash auditing tool that maintains a structured CSV log of all package install, remove, and upgrade events on Debian/Ubuntu systems. Supports system integrity monitoring and post-incident investigation via queryable software change history with action/time-period filtering.',
            badge: null,
            link: 'https://github.com/zero1byte/apt-tracker',
        },
        {
            icon: '',
            title: 'Timestomping Detection in NTFS',
            subtitle: 'Security Tool Development',
            date: 'Mar 2026',
            tags: ['Python', 'C', 'FastAPI', 'React.js', 'Tailwind CSS'],
            desc: 'Security detection tool identifying timestamp manipulation on Windows NTFS volumes by cross-correlating $MFT, $UsnJrnl, and $LogFile artifacts. Features anomaly scoring, severity classification, and a full-stack React + FastAPI investigation dashboard for artifact review and data export.',
            badge: 'MITRE ATT&CK T1070.006',
            link: 'https://github.com/zero1byte/timestomping-detections-in-ntfs',
        },
        {
            icon: '',
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
        { icon: '🛡', name: 'Fortinet NSE 1 – Network Security Associate', org: 'Fortinet', date: 'Feb 2026' },
        { icon: '⚙', name: 'Fortinet NSE 3 – FortiGate 7.6 Operator', org: 'Fortinet', date: 'Mar 2026' },
        { icon: '🔬', name: 'File System Forensics Bootcamp', org: 'NFSU, Gandhinagar', date: 'Feb 2026' },
    ];

    const achievements = [
        { name: 'Cybersecurity Hackathon – Participant', org: 'NFSU, Gandhinagar', date: 'Mar 2026' },
        { name: 'Windows Forensics Analysis Bootcamp', org: 'CDAC, Thiruvananthapuram', date: 'Sep–Oct 2025' },
    ];

    return (
        <>
            <style>{css}</style>
            <div className="page">

                {/* Sidebar */}
                <aside className="sidebar">
                    <div className="sidebar-avatar">RM</div>
                    <div className="sidebar-name">Ramesh Mali</div>
                    <div className="sidebar-role">cybersecurity student</div>

                    <div className="sidebar-label">Navigation</div>
                    <ul className="sidebar-nav">
                        {nav.map(n => (
                            <li key={n.id}>
                                <a href={`#${n.id}`} className={`snav-link${active === n.id ? ' active' : ''}`}>
                                    <span className="snav-dot" />
                                    {n.label}
                                </a>
                            </li>
                        ))}
                    </ul>

                    <div className="sidebar-divider" />

                    <div className="sidebar-label">Contact</div>
                    <div className="sidebar-contact">
                        <div className="sc-item"><span className="sc-icon">@</span>ramesh.95712897@gmail.com</div>
                        <div className="sc-item"><span className="sc-icon">◎</span>Gandhinagar, India</div>
                    </div>

                    <div className="sidebar-socials">
                        {[
                            { l: 'https://img.freepik.com/premium-vector/vector-linkedin-apps-logo-rounded-asset-isolated_1004619-457.jpg?semt=ais_hybrid&w=740&q=80', url: 'https://www.linkedin.com/in/ramesh-mali-72301a28b/' },
                            { l: 'https://cdn-icons-png.flaticon.com/512/25/25231.png', url: 'https://github.com/zero1byte' },
                            { l: 'https://zerobytes.me/logo.png', url: 'https://zerobytes.me' },
                        ].map(s => (
                            <a key={s.l} href={s.url} className="ss-btn bg-transparent" target="_blank" rel="noopener noreferrer"
                            >
                                <Image key={s.l} src={s.l} alt="Social Link" width={30} height={30} className='bg-white rounded-full'></Image>
                            </a>
                        ))}
                    </div>
                </aside>

                {/* Main */}
                <main className="main">

                    {/* Hero */}
                    <div className="hero" id="hero" data-s>
                        <div className="eyebrow">
                            <span className="status-dot" />
                            Open to opportunities
                        </div>
                        <h1 className="hero-h1">
                            Security Analyst &amp;<br />
                            <em>Digital Forensics</em> Specialist
                        </h1>
                        <p className="hero-sub">
                            Foundation in network security, ethical hacking, and digital forensics.
                            Hands-on experience in vulnerability analysis, incident response, and system behavior investigation.
                        </p>
                    </div>

                    {/* About */}
                    <section className="section" id="about" data-s>
                        <div className="sec-label">
                            <span className="sec-label-text">📚 01 — About</span>
                            <div className="sec-label-line" />
                        </div>
                        <div className="about-grid">
                            <div className="card">
                                <div className="card-lbl">🎓 Education</div>
                                <div className="edu-item" style={{ paddingBottom: '1rem', borderBottom: '1px solid var(--border)', marginBottom: '1rem' }}>
                                    <div className="edu-deg">M.Sc. Digital Forensics &amp; Information Security</div>
                                    <div className="edu-school">National Forensic Sciences University (NFSU)</div>
                                    <div className="edu-meta">Gandhinagar · Aug 2025 – Present</div>
                                </div>
                                <div className="edu-item">
                                    <div className="edu-deg">B.Sc. Computer Science</div>
                                    <div className="edu-school">Central University of Rajasthan</div>
                                    <div className="edu-meta">CGPA: 6.47 · Oct 2022 – Jun 2025</div>
                                </div>
                            </div>
                            <div className="card">
                                <div className="card-lbl">🎯 Objective</div>
                                <p className="obj-text">
                                    Seeking to contribute to <mark>security operations</mark> and <mark>incident response</mark> through
                                    disciplined, methodical analysis. Strong foundation in network security, ethical hacking, and digital
                                    forensics with a focus on deepening practical expertise in threat detection and investigation workflows.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Skills */}
                    <section className="section" id="skills" data-s>
                        <div className="sec-label">
                            <span className="sec-label-text">⚡ 02 — Skills</span>
                            <div className="sec-label-line" />
                        </div>
                        <div className="skills-grid">
                            {skills.map(sk => (
                                <div key={sk.cat} className="skill-card">
                                    <div className="skill-cat" style={{ color: sk.color }}>
                                        <span className="skill-dot" style={{ background: sk.dot }} />
                                        {sk.cat}
                                    </div>
                                    <div className="tags">
                                        {sk.items.map(item => <span key={item} className="tag">{item}</span>)}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Projects */}
                    <section className="section" id="projects" data-s>
                        <div className="sec-label">
                            <span className="sec-label-text">🚀 03 — Projects</span>
                            <div className="sec-label-line" />
                        </div>
                        <div className="proj-list">
                            {projects.map(p => (
                                <div key={p.title} className="proj-card">
                                    <div className="proj-top">
                                        <div>
                                            <div className="proj-title-group">
                                                <span className="proj-icon">{p.icon}</span>
                                                <div className="proj-title">{p.title}</div>
                                            </div>
                                            <div className="proj-subtitle">{p.subtitle}</div>
                                        </div>
                                        <span className="proj-date">{p.date}</span>
                                    </div>
                                    <div className="tags" style={{ marginBottom: '1rem' }}>
                                        {p.tags.map(t => <span key={t} className="tag">{t}</span>)}
                                    </div>
                                    <p className="proj-desc">{p.desc}</p>
                                    <div className="proj-footer">
                                        {p.badge ? <span className="badge-mitre">{p.badge}</span> : <span />}
                                        <a href={p.link} className="proj-link" target="_blank" rel="noopener noreferrer">View on GitHub →</a>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Experience */}
                    <section className="section" id="experience" data-s>
                        <div className="sec-label">
                            <span className="sec-label-text">💼 04 — Experience</span>
                            <div className="sec-label-line" />
                        </div>
                        <div className="exp-card">
                            <div className="exp-top">
                                <div>
                                    <div className="exp-role">Frontend Developer</div>
                                    <span className="exp-co">Startup – Client Project (Remote)</span>
                                </div>
                                <div className="exp-period">
                                    <span className="exp-pdot" />
                                    Nov 2025 – Present
                                </div>
                            </div>
                            <ul className="exp-list">
                                {[
                                    'Developing a production-grade web application for an external client within a 4-member agile team using React.js.',
                                    'Translating client requirements into responsive UI components with iterative delivery under real-world constraints.',
                                    'Shipping features end-to-end across design, development, and testing phases in a startup environment.',
                                ].map(h => (
                                    <li key={h} className="exp-item">
                                        <span className="exp-arr">▸</span>
                                        {h}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </section>

                    {/* Certifications */}
                    <section className="section" id="certifications" data-s>
                        <div className="sec-label">
                            <span className="sec-label-text">🏆 05 — Certifications &amp; Achievements</span>
                            <div className="sec-label-line" />
                        </div>
                        <div className="certs-grid">
                            {certs.map(c => (
                                <div key={c.name} className="cert-card">
                                    <div className="cert-icon">{c.icon}</div>
                                    <div className="cert-name">{c.name}</div>
                                    <div className="cert-org">{c.org}</div>
                                    <div className="cert-date">{c.date}</div>
                                </div>
                            ))}
                        </div>

                        <div className="sec-label" style={{ marginBottom: '1rem' }}>
                            <span className="sec-label-text">⭐ Achievements</span>
                            <div className="sec-label-line" />
                        </div>
                        <div className="ach-list">
                            {achievements.map(a => (
                                <div key={a.name} className="ach-item">
                                    <div className="ach-name">
                                        <span className="ach-star">★</span>
                                        {a.name}
                                    </div>
                                    <div className="ach-meta">{a.org}<br />{a.date}</div>
                                </div>
                            ))}
                        </div>
                    </section>

                </main>
            </div>
        </>
    );
}