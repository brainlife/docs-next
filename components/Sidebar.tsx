'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    ChevronRight,
    ChevronDown,
    Home,
    CheckCircle2,
    Folder,
    Database,
    Box,
    GitFork,
    Eye,
    Compass,
    Terminal,
    Code2,
    Cpu,
    FileText,
    Layers,
    Archive,
    Sliders,
    Code,
    HelpCircle,
    Briefcase,
    Mail,
    Shield,
    FileCheck,
    Image as ImageIcon,
    Sparkles,
    GraduationCap,
} from 'lucide-react';
import { DOCS_SECTIONS, NavItem } from '@/lib/docsNavigation';

function EzBidsIcon({ size = 16, className = "" }: { size?: number; className?: string }) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 178 200"
            fill="currentColor"
            className={className}
            aria-hidden="true"
        >
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M60.345 1.35323C58.61 2.10823 56.163 4.11523 54.907 5.81423C53.062 8.30923 51.904 8.90223 48.877 8.90223C39.14 8.90223 31.412 16.2222 30.78 26.0442C30.529 29.9552 30.038 30.7222 26 33.5172C23.525 35.2302 20.375 38.6052 19 41.0172C16.843 44.8002 16.494 46.6692 16.458 54.6302C16.418 63.2222 16.233 64.0502 13.764 66.6302C9.754 70.8222 6.016 79.9102 5.362 87.0542C4.936 91.7082 5.348 95.7722 6.903 102.284C8.158 107.536 8.669 111.623 8.154 112.284C6.501 114.406 4 123.27 4 127.007C4 129.347 5.316 133.282 7.5 137.471C10.53 143.285 11.003 145.14 11.022 151.294C11.066 165.442 18.847 174.267 33.082 176.315C37.037 176.884 37.887 177.442 39.295 180.394C41.637 185.305 47.709 191.697 52.432 194.222C58.422 197.424 73.413 197.36 80.5 194.102C89.769 189.841 95.495 182.645 97.964 172.152C97.964 172.152 100 166 100 160C100 154 97.44 147.902 97.44 147.902C97.05 145.978 95.849 142.586 94.77 140.365C93.079 136.884 92.965 135.747 93.943 132.115C93.943 132.115 96 128.5 96.5 123.5C97 118.5 95 113.823 95 113.823C95 112.679 93.852 108.874 92.449 105.367C92.3232 105.053 92.2038 104.755 92.0906 104.473C90.1966 99.7507 90.0282 99.3309 90.5 96.5001C90.5 96.5001 94.454 91.5001 95 88.5001C95.546 85.5001 96 79.5001 96 79.5001L95.454 75.6922C95.066 73.9262 93.891 70.4812 92.843 68.0362C90.942 63.6022 90.943 63.5782 93.162 58.2252C95.201 53.3062 95.28 52.4232 94.111 47.6302C92.422 40.7032 92.479 38.5152 94.537 31.4022C98.403 18.0412 91.262 5.49423 77.422 1.32823C71.506 -0.451766 64.47 -0.441767 60.345 1.35323Z"
            />
            <rect x="94" y="155" width="46" height="12" />
            <rect x="94" y="116" width="46" height="12" />
            <rect x="93" y="78" width="47" height="12" />
            <path d="M142 47V41.5V36H152.5H163V49.5V63H157.5H152V55V47H147H142Z" />
            <path d="M148 175V161V147H154H160V153V159H166H172V167V175H160H148Z" />
            <path d="M163 156V152C163 149.8 163.134 148 163.297 148C163.46 148 165.352 149.8 167.5 152L171.406 156H167.203H163Z" />
            <path d="M148 136V122V108H154H160V114V120H166H172V128V136H160H148Z" />
            <path d="M163 117V113C163 110.8 163.134 109 163.297 109C163.46 109 165.352 110.8 167.5 113L171.406 117H167.203H163Z" />
            <path d="M148 98V84V70H154H160V75.45V80.9L165.75 81.2L171.5 81.5L171.79 89.75L172.081 98H160.04H148Z" />
            <path d="M163 79V74.297V69.594L167 73.5C169.2 75.648 171 77.765 171 78.203C171 78.641 169.2 79 167 79H163Z" />
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M107.396 25.41C107.099 26.185 105.749 27.097 104.398 27.436L101.941 28.053L102.22 40.777L102.5 53.5H120.5H138.5L138.783 41.642C138.971 33.754 138.679 29.318 137.91 28.392C137.114 27.432 134.456 27 129.346 27C123.683 27 121.802 26.647 121.362 25.5C120.565 23.424 108.189 23.344 107.396 25.41ZM135.751 31.75C136.072 32.714 132.605 33 120.583 33C106.294 33 103.738 32.595 105.692 30.641C106.073 30.26 112.899 30.073 120.86 30.224C131.35 30.424 135.45 30.844 135.751 31.75Z"
            />
        </svg>
    );
}

interface SidebarProps {
    isOpen?: boolean;
    onClose?: () => void;
}

const ICON_MAP: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
    Home,
    CheckCircle2,
    Folder,
    Database,
    Box,
    GitFork,
    Eye,
    Compass,
    Terminal,
    Code2,
    Cpu,
    FileText,
    Layers,
    Archive,
    Sliders,
    Code,
    HelpCircle,
    Briefcase,
    Mail,
    Shield,
    FileCheck,
    Image: ImageIcon,
    Sparkles,
    GraduationCap,
    EzBids: EzBidsIcon,
};

