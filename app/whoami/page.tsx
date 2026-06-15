'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import type { ReactNode } from 'react';

// ─── Data ──────────────────────────────────────────────────────────────────

const NAV = [
  { id: 'about',          label: 'About'           },
  { id: 'skills',         label: 'Skills'          },
  { id: 'projects',       label: 'Projects'        },
  { id: 'experience',     label: 'Experience'      },
  { id: 'certifications', label: 'Certifications'  },
];

const HERO_STATS = [
  { value: '6',         label: 'Projects Built'  },
  { value: '5',         label: 'Certifications'  },
  { value: 'AWS · Azure', label: 'Cloud Platforms' },
  { value: '4',         label: 'CTF Platforms'   },
];

const SKILLS = [
  {
    cat: 'Security Operations',
    color: '#B91C1C', dot: '#FCA5A5',
    items: ['SIEM (Wazuh)', 'IDS/IPS (Snort)', 'Log Correlation', 'Threat Detection', 'Alert Triage', 'Incident Response'],
  },
  {
    cat: 'Digital Forensics',
    color: '#92400E', dot: '#FCD34D',
    items: ['Autopsy', 'FTK', 'Volatility', '$MFT / $UsnJrnl / $LogFile', 'Timestomping Detection', 'Memory Forensics'],
  },
  {
    cat: 'Network & Protocols',
    color: '#1D4ED8', dot: '#93C5FD',
    items: ['TCP/IP', 'DNS', 'HTTP/S', 'VPN', 'TLS/SSL', '802.11 Wi-Fi', 'EAPoL / WPA2'],
  },
  {
    cat: 'Penetration Testing & OSINT',
    color: '#065F46', dot: '#6EE7B7',
    items: ['Nmap', 'Burp Suite', 'Metasploit', 'Wireshark', 'Nessus', 'Shodan', 'Google Dorking'],
  },
  {
    cat: 'Development',
    color: '#4338CA', dot: '#C4B5FD',
    items: ['Python', 'FastAPI', 'React.js', 'Node.js', 'Next.js', 'C / C++', 'Bash / PowerShell'],
  },
  {
    cat: 'Cloud & Infrastructure',
    color: '#1E40AF', dot: '#BFDBFE',
    items: ['AWS EC2', 'Azure VM', 'Docker', 'SSH Hardening', 'Linux (Kali, Ubuntu)', 'Windows Server'],
  },
  {
    cat: 'Frameworks & Standards',
    color: '#065F46', dot: '#A7F3D0',
    items: ['MITRE ATT&CK', 'NIST CSF', 'OWASP Top 10', 'ISO/IEC 27001', 'CIS Controls', 'RBI Cyber Framework'],
  },
  {
    cat: 'Databases',
    color: '#6B21A8', dot: '#D8B4FE',
    items: ['PostgreSQL', 'MongoDB', 'Supabase', 'SQL', 'Schema Design', 'Query Optimisation'],
  },
];

