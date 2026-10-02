'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight, ChevronDown } from 'lucide-react';
import { DOCS_NAV, NavItem } from '@/lib/docsNavigation';

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
                                ? 'text-[#50bfff] font-semibold'
                                : 'text-gray-300 hover:text-white hover:bg-[#3a4352]/70'
                        }`}
                    >
                        <span>{item.title}</span>
                        <span className={hasActiveChild ? 'text-[#50bfff]' : 'text-gray-400'}>
                            {isExpanded ? <ChevronDown size={15} /> : <ChevronRight size={15} />}
                        </span>
                    </button>

                    {isExpanded && (
                        <div className="mt-0.5 ml-2 pl-2 border-l border-gray-600/60 space-y-0.5">
                            {item.children.map((child) => {
                                const active = isItemActive(child.href);
                                return (
                                    <Link
                                        key={child.title}
                                        href={child.href || '#'}
                                        onClick={onClose}
                                        className={`block px-3 py-1.5 text-xs rounded-md transition-colors ${
                                            active
                                                ? 'bg-[#1e3a5f] text-[#50bfff] font-semibold border-l-2 border-[#50bfff] -ml-[9px] pl-[15px]'
                                                : 'text-gray-300/80 hover:text-white hover:bg-[#3a4352]/50'
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
                        ? 'bg-[#1e3a5f] text-[#50bfff] font-semibold border-l-2 border-[#50bfff] pl-[10px]'
                        : 'text-gray-300 hover:text-white hover:bg-[#3a4352]/70'
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

            {/* Sidebar container matching navbar color */}
            <aside
                className={`fixed lg:sticky top-16 bottom-0 lg:bottom-auto lg:h-[calc(100vh-4rem)] left-0 z-40 w-64 lg:shrink-0 bg-[#2d3748] border-r border-[#3a4352] text-white flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
                    isOpen ? 'translate-x-0' : '-translate-x-full'
                }`}
            >
                {/* Nav Items */}
                <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5 custom-scrollbar text-left">
                    {DOCS_NAV.map((item) => renderNavItem(item))}
                </nav>

                {/* Bottom Footer Info */}
                <div className="p-3 border-t border-[#3a4352] text-[11px] text-gray-400 text-left px-4">
                    brainlife.io © {new Date().getFullYear()}
                </div>
            </aside>
        </>
    );
}
