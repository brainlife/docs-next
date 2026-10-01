'use client';

import React, { useEffect, useState } from 'react';
import { AlignLeft } from 'lucide-react';

export interface TocHeading {
    id: string;
    text: string;
    level?: number;
}

interface TableOfContentsProps {
    headings?: TocHeading[];
}

export default function TableOfContents({ headings = [] }: TableOfContentsProps) {
    const [activeId, setActiveId] = useState<string>('');

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

    if (!headings || headings.length === 0) return null;

    return (
        <div className="hidden xl:block w-60 shrink-0 pl-6 sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto">
            <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-3">
                <AlignLeft size={14} />
                <span>On this page</span>
            </div>
            <ul className="space-y-1.5 text-xs border-l border-gray-200 dark:border-gray-800 pl-3">
                {headings.map(({ id, text, level = 2 }) => {
                    const isActive = activeId === id;
                    return (
                        <li key={id} style={{ paddingLeft: level > 2 ? '8px' : '0' }}>
                            <a
                                href={`#${id}`}
                                className={`block transition-colors py-0.5 ${
                                    isActive
                                        ? 'text-[#2693D8] font-medium'
                                        : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200'
                                }`}
                            >
                                {text}
                            </a>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}
