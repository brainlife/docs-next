'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
    BookOpen,
    PlayCircle,
    Play,
    ExternalLink,
    Sparkles,
    Cloud,
    Settings,
    Database,
    Users,
    Clock,
    ChevronRight,
    Pencil,
} from 'lucide-react';
import DocLayout from '@/components/DocLayout';
import { TocHeading } from '@/components/TableOfContents';

interface EzBidsGuideProps {
    markdownHtml: string;
    headings: TocHeading[];
    githubEditUrl: string;
}

export default function EzBidsGuide({
    markdownHtml,
    headings,
    githubEditUrl,
}: EzBidsGuideProps) {
    const [activeTab, setActiveTab] = useState<'written' | 'video'>('written');

    // Filter headings to match the clean TOC on the right of the reference design
    const filteredHeadings = headings.filter(
        (h) =>
            h.id !== 'ezbids-user-documentation' &&
            h.id !== 'ezbids-walkthrough'
    );

    return (
        <DocLayout headings={filteredHeadings} githubEditUrl={githubEditUrl}>
            <article className="min-w-0 relative">
                {/* Top Action Bar with GitHub Edit button */}
                <div className="absolute top-0 right-0 z-10">
                    <a
                        href={githubEditUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs text-gray-500 hover:text-[#2693D8] transition-colors py-1 px-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
                        title="Edit this page on GitHub"
                    >
                        <Pencil size={14} />
                        <span className="hidden sm:inline">Edit on GitHub</span>
                    </a>
                </div>

                {/* Breadcrumbs */}
                <nav
                    className="flex items-center gap-1.5 text-xs sm:text-sm text-gray-400 mb-4"
                    aria-label="Breadcrumb"
                >
                    <Link href="/" className="hover:text-gray-200 transition-colors">
                        Documentation
                    </Link>
                    <ChevronRight size={13} className="text-gray-500" />
                    <Link
                        href="/docs/user/started"
                        className="hover:text-gray-200 transition-colors"
                    >
                        Using brainlife
                    </Link>
                    <ChevronRight size={13} className="text-gray-500" />
                    <span className="text-[#50bfff] font-medium">ezBIDS</span>
                </nav>

                {/* Real ezBIDS Logo */}
                <div className="flex items-center gap-3 mb-2">
                    <img
                        src="/ezbids-logo.svg"
                        alt="ezBIDS Logo"
                        className="h-10 sm:h-12 w-auto object-contain"
                    />
                </div>

                {/* Title & Subtitle */}
                <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mt-1 mb-2 font-['Work_Sans',sans-serif]">
                    ezBIDS User Documentation
                </h1>
                <p className="text-base text-gray-400 mb-6 font-normal max-w-3xl leading-relaxed">
                    Learn how to convert neuroimaging data to BIDS using ezBIDS, a web-based
                    tool on brainlife.io.
                </p>

                {/* Tabs Switcher: Written Guide vs Video Guide */}
                <div className="bg-[#161c28] border border-[#2b3548] p-1 inline-flex items-center gap-1.5 rounded-lg mb-8 shadow-xs">
                    <button
                        type="button"
                        onClick={() => setActiveTab('written')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                            activeTab === 'written'
                                ? 'bg-[#1e3a5f] text-[#50bfff] shadow-xs'
                                : 'text-gray-400 hover:text-gray-200 hover:bg-[#222c3d]'
                        }`}
                    >
                        <BookOpen size={16} />
                        <span>Written Guide</span>
                    </button>
                    <button
                        type="button"
                        onClick={() => setActiveTab('video')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                            activeTab === 'video'
                                ? 'bg-[#1e3a5f] text-[#50bfff] shadow-xs'
                                : 'text-gray-400 hover:text-gray-200 hover:bg-[#222c3d]'
                        }`}
                    >
                        <PlayCircle size={16} />
                        <span>Video Guide</span>
                    </button>
                </div>

                {/* ================= WRITTEN GUIDE TAB ================= */}
                {activeTab === 'written' ? (
                    <div>
                        {/* Introduction Lead Paragraph */}
                        <p className="text-base text-gray-300 leading-relaxed mb-6">
                            <a
                                href="https://brainlife.io/ezbids"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[#50bfff] hover:underline font-medium"
                            >
                                ezBIDS
                            </a>{' '}
                            is a web-based BIDS conversion tool that requires neither
                            installation, programming proficiency, nor knowledge of the Unix
                            terminal and BIDS specification. The term BIDS is an acronym that
                            stands for the{' '}
                            <a
                                href="https://bids-specification.readthedocs.io/en/stable/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[#50bfff] hover:underline font-medium"
                            >
                                Brain Imaging Data Structure
                            </a>
                            . More specifically, BIDS is a format for describing and
                            organizing (primarily neuroimaging) data, greatly enhancing data
                            sharing within the scientific community, as well as enabling access
                            to a suite of processing and analysis tools that can be automatically
                            executed on BIDS data, known as{' '}
                            <a
                                href="https://bids-apps.neuroimaging.io/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[#50bfff] hover:underline font-medium"
                            >
                                BIDS apps
                            </a>
                            .
                        </p>

                        {/* "New to ezBIDS?" Video Walkthrough Callout Banner */}
                        <div className="rounded-xl p-5 sm:p-6 mb-8 border border-[#1e3a5f]/80 bg-[#102035]/80 flex flex-col sm:flex-row items-start sm:items-center gap-5 shadow-sm">
                            <button
                                type="button"
                                onClick={() => setActiveTab('video')}
                                className="w-14 h-14 rounded-xl bg-[#2693D8] hover:bg-[#1d74ae] text-white flex items-center justify-center flex-shrink-0 shadow-md transition-transform hover:scale-105 group"
                                aria-label="Play video walkthrough"
                            >
                                <Play
                                    size={24}
                                    className="ml-0.5 fill-white group-hover:scale-110 transition-transform"
                                />
                            </button>
                            <div className="flex-1 min-w-0">
                                <h3 className="text-lg font-bold text-white mb-1">
                                    New to ezBIDS?
                                </h3>
                                <p className="text-sm text-gray-300 mb-3 leading-relaxed">
                                    Watch the video walkthrough to see how ezBIDS works before
                                    following the written steps.
                                </p>
                                <button
                                    type="button"
                                    onClick={() => setActiveTab('video')}
                                    className="inline-flex items-center gap-2 px-4 py-1.5 rounded-md bg-[#2693D8] hover:bg-[#1d74ae] text-white text-xs sm:text-sm font-medium transition-colors shadow-xs"
                                >
                                    <span>Watch video tutorial</span>
                                    <ExternalLink size={14} />
                                </button>
                            </div>
                        </div>

                        {/* Section: A Primer to ezBIDS */}
                        <section className="mb-6">
                            <h2
                                id="a-primer-to-ezbids"
                                className="text-2xl font-bold text-white tracking-tight mb-3 font-['Work_Sans',sans-serif]"
                            >
                                A Primer to ezBIDS
                            </h2>
                            <p className="text-base text-gray-300 leading-relaxed mb-6">
                                The process of converting raw imaging data to BIDS is often
                                time-consuming and can require substantial technical expertise.
                                ezBIDS provides a simplified, web-based interface to help you
                                organize, describe, and convert your data to BIDS.
                            </p>

                            {/* Key Features Grid Cards */}
                            <div className="rounded-xl p-5 mb-8 border border-[#2b3548] bg-[#161f30]/60">
                                <div className="flex items-center gap-2 text-xs font-semibold text-[#50bfff] mb-4 uppercase tracking-wider">
                                    <Sparkles size={15} />
                                    <span>Key features</span>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                    <div className="flex items-start gap-3">
                                        <div className="p-2 rounded-lg bg-[#1e3a5f]/60 text-[#50bfff] flex-shrink-0">
                                            <Cloud size={20} />
                                        </div>
                                        <div>
                                            <div className="font-semibold text-sm text-white">
                                                No installation
                                            </div>
                                            <div className="text-xs text-gray-400 mt-0.5">
                                                Works in your web browser
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <div className="p-2 rounded-lg bg-[#1e3a5f]/60 text-[#50bfff] flex-shrink-0">
                                            <Settings size={20} />
                                        </div>
                                        <div>
                                            <div className="font-semibold text-sm text-white">
                                                Guided workflow
                                            </div>
                                            <div className="text-xs text-gray-400 mt-0.5">
                                                Step-by-step conversion process
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <div className="p-2 rounded-lg bg-[#1e3a5f]/60 text-[#50bfff] flex-shrink-0">
                                            <Database size={20} />
                                        </div>
                                        <div>
                                            <div className="font-semibold text-sm text-white">
                                                BIDS compliant
                                            </div>
                                            <div className="text-xs text-gray-400 mt-0.5">
                                                Generates valid BIDS datasets
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <div className="p-2 rounded-lg bg-[#1e3a5f]/60 text-[#50bfff] flex-shrink-0">
                                            <Users size={20} />
                                        </div>
                                        <div>
                                            <div className="font-semibold text-sm text-white">
                                                Community ready
                                            </div>
                                            <div className="text-xs text-gray-400 mt-0.5">
                                                Easily share and use with BIDS apps
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Full Detailed Markdown Content (Walkthrough steps, screenshots, FAQ) */}
                        <div
                            className="prose-docs"
                            dangerouslySetInnerHTML={{ __html: markdownHtml }}
                        />
                    </div>
                ) : (
                    /* ================= VIDEO GUIDE TAB ================= */
                    <div className="space-y-6">
                        {/* 16:9 Responsive Video Player */}
                        <div className="relative aspect-video w-full rounded-2xl overflow-hidden border border-[#2b3548] shadow-2xl bg-black">
                            <iframe
                                src="https://www.youtube-nocookie.com/embed/mY3_bmt_e80?autoplay=1&rel=0&modestbranding=1"
                                title="ezBIDS Video Walkthrough"
                                className="w-full h-full border-0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                allowFullScreen
                            />
                        </div>

                        {/* Video metadata & overview */}
                        <div className="rounded-xl p-6 border border-[#2b3548] bg-[#161f30]/60 space-y-5">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div>
                                    <h3 className="text-xl font-bold text-white">
                                        ezBIDS: Automated BIDS Conversion Walkthrough
                                    </h3>
                                    <p className="text-sm text-gray-400 mt-1">
                                        Comprehensive video tutorial demonstrating how to convert
                                        raw imaging data into standardized BIDS datasets with
                                        ezBIDS.
                                    </p>
                                </div>
                                <div className="flex items-center gap-2.5 flex-shrink-0">
                                    <a
                                        href="https://www.youtube.com/watch?v=mY3_bmt_e80"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#1f2633] hover:bg-[#2b3548] border border-[#3a4456] text-xs text-gray-200 transition-colors"
                                    >
                                        <span>Open on YouTube</span>
                                        <ExternalLink size={12} />
                                    </a>
                                    <a
                                        href="https://brainlife.io/ezbids"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-md bg-[#2693D8] hover:bg-[#1d74ae] text-xs font-semibold text-white transition-colors shadow-xs"
                                    >
                                        <span>Launch ezBIDS</span>
                                        <ExternalLink size={12} />
                                    </a>
                                </div>
                            </div>

                            {/* Walkthrough Steps Grid */}
                            <div className="pt-4 border-t border-gray-700/60">
                                <h4 className="text-xs font-semibold text-[#50bfff] uppercase tracking-wider mb-3.5 flex items-center gap-1.5">
                                    <Clock size={14} />
                                    <span>Key Steps Covered in This Walkthrough</span>
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-gray-300">
                                    <div className="flex items-center gap-2.5 p-2.5 rounded-lg bg-[#111827]/60 border border-gray-800">
                                        <span className="w-5 h-5 rounded-full bg-[#1e3a5f] text-[#50bfff] flex items-center justify-center font-bold text-[11px] flex-shrink-0">
                                            1
                                        </span>
                                        <span>Uploading raw DICOM or NIfTI/JSON files</span>
                                    </div>
                                    <div className="flex items-center gap-2.5 p-2.5 rounded-lg bg-[#111827]/60 border border-gray-800">
                                        <span className="w-5 h-5 rounded-full bg-[#1e3a5f] text-[#50bfff] flex items-center justify-center font-bold text-[11px] flex-shrink-0">
                                            2
                                        </span>
                                        <span>Automated inference and dataset metadata review</span>
                                    </div>
                                    <div className="flex items-center gap-2.5 p-2.5 rounded-lg bg-[#111827]/60 border border-gray-800">
                                        <span className="w-5 h-5 rounded-full bg-[#1e3a5f] text-[#50bfff] flex items-center justify-center font-bold text-[11px] flex-shrink-0">
                                            3
                                        </span>
                                        <span>Subjects, sessions, and series mapping</span>
                                    </div>
                                    <div className="flex items-center gap-2.5 p-2.5 rounded-lg bg-[#111827]/60 border border-gray-800">
                                        <span className="w-5 h-5 rounded-full bg-[#1e3a5f] text-[#50bfff] flex items-center justify-center font-bold text-[11px] flex-shrink-0">
                                            4
                                        </span>
                                        <span>Resolving warnings (e.g., fieldmaps IntendedFor)</span>
                                    </div>
                                    <div className="flex items-center gap-2.5 p-2.5 rounded-lg bg-[#111827]/60 border border-gray-800">
                                        <span className="w-5 h-5 rounded-full bg-[#1e3a5f] text-[#50bfff] flex items-center justify-center font-bold text-[11px] flex-shrink-0">
                                            5
                                        </span>
                                        <span>Mapping functional task timing & events</span>
                                    </div>
                                    <div className="flex items-center gap-2.5 p-2.5 rounded-lg bg-[#111827]/60 border border-gray-800">
                                        <span className="w-5 h-5 rounded-full bg-[#1e3a5f] text-[#50bfff] flex items-center justify-center font-bold text-[11px] flex-shrink-0">
                                            6
                                        </span>
                                        <span>Defacing anatomical images & exporting BIDS</span>
                                    </div>
                                </div>
                            </div>

                            {/* Back to Written Guide Link */}
                            <div className="pt-2 flex items-center justify-between">
                                <button
                                    type="button"
                                    onClick={() => setActiveTab('written')}
                                    className="inline-flex items-center gap-2 text-xs sm:text-sm text-[#50bfff] hover:underline font-medium"
                                >
                                    <BookOpen size={15} />
                                    <span>
                                        Need the step-by-step text guide? Switch to Written Guide &rarr;
                                    </span>
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </article>
        </DocLayout>
    );
}
