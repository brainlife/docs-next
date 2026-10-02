'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { ChevronRight, ChevronDown } from 'lucide-react';
import { DOCS_NAV, NavItem } from '@/lib/docsNavigation';
import { getAssetPath } from '@/lib/basePath';

interface SidebarProps {
    isOpen?: boolean;
    onClose?: () => void;
}

export default function Sidebar({ isOpen = false, onClose }: SidebarProps) {
    const pathname = usePathname();

    // Keep track of open sections
    const [openSections, setOpenSections] = useState<Record<string, boolean>>({
        'Using brainlife': true,
        'Tutorials': false,
        'Using CLI': false,
        'Developing Apps': false,
        'Compute Resources': false,
        'Technical': false,
    });

    const toggleSection = (title: string) => {
        setOpenSections((prev) => ({
            ...prev,
            [title]: !prev[title],
        }));
    };

    const isItemActive = (href?: string) => {
        if (!href) return false;
        if (href === '/' && pathname === '/') return true;
        if (href !== '/' && pathname.startsWith(href)) return true;
        return false;
    };

    const renderNavItem = (item: NavItem) => {
        if (item.children && item.children.length > 0) {
            const isExpanded = !!openSections[item.title];
            const hasActiveChild = item.children.some((child) => isItemActive(child.href));

            return (
                <div key={item.title} className="mb-1">
                    <button
                        type="button"
                        onClick={() => toggleSection(item.title)}
                        className={`w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-md transition-colors text-left ${
                            hasActiveChild
                                ? 'text-[#2693D8] font-semibold'
                                : 'text-gray-700 hover:text-gray-900 hover:bg-gray-200/60 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-800'
                        }`}
                    >
                        <span>{item.title}</span>
                        <span className="text-gray-400">
                            {isExpanded ? <ChevronDown size={15} /> : <ChevronRight size={15} />}
                        </span>
                    </button>

                    {isExpanded && (
                        <div className="mt-0.5 ml-2 pl-2 border-l border-gray-200 dark:border-gray-700 space-y-0.5">
                            {item.children.map((child) => {
                                const active = isItemActive(child.href);
                                return (
                                    <Link
                                        key={child.title}
                                        href={child.href || '#'}
                                        onClick={onClose}
                                        className={`block px-3 py-1.5 text-xs rounded-md transition-colors ${
                                            active
                                                ? 'bg-[#ebf8ff] text-[#2693D8] font-semibold border-l-2 border-[#2693D8] -ml-[9px] pl-[15px] dark:bg-[#1e293b] dark:text-[#50bfff]'
                                                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200/50 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-800/60'
                                        }`}
                                    >
                                        {child.title}
                                    </Link>
                                );
                            })}
                        </div>
                    )}
                </div>
            );
        }

        const active = isItemActive(item.href);

        return (
            <Link
                key={item.title}
                href={item.href || '#'}
                onClick={onClose}
                className={`block px-3 py-2 text-sm rounded-md transition-colors ${
                    active
                        ? 'bg-[#ebf8ff] text-[#2693D8] font-semibold border-l-2 border-[#2693D8] pl-[10px] dark:bg-[#1e293b] dark:text-[#50bfff]'
                        : 'text-gray-700 hover:text-gray-900 hover:bg-gray-200/60 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-800'
                }`}
            >
                {item.title}
            </Link>
        );
    };

    return (
        <>
            {/* Mobile backdrop */}
            {isOpen && (
                <div
                    onClick={onClose}
                    className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden transition-opacity"
                    aria-hidden="true"
                />
            )}

            {/* Sidebar container */}
            <aside
                className={`fixed lg:sticky top-16 bottom-0 lg:bottom-auto lg:h-[calc(100vh-4rem)] left-0 z-40 w-64 lg:shrink-0 bg-[#f8fafc] dark:bg-[#1a202c] border-r border-[#e2e8f0] dark:border-[#2d3748] flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
                    isOpen ? 'translate-x-0' : '-translate-x-full'
                }`}
            >
                {/* Sidebar Header with Logo & Title - Aligned to Left */}
                <div className="px-4 py-3.5 border-b border-[#e2e8f0] dark:border-[#2d3748]">
                    <Link
                        href="/"
                        onClick={onClose}
                        className="flex items-center gap-2.5 group"
                    >
                        <div className="w-7 h-7 relative flex-shrink-0 flex items-center justify-center bg-[#2693D8]/15 border border-[#2693D8]/30 rounded-md p-1 group-hover:scale-105 transition-transform">
                            <Image
                                src={getAssetPath('/logo.svg')}
                                alt="brainlife logo"
                                width={20}
                                height={20}
                                className="w-5 h-5 object-contain"
                                onError={(e) => {
                                    (e.target as HTMLImageElement).src = getAssetPath('/logo.png');
                                }}
                            />
                        </div>
                        <div className="flex flex-col text-left">
                            <span className="font-bold text-sm tracking-tight text-gray-900 dark:text-white font-['Work_Sans',sans-serif] leading-tight group-hover:text-[#2693D8] transition-colors">
                                brainlife
                            </span>
                            <span className="text-[10px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                Documentation
                            </span>
                        </div>
                    </Link>
                </div>

                {/* Nav Items */}
                <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5 custom-scrollbar text-left">
                    {DOCS_NAV.map((item) => renderNavItem(item))}
                </nav>

                {/* Bottom Footer Info */}
                <div className="p-3 border-t border-[#e2e8f0] dark:border-[#2d3748] text-[11px] text-gray-500 dark:text-gray-400 text-left px-4">
                    brainlife.io © {new Date().getFullYear()}
                </div>
            </aside>
        </>
    );
}
