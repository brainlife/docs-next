'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
    AlignLeft,
    CheckSquare,
    BookOpen,
    Code2,
    Cpu,
    ThumbsUp,
    ThumbsDown,
    Clock,
    ExternalLink,
} from 'lucide-react';
import { GITHUB_REPO_URL } from '@/lib/docsNavigation';

export interface TocHeading {
    id: string;
    text: string;
    level?: number;
}

interface TableOfContentsProps {
    headings?: TocHeading[];
    githubEditUrl?: string;
}

function GithubIcon({ className = "w-3.5 h-3.5" }: { className?: string }) {
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

export default function TableOfContents({ headings = [], githubEditUrl }: TableOfContentsProps) {
    const [activeId, setActiveId] = useState<string>(headings[0]?.id || '');
    const [feedback, setFeedback] = useState<'yes' | 'no' | null>(null);

    useEffect(() => {
        if (!headings || headings.length === 0) return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActiveId(entry.target.id);
                    }
                });
            },
            {
                rootMargin: '0px 0px -70% 0px',
            }
        );

        headings.forEach(({ id }) => {
            const el = document.getElementById(id);
            if (el) observer.observe(el);
        });

        return () => observer.disconnect();
    }, [headings]);

    return (
        <div className="hidden xl:block w-64 shrink-0 pl-6 sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto custom-scrollbar space-y-6">
            {/* On this page section */}
            {headings.length > 0 && (
                <div>
                    <div className="flex items-center gap-1.5 font-mono text-[11px] font-normal uppercase tracking-[0.14em] text-bl-muted mb-3">
                        <AlignLeft size={14} />
                        <span>On this page</span>
                    </div>
                    <ul className="space-y-1.5 text-xs border-l border-bl-line pl-3">
                        {headings.map(({ id, text, level = 2 }) => {
                            const isActive = activeId === id;
                            return (
                                <li key={id} style={{ paddingLeft: level > 2 ? '8px' : '0' }}>
                                    <a
                                        href={`#${id}`}
                                        className={`block transition-all py-0.5 ${
                                            isActive
                                                ? 'text-bl-accent font-normal border-l-2 border-bl-accent -ml-[13px] pl-[11px]'
                                                : 'text-bl-muted hover:text-bl-ink'
                                        }`}
                                    >
                                        {text}
                                    </a>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            )}

            {/* Related section */}
            <div>
                <div className="font-mono text-[11px] font-normal uppercase tracking-[0.14em] text-bl-muted mb-2.5">
                    Related
                </div>
                <ul className="space-y-2 text-xs">
                    <li>
                        <Link
                            href="/docs/user/started"
                            className="flex items-center gap-2 text-bl-muted hover:text-bl-ink transition-colors"
                        >
                            <CheckSquare size={14} className="text-bl-accent" />
                            <span>Getting Started</span>
                        </Link>
                    </li>
                    <li>
                        <Link
                            href="/docs/user/started"
                            className="flex items-center gap-2 text-bl-muted hover:text-bl-ink transition-colors"
                        >
                            <BookOpen size={14} className="text-bl-accent" />
                            <span>Using brainlife</span>
                        </Link>
                    </li>
                    <li>
                        <Link
                            href="/docs/apps/introduction"
                            className="flex items-center gap-2 text-bl-muted hover:text-bl-ink transition-colors"
                        >
                            <Code2 size={14} className="text-bl-accent" />
                            <span>Developing Apps</span>
                        </Link>
                    </li>
                    <li>
                        <Link
                            href="/docs/resources/register"
                            className="flex items-center gap-2 text-bl-muted hover:text-bl-ink transition-colors"
                        >
                            <Cpu size={14} className="text-bl-accent" />
                            <span>Compute Resources</span>
                        </Link>
                    </li>
                </ul>
            </div>

            {/* Feedback widget */}
            <div className="bg-bl-surface border border-bl-line rounded-xl p-3.5 space-y-2.5">
                <div className="text-xs font-medium text-bl-ink">
                    Was this page helpful?
                </div>
                {feedback ? (
                    <div className="text-xs text-bl-accent font-medium">
                        Thank you for your feedback!
                    </div>
                ) : (
                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={() => setFeedback('yes')}
                            className="p-1.5 rounded-lg border border-bl-line hover:bg-bl-band text-bl-muted transition-colors"
                            aria-label="Yes, this page was helpful"
                            title="Helpful"
                        >
                            <ThumbsUp size={14} />
                        </button>
                        <button
                            type="button"
                            onClick={() => setFeedback('no')}
                            className="p-1.5 rounded-lg border border-bl-line hover:bg-bl-band text-bl-muted transition-colors"
                            aria-label="No, this page was not helpful"
                            title="Not helpful"
                        >
                            <ThumbsDown size={14} />
                        </button>
                    </div>
                )}
            </div>

            {/* Page metadata footer */}
            <div className="pt-1 text-xs space-y-2 text-bl-muted">
                <div className="flex items-center gap-1.5">
                    <Clock size={12} className="text-bl-muted" />
                    <span>Last updated 2 weeks ago</span>
                </div>
                <div>
                    <a
                        href={githubEditUrl || GITHUB_REPO_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-bl-muted hover:text-bl-accent transition-colors"
                    >
                        <GithubIcon className="w-3.5 h-3.5" />
                        <span>View on GitHub</span>
                        <ExternalLink size={11} />
                    </a>
                </div>
            </div>
        </div>
    );
}