export default function Sidebar({ isOpen = false, onClose }: SidebarProps) {
    const pathname = usePathname();

    const [openSections, setOpenSections] = useState<Record<string, boolean>>({});

    const toggleSection = (title: string, currentlyExpanded: boolean) => {
        setOpenSections((prev) => ({
            ...prev,
            [title]: !currentlyExpanded,
        }));
    };

    const isItemActive = (href?: string) => {
        if (!href) return false;
        if (href === '/' && pathname === '/') return true;
        if (href !== '/') {
            const cleanHref = href.replace(/\/$/, '');
            const cleanPath = pathname.replace(/\/$/, '');
            if (cleanPath === cleanHref || cleanPath.startsWith(`${cleanHref}/`)) return true;
        }
        return false;
    };

    const renderNavItem = (item: NavItem) => {
        const IconComponent = item.icon ? ICON_MAP[item.icon] : null;
        const active = isItemActive(item.href);
        const hasChildren = item.children && item.children.length > 0;
        const isHome = item.href === '/';

        // Home special rendering with sublinks if homepage
        if (isHome) {
            const isHomeActive = pathname === '/';
            return (
                <div key={item.title} className="mb-1">
                    <Link
                        href="/"
                        onClick={onClose}
                        className={`flex items-center gap-2.5 px-3 py-2 text-sm rounded-md transition-all ${
                            isHomeActive
                                ? 'bg-[#1e3a5f] text-[#50bfff] font-semibold border-l-2 border-[#50bfff]'
                                : 'text-gray-300 hover:text-white hover:bg-[#3a4352]/70'
                        }`}
                    >
                        {IconComponent && (
                            <IconComponent
                                size={16}
                                className={isHomeActive ? 'text-[#50bfff]' : 'text-gray-400'}
                            />
                        )}
                        <span>{item.title}</span>
                    </Link>

                    {/* Sublinks under Home */}
                    {isHomeActive && item.children && (
                        <div className="mt-1 ml-4 pl-3 border-l border-gray-600/60 space-y-1">
                            {item.children.map((sub) => (
                                <a
                                    key={sub.title}
                                    href={sub.href || '#'}
                                    onClick={onClose}
                                    className="block py-1 text-xs text-gray-300/80 hover:text-white transition-colors"
                                >
                                    {sub.title}
                                </a>
                            ))}
                        </div>
                    )}
                </div>
            );
        }

        // Accordion with expandable children
        if (hasChildren) {
            const hasActiveChild = item.children?.some((child) => isItemActive(child.href));
            const isExpanded = openSections[item.title] !== undefined ? openSections[item.title] : hasActiveChild;

            return (
                <div key={item.title} className="mb-0.5">
                    <button
                        type="button"
                        onClick={() => toggleSection(item.title, !!isExpanded)}
                        className={`w-full flex items-center justify-between px-3 py-2 text-sm rounded-md transition-colors text-left ${
                            hasActiveChild
                                ? 'text-[#50bfff] font-semibold bg-[#1e3a5f]/40'
                                : 'text-gray-300 hover:text-white hover:bg-[#3a4352]/70'
                        }`}
                    >
                        <div className="flex items-center gap-2.5 min-w-0">
                            {IconComponent && (
                                <IconComponent
                                    size={16}
                                    className={hasActiveChild ? 'text-[#50bfff]' : 'text-gray-400'}
                                />
                            )}
                            <span className="truncate">{item.title}</span>
                        </div>
                        <span className={hasActiveChild ? 'text-[#50bfff]' : 'text-gray-400'}>
                            {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                        </span>
                    </button>

                    {isExpanded && item.children && (
                        <div className="mt-0.5 ml-4 pl-2.5 border-l border-gray-600/60 space-y-0.5">
                            {item.children.map((child) => {
                                const childActive = isItemActive(child.href);
                                return (
                                    <Link
                                        key={child.title}
                                        href={child.href || '#'}
                                        onClick={onClose}
                                        className={`block px-2.5 py-1.5 text-xs rounded-md transition-colors ${
                                            childActive
                                                ? 'bg-[#1e3a5f] text-[#50bfff] font-semibold border-l-2 border-[#50bfff] -ml-[11px] pl-[17px]'
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

        // Regular flat item
        return (
            <Link
                key={item.title}
                href={item.href || '#'}
                onClick={onClose}
                className={`flex items-center justify-between px-3 py-2 text-sm rounded-md transition-all mb-0.5 ${
                    active
                        ? 'bg-[#1e3a5f] text-[#50bfff] font-semibold border-l-2 border-[#50bfff]'
                        : 'text-gray-300 hover:text-white hover:bg-[#3a4352]/70'
                }`}
            >
                <div className="flex items-center gap-2.5 min-w-0">
                    {IconComponent && (
                        <IconComponent
                            size={16}
                            className={active ? 'text-[#50bfff]' : 'text-gray-400'}
                        />
                    )}
                    <span className="truncate">{item.title}</span>
                </div>
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

            {/* Sidebar container matching header background #2d3748 */}
            <aside
                className={`fixed lg:sticky top-16 bottom-0 lg:bottom-auto lg:h-[calc(100vh-4rem)] left-0 z-40 w-64 lg:shrink-0 bg-[#2d3748] border-r border-[#3a4352] text-white flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
                    isOpen ? 'translate-x-0' : '-translate-x-full'
                }`}
            >
                {/* Nav Items grouped by Section */}
                <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-4 custom-scrollbar text-left">
                    {DOCS_SECTIONS.map((section) => (
                        <div key={section.title}>
                            <div className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider px-3 pb-1.5 select-none">
                                {section.title}
                            </div>
                            <div className="space-y-0.5">
                                {section.items.map((item) => renderNavItem(item))}
                            </div>
                        </div>
                    ))}
                </nav>

                {/* Bottom Footer Info */}
                <div className="p-3 border-t border-[#3a4352] text-[11px] text-gray-400 text-left px-4">
                    brainlife.io © {new Date().getFullYear()}
                </div>
            </aside>
        </>
    );
}
