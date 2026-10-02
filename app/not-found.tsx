'use client';

import React from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import { motion } from 'framer-motion';
import {
    ArrowLeft,
    ArrowUpRight,
    BookOpen,
    Compass,
    Database,
    Cpu,
    Layers,
    LifeBuoy,
    Terminal,
    Search,
    ExternalLink,
} from 'lucide-react';
import { MAIN_SITE_URL, GITHUB_REPO_URL, SLACK_URL } from '@/lib/docsNavigation';

const QUICK_LINKS = [
    {
        title: 'Explore Datasets',
        desc: 'Access open-access neuroimaging datasets and BIDS-standard archives.',
        href: 'https://brainlife.io/datasets',
        isExternal: true,
        icon: Database,
        badge: 'Open Data',
    },
    {
        title: 'Compute Apps',
        desc: 'Over 200+ containerized pipelines for dMRI, sMRI, fMRI, and EEG.',
        href: 'https://connects.brainlife.io/apps?scope=public',
        isExternal: true,
        icon: Cpu,
        badge: 'Pipelines',
    },
    {
        title: 'ezBIDS Tool',
        desc: 'Automated DICOM to BIDS converter directly within your browser.',
        href: '/using_ezBIDS/',
        isExternal: false,
        icon: Layers,
        badge: 'Utility',
    },
    {
        title: 'Tutorials & Guides',
        desc: 'Step-by-step walkthroughs for preprocessing, tractography, and analysis.',
        href: '/docs/tutorial/introduction-to-brainlife/',
        isExternal: false,
        icon: BookOpen,
        badge: 'Guides',
    },
    {
        title: 'Using CLI',
        desc: 'Automate analysis, upload data, and execute apps straight from your terminal.',
        href: '/docs/cli/install/',
        isExternal: false,
        icon: Terminal,
        badge: 'CLI',
    },
    {
        title: 'Help & Community',
        desc: 'Connect with neuroscience researchers and Brainlife engineers on Slack.',
        href: SLACK_URL,
        isExternal: true,
        icon: LifeBuoy,
        badge: 'Community',
    },
];