const PROJECTS = [
  {
    title: 'Security Monitoring Lab — SIEM & NIDS',
    category: 'Security Infrastructure',
    date: 'Mar – May 2026',
    tags: ['Wazuh', 'Snort', 'AWS EC2', 'Azure VM', 'Docker', 'Kali Linux', 'Metasploitable'],
    desc: 'Deployed Wazuh SIEM on AWS EC2 via a Docker agent stack, onboarding an Azure VM as a cross-cloud monitored endpoint. Authored custom Snort detection rules for ICMP flood, SYN scan, and Nmap recon with threshold filters to reduce false positives. Full analyst workflow: alert triage → log correlation → root-cause analysis → remediation documentation.',
    badge: 'SIEM · NIDS',
    links: [
      { label: 'SIEM Docs', url: 'https://zerobytes.me/blogs/21aec2ef-1080-4ef1-8821-01a85f92ff8f' },
      { label: 'NIDS Docs', url: 'https://zerobytes.me/blogs/a218e759-19ef-4cf0-9260-d06aecdd5774' },
    ],
  },
  {
    title: 'Timestomping Detection in NTFS',
    category: 'Digital Forensics Tool',
    date: 'Mar 2026',
    tags: ['Python', 'C', 'FastAPI', 'React.js', 'Vite', 'Windows NTFS'],
    desc: 'End-to-end forensics tool detecting timestamp manipulation on NTFS volumes by cross-correlating $MFT, $UsnJrnl, and $LogFile artifacts. Implements anomaly scoring and severity classification, exposed through a full-stack React + FastAPI dashboard for investigator workflow and forensic data export.',
    badge: 'MITRE ATT&CK T1070.006',
    links: [
      { label: 'GitHub', url: 'https://github.com/zero1byte/timestomping-detections-in-ntfs' },
    ],
  },
  {
    title: 'Tamper-Evident Logging System',
    category: 'Cryptographic Security',
    date: 'Apr – May 2026',
    tags: ['Python', 'SHA-256', 'Hash Chain', 'NTP', 'CLI'],
    desc: 'Cryptographic audit-log backend detecting unauthorized log modifications via SHA-256 hash chains — each entry is linked to the previous, making tampering mathematically detectable. Supports multi-category logs (auth / sys / app), NTP-synchronized timestamps, and automatic rotation. Applicable to SOC 2, PCI-DSS, and HIPAA compliance.',
    badge: 'FIM · Compliance',
    links: [
      { label: 'GitHub', url: 'https://github.com/zero1byte/Tamper-Evident-Logging-System' },
    ],
  },
  {
    title: 'FrameHunter32',
    category: 'Wireless Security · Embedded Systems',
    date: 'May 2026',
    tags: ['ESP32', 'C', 'ESP-IDF', '802.11', 'EAPoL', 'WPA2'],
    desc: 'Bare-metal ESP32 firmware for passive 802.11 promiscuous capture and WPA2 4-way EAPoL handshake dissection across all 13 channels. Features an interactive UART shell, AP scanner, deauthentication injection, and text2pcap output for Wireshark and aircrack-ng — purpose-built for wireless threat-hunting and rogue-AP detection.',
    badge: '802.1X · IoT Security',
    links: [
      { label: 'GitHub', url: 'https://github.com/zero1byte/framehunter32' },
    ],
  },
  {
    title: 'Lost & Found — Campus Platform',
    category: 'Full Stack Web Application',
    date: '2024',
    tags: ['Node.js', 'Express.js', 'React', 'MongoDB', 'Astro', 'Tailwind CSS', 'Vercel'],
    desc: 'Full-stack platform for CURAJ students and faculty to report, browse, and reclaim lost items on campus. Node.js / Express REST API backend with MongoDB, a React frontend, and production deployment on Vercel.',
    badge: null,
    links: [
      { label: 'GitHub', url: 'https://github.com/zero1byte/Lost_Found_CURAJ' },
      { label: 'Live Demo', url: 'https://curajlf.vercel.app/' },
    ],
  },
  {
    title: 'zerobytes.me — Blog & Portfolio',
    category: 'Full Stack · Production',
    date: 'Nov 2025 – Present',
    tags: ['Next.js', 'TypeScript', 'Supabase', 'PostgreSQL', 'Tailwind CSS', 'Vercel'],
    desc: 'Production full-stack blog and portfolio platform with markdown rendering, code syntax highlighting, SEO optimisation, and Supabase (PostgreSQL) backend for content management and auth. Hosts technical writeups on SIEM deployment, digital forensics, and security tool development.',
    badge: null,
    links: [
      { label: 'Live', url: 'https://zerobytes.me' },
      { label: 'GitHub', url: 'https://github.com/zero1byte/redleaf' },
    ],
  },
];

const EXPERIENCE = [
  {
    role: 'Frontend Developer',
    company: 'Enarv',
    companyUrl: 'https://enarv.com',
    type: 'Remote Client Project',
    period: 'Nov 2025 – Apr 2026',
    bullets: [
      'Delivered a production-grade React.js web application for an external client as part of a 4-member agile team, working fully remote.',
      'Translated client requirements into responsive UI components with iterative delivery — handling design, development, and testing phases end-to-end.',
      'Improved page-load performance through code-splitting and component-level optimisation under real-world startup delivery pressure.',
    ],
  },
];

