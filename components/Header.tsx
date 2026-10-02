'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
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
import { getAssetPath } from '@/lib/basePath';
import SearchBar from './SearchBar';

interface HeaderProps {
    onToggleSidebar?: () => void;
    isSidebarOpen?: boolean;
}

export default function Header({ onToggleSidebar, isSidebarOpen }: HeaderProps) {
    const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);

    return (
        <header className="sticky top-0 z-50 w-full bg-[#2d3748] text-white shadow-md border-b border-[#3a4352]">
            <div className="w-full px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
                {/* Left: Mobile hamburger & Logo & Title - aligned to the left */}
                <div className="flex items-center gap-3 w-64 flex-shrink-0">
                    <button
                        type="button"
                        onClick={onToggleSidebar}
                        className="lg:hidden p-2 rounded-md text-gray-300 hover:text-white hover:bg-[#3a4352] transition-colors"
                        aria-label="Toggle Navigation Sidebar"
                    >
                        {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>

                    <Link href="/" className="flex items-center gap-2.5 group">
                        <div className="w-8 h-8 relative flex-shrink-0 flex items-center justify-center bg-[#2693D8]/20 border border-[#2693D8]/40 rounded-lg p-1 group-hover:scale-105 transition-transform">
                            <Image
                                src={getAssetPath('/logo.svg')}
                                alt="brainlife logo"
                                width={24}
                                height={24}
                                style={{ width: 'auto', height: 'auto' }}
                                className="w-6 h-6 object-contain"
                                onError={(e) => {
                                    (e.target as HTMLImageElement).src = getAssetPath('/logo.png');
                                }}
                            />
                        </div>
                        <span className="font-semibold text-lg tracking-tight text-white group-hover:text-[#50bfff] transition-colors font-['Work_Sans',sans-serif]">
                            brainlife <span className="font-normal text-gray-300">Documentation</span>
                        </span>
                    </Link>
                </div>

                {/* Center: Search Bar (Desktop) */}
                <div className="flex-1 max-w-lg mx-4 hidden sm:block">
                    <SearchBar />
                </div>

                {/* Right: Search button (Mobile), GitHub badge & Portal Link */}
                <div className="flex items-center gap-2 sm:gap-3 ml-auto flex-shrink-0">
                    {/* Mobile Search Toggle */}
                    <button
                        type="button"
                        onClick={() => setIsMobileSearchOpen(true)}
                        className="sm:hidden p-2 rounded-md text-gray-300 hover:text-white hover:bg-[#3a4352] transition-colors"
                        aria-label="Search documentation"
                    >
                        <Search size={18} />
                    </button>

                    <a
                        href={GITHUB_REPO_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-[#1f2633] hover:bg-[#3a4352] text-xs text-gray-200 border border-[#4a5568] transition-all hover:border-gray-500 shadow-sm"
                        title="View repository on GitHub"
                    >
                        <GithubIcon className="w-4 h-4 text-white" />
                        <span className="hidden md:inline font-medium">brainlife/docs-next</span>
                        <div className="flex items-center gap-2 pl-1 border-l border-gray-600 text-gray-300">
                            <span className="flex items-center gap-0.5" title="Stars">
                                <Star size={12} className="text-yellow-400 fill-yellow-400" />
                                <span>19</span>
                            </span>
                            <span className="flex items-center gap-0.5" title="Forks">
                                <GitFork size={12} className="text-gray-400" />
                                <span>29</span>
                            </span>
                        </div>
                    </a>

                    <a
                        href={MAIN_SITE_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#2693D8] hover:bg-[#1d74ae] text-xs font-semibold text-white tracking-wide uppercase shadow-sm transition-all hover:shadow-[#2693D8]/30"
                    >
                        <span>Portal</span>
                        <ExternalLink size={12} />
                    </a>
                </div>
            </div>

            {/* Mobile Search Overlay Modal */}
            {isMobileSearchOpen && (
                <div className="sm:hidden fixed inset-0 z-50 bg-[#1f2633]/95 backdrop-blur-md p-4 flex flex-col">
                    <div className="flex items-center justify-between pb-3 border-b border-[#3a4352] mb-3">
                        <span className="text-sm font-semibold text-white">Search Documentation</span>
                        <button
                            type="button"
                            onClick={() => setIsMobileSearchOpen(false)}
                            className="p-1.5 rounded-md text-gray-400 hover:text-white hover:bg-[#3a4352]"
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
