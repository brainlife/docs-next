'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
    Search,
    Star,
    GitFork,
    Menu,
    X,
    ExternalLink,
} from 'lucide-react';

function GithubIcon({ className = "w-4 h-4" }: { className?: string }) {
    return (
        <svg
            className={className}
            fill="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
        >
            <path
                fillRule="evenodd"
                d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                clipRule="evenodd"
            />
        </svg>
    );
}

import { GITHUB_REPO_URL, MAIN_SITE_URL } from '@/lib/docsNavigation';

const BRAINLIFE_URL = 'https://brainlife.io';
import { getAssetPath } from '@/lib/basePath';
import SearchBar from './SearchBar';

interface HeaderProps {
    onToggleSidebar?: () => void;
    isSidebarOpen?: boolean;
}

export default function Header({ onToggleSidebar, isSidebarOpen }: HeaderProps) {
    const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);

    return (
        <header className="sticky top-0 z-50 w-full bg-bl-surface/90 backdrop-blur-md text-bl-ink border-b border-bl-line">
            <div className="w-full px-3 sm:px-4 lg:px-6 h-16 flex items-center justify-between gap-2 sm:gap-4">
                {/* Left: Mobile hamburger & Logo & Title */}
                <div className="flex items-center gap-2 sm:gap-2.5 min-w-0 flex-shrink-0">
                    <button
                        type="button"
                        onClick={onToggleSidebar}
                        className="lg:hidden p-1.5 sm:p-2 rounded-md text-bl-muted hover:text-bl-ink hover:bg-bl-band transition-colors"
                        aria-label="Toggle Navigation Sidebar"
                    >
                        {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>

                    {/* Brand mark and wordmark as on the landing page header; they link back to brainlife.io */}
                    <a href={BRAINLIFE_URL} className="flex items-center gap-2.5 min-w-0 text-bl-ink hover:text-bl-ink" aria-label="brainlife.io home">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={getAssetPath('/brand/brainlife-mark-lightblue-orange-app-on-light.svg')}
                            alt=""
                            className="h-7 sm:h-8 w-auto block dark:hidden"
                        />
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={getAssetPath('/brand/brainlife-mark-lightblue-orange-app-on-dark.svg')}
                            alt=""
                            className="h-7 sm:h-8 w-auto hidden dark:block"
                        />
                        <span className="text-lg sm:text-xl font-semibold tracking-[-0.02em] whitespace-nowrap">
                            brainlife<span className="font-medium text-bl-muted">.io</span>
                        </span>
                    </a>
                    <Link
                        href="/"
                        className="pl-2.5 ml-0.5 border-l border-bl-line text-sm sm:text-base font-light text-bl-muted hover:text-bl-accent transition-colors whitespace-nowrap"
                    >
                        docs
                    </Link>
                </div>

                {/* Center: Search Bar (Desktop) */}
                <div className="flex-1 min-w-0 max-w-lg mx-2 sm:mx-4 hidden sm:block">
                    <SearchBar />
                </div>

                {/* Right: GitHub badge, Portal Link & Theme toggle */}
                <div className="flex items-center gap-1.5 sm:gap-2 lg:gap-3 ml-auto flex-shrink-0">
                    {/* Mobile Search Toggle */}
                    <button
                        type="button"
                        onClick={() => setIsMobileSearchOpen(true)}
                        className="sm:hidden p-2 rounded-md text-bl-muted hover:text-bl-ink hover:bg-bl-band transition-colors"
                        aria-label="Search documentation"
                    >
                        <Search size={18} />
                    </button>

                    {/* GitHub Info Pill */}
                    <a
                        href={GITHUB_REPO_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 rounded-md bg-transparent hover:bg-bl-band text-xs font-light text-bl-muted border border-bl-line transition-colors"
                        title="View repository on GitHub"
                    >
                        <GithubIcon className="w-4 h-4 text-bl-ink" />
                        <span className="hidden md:inline font-normal text-bl-ink">GitHub</span>
                        <span className="hidden lg:inline font-mono text-[11px]">brainlife/docs-next</span>
                        <div className="hidden sm:flex items-center gap-1.5 lg:gap-2 pl-1.5 border-l border-bl-line">
                            <span className="flex items-center gap-0.5 text-[11px]" title="Stars">
                                <Star size={11} className="text-brand-yellow fill-brand-yellow" />
                                <span>19</span>
                            </span>
                            <span className="flex items-center gap-0.5 text-[11px]" title="Forks">
                                <GitFork size={11} />
                                <span>29</span>
                            </span>
                        </div>
                    </a>

                    {/* Portal Button */}
                    <a
                        href={MAIN_SITE_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-bl-accent hover:bg-bl-accent/90 text-xs font-normal text-bl-accent-ink border border-bl-accent transition-colors"
                    >
                        <span>Portal</span>
                        <ExternalLink size={12} />
                    </a>
                </div>
            </div>

            {/* Mobile Search Overlay Modal */}
            {isMobileSearchOpen && (
                <div className="sm:hidden fixed inset-0 z-50 bg-bl-surface/95 backdrop-blur-md p-4 flex flex-col">
                    <div className="flex items-center justify-between pb-3 border-b border-bl-line mb-3">
                        <span className="text-sm font-normal text-bl-ink">Search documentation</span>
                        <button
                            type="button"
                            onClick={() => setIsMobileSearchOpen(false)}
                            className="p-1.5 rounded-md text-bl-muted hover:text-bl-ink hover:bg-bl-band"
                        >
                            <X size={18} />
                        </button>
                    </div>
                    <SearchBar
                        isMobileOpen={isMobileSearchOpen}
                        onCloseMobile={() => setIsMobileSearchOpen(false)}
                    />
                </div>
            )}
        </header>
    );
}