const CERTS = [
  {
    name: 'ISO/IEC 27001 Information Security Associate',
    org: 'SkillFront',
    date: '2025',
    link: 'https://www.skillfront.com/Badges/89218154826624',
  },
  {
    name: 'Fortinet NSE 3 — Network Security Associate',
    org: 'Fortinet · FortiGate 7.6 Operator',
    date: 'Mar 2026',
    link: null,
  },
  {
    name: 'Fortinet NSE 1 — Network Security Associate',
    org: 'Fortinet',
    date: 'Feb 2026',
    link: null,
  },
  {
    name: 'Intro to OT/ICS Penetration Testing',
    org: 'Mike Holcomb',
    date: 'Jun 2026',
    link: null,
  },
  {
    name: 'Windows Forensics Analysis Bootcamp',
    org: 'C-DAC Thiruvananthapuram',
    date: 'Feb 2026',
    link: null,
  },
];

const ACHIEVEMENTS = [
  { name: 'Cybersecurity Hackathon — Participant', org: 'NFSU, Gandhinagar', date: 'Mar 2026' },
  { name: 'Active CTF Practitioner', org: 'TryHackMe · Pwn.college · OverTheWire · ctftime.org', date: 'Ongoing' },
];

const SOCIAL_LINKS = [
  {
    label: 'LinkedIn',
    url: 'https://www.linkedin.com/in/ramesh-mali-72301a28b/',
    img: 'https://img.freepik.com/premium-vector/vector-linkedin-apps-logo-rounded-asset-isolated_1004619-457.jpg?semt=ais_hybrid&w=740&q=80',
  },
  {
    label: 'GitHub',
    url: 'https://github.com/zero1byte',
    img: 'https://cdn-icons-png.flaticon.com/512/25/25231.png',
  },
  {
    label: 'Blog',
    url: 'https://zerobytes.me',
    img: 'https://zerobytes.me/logo.png',
  },
];

// ─── Sub-components ─────────────────────────────────────────────────────────

function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-center gap-3 mb-6">
      <span className="font-mono text-xs text-portfolio-accent-mid tracking-widest uppercase whitespace-nowrap">
        {children}
      </span>
      <div className="h-px bg-portfolio-border flex-1" />
    </div>
  );
}

// ─── Page ───────────────────────────────────────────────────────────────────