export default function NotFound() {
    return (
        <div className="min-h-screen flex flex-col bg-[#080e1c] text-white relative overflow-hidden font-sans selection:bg-[#2693D8] selection:text-white">
            {/* Ambient Background Glows */}
            <div
                className="absolute top-[-150px] left-1/2 -translate-x-1/2 w-[900px] h-[600px] rounded-full pointer-events-none z-0"
                style={{
                    background:
                        'radial-gradient(ellipse at center, rgba(38, 147, 216, 0.18) 0%, rgba(92, 197, 216, 0.06) 40%, transparent 70%)',
                }}
            />
            <div
                className="absolute bottom-[10%] -right-[100px] w-[600px] h-[600px] rounded-full pointer-events-none z-0"
                style={{
                    background:
                        'radial-gradient(circle, rgba(139, 92, 246, 0.1) 0%, transparent 70%)',
                }}
            />

            {/* Top Navigation Header */}
            <Header />

            {/* Main Stage */}
            <main className="flex-1 flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 py-16 sm:py-20 relative z-10">
                <div className="w-full max-w-5xl mx-auto text-center">
                    {/* Big 404 Number with gradient and subtle glow */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.92 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="mb-4"
                    >
                        <h1
                            className="text-[90px] sm:text-[130px] md:text-[170px] font-black leading-none tracking-tight font-['Work_Sans',sans-serif] bg-gradient-to-b from-white via-[#5cc5d8] to-[#2693D8] bg-clip-text text-transparent drop-shadow-[0_0_80px_rgba(38,147,216,0.35)] select-none"
                        >
                            404
                        </h1>
                    </motion.div>

                    {/* Headline and Description */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="max-w-2xl mx-auto mb-10"
                    >
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight mb-4 font-['Work_Sans',sans-serif] text-white">
                            Lost in the Connectome
                        </h2>
                        <p className="text-sm sm:text-base md:text-lg leading-relaxed text-gray-300/80">
                            The brain coordinate, dataset, or documentation page you requested
                            could not be resolved in the Brainlife network. It may have moved,
                            expired, or been re-indexed.
                        </p>
                    </motion.div>

                    {/* Primary Action Buttons */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        className="mb-16 sm:mb-20"
                    >
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link
                                href="/"
                                className="inline-flex items-center gap-2 px-7 py-3 h-12 rounded-lg bg-[#2693D8] hover:bg-[#1c7bb9] text-white text-sm font-bold tracking-wide uppercase shadow-lg shadow-[#2693D8]/30 hover:shadow-[#2693D8]/50 hover:-translate-y-0.5 active:scale-[0.98] transition-all font-['Work_Sans',sans-serif]"
                            >
                                <ArrowLeft size={16} />
                                <span>Return to Home</span>
                            </Link>

                            <a
                                href={MAIN_SITE_URL}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 px-6 py-3 h-12 rounded-lg bg-white/5 hover:bg-white/10 text-white text-sm font-bold tracking-wide uppercase border border-white/20 hover:border-white/40 hover:-translate-y-0.5 active:scale-[0.98] transition-all font-['Work_Sans',sans-serif]"
                            >
                                <span>Launch Portal</span>
                                <ArrowUpRight size={16} />
                            </a>

                            <Link
                                href="/docs/tutorial/introduction-to-brainlife/"
                                className="inline-flex items-center gap-2 px-6 py-3 h-12 rounded-lg bg-white/5 hover:bg-white/10 text-white text-sm font-bold tracking-wide uppercase border border-white/20 hover:border-white/40 hover:-translate-y-0.5 active:scale-[0.98] transition-all font-['Work_Sans',sans-serif]"
                            >
                                <BookOpen size={16} />
                                <span>Tutorials</span>
                            </Link>
                        </div>
                    </motion.div>

                    {/* Quick Hub Directory */}
                    <motion.div
                        initial={{ opacity: 0, y: 25 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.4 }}
                        className="max-w-4xl mx-auto text-left"
                    >
                        <div className="flex items-center gap-2.5 mb-5 px-1">
                            <Compass size={18} className="text-[#5cc5d8]" />
                            <span className="text-xs font-extrabold uppercase tracking-wider text-gray-400 font-['Work_Sans',sans-serif]">
                                Suggested Destinations
                            </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {QUICK_LINKS.map((link) => {
                                const IconComponent = link.icon;
                                const isExt = link.isExternal;
                                const Component = isExt ? 'a' : Link;
                                const extraProps = isExt
                                    ? { target: '_blank', rel: 'noopener noreferrer' }
                                    : {};

                                return (
                                    <Component
                                        key={link.title}
                                        href={link.href}
                                        {...extraProps}
                                        className="group p-5 rounded-xl bg-slate-900/60 hover:bg-[#15203a]/85 border border-white/10 hover:border-[#5cc5d8]/40 backdrop-blur-md shadow-lg transition-all duration-200 hover:-translate-y-1 hover:shadow-2xl hover:shadow-black/40 flex flex-col justify-between"
                                    >
                                        <div>
                                            <div className="flex items-center justify-between mb-3">
                                                <div className="w-9 h-9 rounded-lg bg-[#2693D8]/15 group-hover:bg-[#2693D8]/25 text-[#5cc5d8] flex items-center justify-center transition-transform group-hover:scale-110">
                                                    <IconComponent size={18} />
                                                </div>
                                                <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-white/5 text-gray-300 border border-white/5">
                                                    {link.badge}
                                                </span>
                                            </div>

                                            <h3 className="text-base font-bold text-white group-hover:text-[#5cc5d8] transition-colors font-['Work_Sans',sans-serif] mb-1.5 flex items-center justify-between">
                                                <span>{link.title}</span>
                                                {isExt && (
                                                    <ArrowUpRight
                                                        size={14}
                                                        className="opacity-40 group-hover:opacity-100 transition-opacity"
                                                    />
                                                )}
                                            </h3>

                                            <p className="text-xs text-gray-400 leading-relaxed">
                                                {link.desc}
                                            </p>
                                        </div>
                                    </Component>
                                );
                            })}
                        </div>
                    </motion.div>
                </div>
            </main>

            {/* Bottom Footer */}
            <footer className="border-t border-[#1f293d] bg-[#060a14] py-8 px-4 sm:px-6 lg:px-8 text-xs text-gray-400">
                <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p>
                        Copyright &copy; 2017 &ndash; {new Date().getFullYear()} brainlife.io &middot; Supported by NSF & NIH
                    </p>
                    <div className="flex items-center gap-4 text-gray-400">
                        <a
                            href={GITHUB_REPO_URL}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-white transition-colors"
                        >
                            GitHub
                        </a>
                        <span>&middot;</span>
                        <a
                            href={SLACK_URL}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-white transition-colors"
                        >
                            Slack
                        </a>
                        <span>&middot;</span>
                        <a
                            href={MAIN_SITE_URL}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-white transition-colors"
                        >
                            brainlife.io
                        </a>
                    </div>
                </div>
            </footer>
        </div>
    );
}
