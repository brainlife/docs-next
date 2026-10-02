'use client';

import React, { useState } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import TableOfContents, { TocHeading } from './TableOfContents';
import { SLACK_URL, GITHUB_REPO_URL } from '@/lib/docsNavigation';

interface DocLayoutProps {
    children: React.ReactNode;
    headings?: TocHeading[];
}

export default function DocLayout({ children, headings = [] }: DocLayoutProps) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="min-h-screen flex flex-col bg-white dark:bg-[#1a202c] text-gray-900 dark:text-gray-100 font-sans">
            {/* Full-width Top Header */}
            <Header
                isSidebarOpen={isSidebarOpen}
                onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
            />

            {/* Layout body with full-width container */}
            <div className="flex-1 flex w-full">
                {/* Left Sidebar */}
                <Sidebar
                    isOpen={isSidebarOpen}
                    onClose={() => setIsSidebarOpen(false)}
                />

                {/* Main Content Area with generous padding from the sidebar */}
                <main className="flex-1 min-w-0 flex justify-between px-6 sm:px-10 lg:px-14 xl:px-16 py-10">
                    <div className="flex-1 max-w-4xl min-w-0">
                        {children}

                        {/* Page Footer */}
                        <footer className="mt-16 pt-8 border-t border-gray-200 dark:border-gray-800 text-xs text-gray-500 dark:text-gray-400 space-y-2">
                            <p>
                                Copyright &copy; 2017 - {new Date().getFullYear()} brainlife.io | Please report issues on{' '}
                                <a
                                    href={`${GITHUB_REPO_URL}/issues`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-[#2693D8] hover:underline"
                                >
                                    GitHub Issues
                                </a>{' '}
                                or send us your comment at{' '}
                                <a
                                    href={SLACK_URL}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-[#2693D8] hover:underline"
                                >
                                    Slack
                                </a>.
                            </p>
                        </footer>
                    </div>

                    {/* Right In-page TOC */}
                    {headings.length > 0 && <TableOfContents headings={headings} />}
                </main>
            </div>
        </div>
    );
}