export default function Portfolio() {
  const [active, setActive] = useState('hero');

  useEffect(() => {
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: '-40% 0px -55% 0px' },
    );
    document.querySelectorAll('[data-s]').forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] min-h-screen bg-portfolio-bg font-sans">

      {/* ── Sidebar ─────────────────────────────────────────────────────── */}
      <aside className="lg:sticky lg:top-0 lg:h-screen bg-portfolio-accent flex flex-col px-7 py-10 overflow-y-auto">

        {/* Identity */}
        <div className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center font-bold text-white text-base border border-white/15 mb-4 flex-shrink-0 select-none">
          RM
        </div>
        <div className="text-white text-sm font-semibold mb-0.5">Ramesh Mali</div>
        <div className="font-mono text-xs text-white/45 mb-0.5">M.Sc. — DFIS</div>
        <div className="font-mono text-[10px] text-white/25 mb-8">NFSU, Gandhinagar</div>

        {/* Navigation */}
        <div className="font-mono text-[10px] text-white/25 tracking-widest uppercase mb-2">Navigation</div>
        <ul className="flex flex-col gap-0.5 mb-6">
          {NAV.map(n => (
            <li key={n.id}>
              <a
                href={`#${n.id}`}
                className={`flex items-center gap-2.5 px-2.5 py-1.5 rounded-md text-sm transition-all ${
                  active === n.id
                    ? 'bg-white/10 text-white font-medium'
                    : 'text-white/50 hover:bg-white/6 hover:text-white/80'
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full transition-colors flex-shrink-0 ${
                    active === n.id ? 'bg-emerald-400' : 'bg-white/20'
                  }`}
                />
                {n.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="h-px bg-white/8 mb-5" />

        {/* Contact */}
        <div className="font-mono text-[10px] text-white/25 tracking-widest uppercase mb-2">Contact</div>
        <div className="flex flex-col gap-1.5 mb-5">
          <a
            href="mailto:ramesh.95712897@gmail.com"
            className="text-xs text-white/40 hover:text-white/70 transition-colors break-all"
          >
            ramesh.95712897@gmail.com
          </a>
          <div className="text-xs text-white/30">Gandhinagar, India</div>
        </div>

        {/* CTF Platforms */}
        <div className="font-mono text-[10px] text-white/25 tracking-widest uppercase mb-2">CTF Practice</div>
        <div className="flex flex-wrap gap-1 mb-5">
          {['TryHackMe', 'Pwn.college', 'OverTheWire', 'ctftime.org'].map(p => (
            <span
              key={p}
              className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-white/6 border border-white/8 text-white/35"
            >
              {p}
            </span>
          ))}
        </div>

        {/* Social links */}
        <div className="font-mono text-[10px] text-white/25 tracking-widest uppercase mb-2">Links</div>
        <div className="flex gap-2">
          {SOCIAL_LINKS.map(s => (
            <a
              key={s.url}
              href={s.url}
              target="_blank"
              rel="noopener noreferrer"
              title={s.label}
              className="relative inline-flex items-center justify-center w-8 h-8 rounded-md bg-white/6 border border-white/10 hover:bg-white/12 transition-all overflow-hidden"
            >
              <Image src={s.img} alt={s.label} fill className="rounded-md object-cover bg-white" />
            </a>
          ))}
        </div>
      </aside>

      {/* ── Main ────────────────────────────────────────────────────────── */}
      <main className="bg-portfolio-bg">

        {/* Hero ─────────────────────────────────────────────────────────── */}
        <section id="hero" data-s className="bg-portfolio-surface border-b border-portfolio-border px-10 py-14">
          <div className="inline-flex items-center gap-1.5 font-mono text-xs text-portfolio-accent-mid bg-portfolio-accent-pale border border-emerald-300 px-2.5 py-1 rounded-full mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-portfolio-accent-mid animate-pulse" />
            Open to opportunities
          </div>

          <h1 className="text-4xl lg:text-5xl font-semibold leading-tight tracking-tight text-portfolio-text mb-4">
            Security Analyst &amp;<br />
            <span className="text-portfolio-accent">Forensics</span> Developer
          </h1>

          <p className="text-sm text-portfolio-text-2 max-w-xl leading-relaxed mb-8">
            M.Sc. student at NFSU with hands-on experience building security tooling, deploying SIEM
            infrastructure, conducting digital forensics, and shipping full-stack web applications.
          </p>

          {/* At-a-glance stats */}
          <div className="flex flex-wrap gap-3">
            {HERO_STATS.map(stat => (
              <div
                key={stat.label}
                className="bg-portfolio-bg border border-portfolio-border rounded-lg px-4 py-2.5"
              >
                <div className="font-mono text-sm font-semibold text-portfolio-text">{stat.value}</div>
                <div className="text-xs text-portfolio-text-3 mt-0.5">{stat.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* About ────────────────────────────────────────────────────────── */}
        <section id="about" data-s className="px-10 py-12 border-b border-portfolio-border">
          <SectionLabel>About</SectionLabel>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {/* Education — 2 cols */}
            <div className="lg:col-span-2 bg-portfolio-surface border border-portfolio-border rounded-xl p-6">
              <div className="font-mono text-xs text-portfolio-text-3 tracking-widest uppercase mb-4">Education</div>
              <div className="flex flex-col">
                <div className="pb-4 border-b border-portfolio-border">
                  <div className="text-sm font-semibold text-portfolio-text mb-0.5">
                    M.Sc. Digital Forensics &amp; Information Security
                  </div>
                  <div className="text-sm text-portfolio-accent-mid mb-1">
                    National Forensic Sciences University (NFSU)
                  </div>
                  <div className="font-mono text-xs text-portfolio-text-3">Gandhinagar · Aug 2025 – Present</div>
                </div>
                <div className="py-4 border-b border-portfolio-border">
                  <div className="text-sm font-semibold text-portfolio-text mb-0.5">B.Sc. Computer Science</div>
                  <div className="text-sm text-portfolio-accent-mid mb-1">Central University of Rajasthan</div>
                  <div className="font-mono text-xs text-portfolio-text-3">CGPA: 6.47 · Oct 2022 – Jun 2025</div>
                </div>
                <div className="pt-4">
                  <div className="text-sm font-semibold text-portfolio-text mb-0.5">12th Grade — Science (Math)</div>
                  <div className="text-sm text-portfolio-accent-mid mb-1">Board of Secondary Education, Rajasthan</div>
                  <div className="font-mono text-xs text-portfolio-text-3">88.20% · Jul 2020 – Feb 2022</div>
                </div>
              </div>
            </div>

            {/* Side cards */}
            <div className="flex flex-col gap-4">
              <div className="bg-portfolio-surface border border-portfolio-border rounded-xl p-5">
                <div className="font-mono text-xs text-portfolio-text-3 tracking-widest uppercase mb-3">Focus Areas</div>
                <ul className="flex flex-col gap-2">
                  {[
                    'SIEM Deployment & Monitoring',
                    'Digital Forensics & Investigation',
                    'Security Tool Development',
                    'Full Stack Web Development',
                    'Penetration Testing',
                  ].map(a => (
                    <li key={a} className="flex items-start gap-2 text-xs text-portfolio-text-2">
                      <span className="text-portfolio-accent-mid mt-0.5 flex-shrink-0">▸</span>
                      {a}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-portfolio-surface border border-portfolio-border rounded-xl p-5">
                <div className="font-mono text-xs text-portfolio-text-3 tracking-widest uppercase mb-3">Languages</div>
                <div className="flex flex-col gap-2">
                  {[
                    { lang: 'English', level: 'Professional' },
                    { lang: 'Hindi',   level: 'Native'       },
                  ].map(l => (
                    <div key={l.lang} className="flex items-center justify-between">
                      <span className="text-sm text-portfolio-text">{l.lang}</span>
                      <span className="font-mono text-xs text-portfolio-text-3">{l.level}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Skills ───────────────────────────────────────────────────────── */}
        <section id="skills" data-s className="px-10 py-12 border-b border-portfolio-border">
          <SectionLabel>Skills</SectionLabel>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {SKILLS.map(sk => (
              <div key={sk.cat} className="bg-portfolio-surface border border-portfolio-border rounded-xl p-5">
                <div
                  className="font-mono text-xs tracking-widest uppercase mb-3 flex items-center gap-2"
                  style={{ color: sk.color }}
                >
                  <span className="w-1.5 h-1.5 rounded flex-shrink-0" style={{ background: sk.dot }} />
                  {sk.cat}
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {sk.items.map(item => (
                    <span
                      key={item}
                      className="font-mono text-xs px-2 py-1 rounded bg-portfolio-surface-2 text-portfolio-text-2 border border-portfolio-border hover:bg-portfolio-accent-pale hover:border-emerald-300 hover:text-portfolio-accent-mid transition-all cursor-default"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Projects ─────────────────────────────────────────────────────── */}
        <section id="projects" data-s className="px-10 py-12 border-b border-portfolio-border">
          <SectionLabel>Projects</SectionLabel>
          <div className="flex flex-col gap-4">
            {PROJECTS.map(p => (
              <div
                key={p.title}
                className="bg-portfolio-surface border border-portfolio-border rounded-xl p-6 hover:border-portfolio-border-strong transition-all"
              >
                {/* Card header */}
                <div className="flex justify-between items-start gap-4 flex-wrap mb-2">
                  <div className="min-w-0">
                    <div className="text-sm font-semibold text-portfolio-text mb-0.5 leading-snug">
                      {p.title}
                    </div>
                    <div className="font-mono text-xs text-portfolio-accent-mid">{p.category}</div>
                  </div>
                  <span className="font-mono text-xs text-portfolio-text-3 bg-portfolio-surface-2 border border-portfolio-border px-2 py-1 rounded whitespace-nowrap flex-shrink-0">
                    {p.date}
                  </span>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {p.tags.map(t => (
                    <span
                      key={t}
                      className="font-mono text-xs px-2 py-0.5 rounded bg-portfolio-surface-2 text-portfolio-text-2 border border-portfolio-border"
                    >
                      {t}
                    </span>
                  ))}
                </div>

                {/* Description */}
                <p className="text-sm text-portfolio-text-2 leading-relaxed mb-4">{p.desc}</p>

                {/* Footer */}
                <div className="flex items-center justify-between flex-wrap gap-3">
                  {p.badge
                    ? <span className="font-mono text-xs text-portfolio-amber bg-portfolio-amber-light border border-yellow-300 px-2 py-1 rounded">{p.badge}</span>
                    : <span />
                  }
                  <div className="flex gap-4">
                    {p.links.map(link => (
                      <a
                        key={link.label}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-mono text-xs text-portfolio-accent-mid hover:text-portfolio-accent transition-colors"
                      >
                        {link.label} →
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Experience ───────────────────────────────────────────────────── */}
        <section id="experience" data-s className="px-10 py-12 border-b border-portfolio-border">
          <SectionLabel>Experience</SectionLabel>
          <div className="flex flex-col gap-5">
            {EXPERIENCE.map(job => (
              <div key={job.role} className="bg-portfolio-surface border border-portfolio-border rounded-xl p-8">
                <div className="flex justify-between items-start mb-5 gap-4 flex-wrap">
                  <div>
                    <div className="text-base font-semibold text-portfolio-text mb-2">{job.role}</div>
                    <a
                      href={job.companyUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 font-mono text-xs text-portfolio-blue bg-portfolio-blue-pale border border-portfolio-blue-light px-2.5 py-1 rounded hover:opacity-80 transition-opacity"
                    >
                      {job.company} — {job.type} ↗
                    </a>
                  </div>
                  <div className="font-mono text-xs text-portfolio-text-3 bg-portfolio-surface-2 border border-portfolio-border px-3 py-1.5 rounded whitespace-nowrap">
                    {job.period}
                  </div>
                </div>
                <ul className="flex flex-col gap-2.5">
                  {job.bullets.map(b => (
                    <li key={b} className="flex gap-2.5 items-start text-sm text-portfolio-text-2 leading-relaxed">
                      <span className="text-portfolio-accent-mid text-xs mt-1 flex-shrink-0">▸</span>
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Certifications ───────────────────────────────────────────────── */}
        <section id="certifications" data-s className="px-10 py-12">
          <SectionLabel>Certifications &amp; Achievements</SectionLabel>

          {/* Cert cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 mb-8">
            {CERTS.map(c => (
              <div
                key={c.name}
                className="bg-portfolio-surface border border-portfolio-border rounded-xl p-5 hover:border-portfolio-border-strong transition-all flex flex-col"
              >
                <div className="w-8 h-8 rounded-lg bg-portfolio-accent-pale border border-emerald-300 flex items-center justify-center text-xs text-portfolio-accent-mid font-bold mb-3 flex-shrink-0">
                  ✓
                </div>
                <div className="text-sm font-medium text-portfolio-text mb-1 leading-snug flex-1">
                  {c.name}
                </div>
                <div className="font-mono text-xs text-portfolio-accent-mid mb-2">{c.org}</div>
                <div className="flex items-center justify-between">
                  <div className="font-mono text-xs text-portfolio-text-3">{c.date}</div>
                  {c.link && (
                    <a
                      href={c.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-mono text-xs text-portfolio-accent-mid hover:text-portfolio-accent transition-colors"
                    >
                      Verify ↗
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Achievements */}
          <div className="font-mono text-xs text-portfolio-text-3 tracking-widest uppercase mb-4">
            Achievements &amp; Training
          </div>
          <div className="flex flex-col gap-3">
            {ACHIEVEMENTS.map(a => (
              <div
                key={a.name}
                className="bg-portfolio-surface border border-portfolio-border rounded-lg px-5 py-3.5 flex items-center justify-between gap-4 flex-wrap"
              >
                <div className="flex items-center gap-2.5">
                  <span className="w-5 h-5 rounded text-xs font-bold bg-portfolio-amber-light text-portfolio-amber flex items-center justify-center flex-shrink-0">
                    ★
                  </span>
                  <span className="text-sm text-portfolio-text">{a.name}</span>
                </div>
                <div className="font-mono text-xs text-portfolio-text-3 text-right">
                  <div>{a.org}</div>
                  <div>{a.date}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

      </main>
    </div>
  );
}
