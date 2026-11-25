'use client';

import React, { useState } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import TableOfContents, { TocHeading } from './TableOfContents';
import { SLACK_URL, GITHUB_REPO_URL } from '@/lib/docsNavigation';

interface DocLayoutProps {
    children: React.ReactNode;
    headings?: TocHeading[];
    githubEditUrl?: string;
}

export default function DocLayout({ children, headings = [], githubEditUrl }: DocLayoutProps) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="min-h-screen flex flex-col bg-bl-bg text-bl-ink font-sans">
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

                {/* Main Content Area */}
                <main className="flex-1 min-w-0 flex justify-between gap-8 lg:gap-10 xl:gap-12 px-6 sm:px-8 lg:px-10 xl:px-12 py-8">
                    <div className="flex-1 min-w-0 max-w-5xl xl:max-w-6xl">
                        {children}

                        {/* Page Footer */}
                        <footer className="mt-16 pt-8 border-t border-bl-line text-xs text-bl-muted space-y-2">
                            <p>
                                Copyright &copy; 2017 - {new Date().getFullYear()} brainlife.io | Please report issues on{' '}
                                <a
                                    href={`${GITHUB_REPO_URL}/issues`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-bl-accent hover:underline"
                                >
                                    GitHub Issues
                                </a>{' '}
                                or send us your comment at{' '}
                                <a
                                    href={SLACK_URL}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-bl-accent hover:underline"
                                >
                                    Slack
                                </a>.
                            </p>
                        </footer>
                    </div>

                    {/* Right In-page TOC */}
                    {headings.length > 0 && (
                        <TableOfContents headings={headings} githubEditUrl={githubEditUrl} />
                    )}
                </main>
            </div>
        </div>
    );
}
