'use client';

import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Search, X, FileText, ArrowRight, CornerDownLeft } from 'lucide-react';
import { getAssetPath } from '@/lib/basePath';

export interface SearchDoc {
    id: string;
    url: string;
    pageTitle: string;
    section: string;
    category: string;
    content: string;
}

interface SearchResult extends SearchDoc {
    score: number;
    snippet: string;
    matchedTerms: string[];
}

interface SearchBarProps {
    className?: string;
    isMobileOpen?: boolean;
    onCloseMobile?: () => void;
}

export default function SearchBar({ className = '', isMobileOpen = false, onCloseMobile }: SearchBarProps) {
    const [query, setQuery] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [docs, setDocs] = useState<SearchDoc[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [hasLoaded, setHasLoaded] = useState(false);

    const inputRef = useRef<HTMLInputElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const listRef = useRef<HTMLUListElement>(null);
    const router = useRouter();

    // Fetch the search index JSON lazily when needed
    const loadSearchIndex = useCallback(async () => {
        if (hasLoaded || isLoading) return;
        setIsLoading(true);
        try {
            const res = await fetch(getAssetPath('/search-index.json'));
            if (res.ok) {
                const data = await res.json();
                setDocs(data);
                setHasLoaded(true);
            }
        } catch (err) {
            console.error('Failed to load search index:', err);
        } finally {
            setIsLoading(false);
        }
    }, [hasLoaded, isLoading]);

    // Keyboard shortcut to open search (⌘K or Ctrl+K or /)
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
                e.preventDefault();
                loadSearchIndex();
                setIsOpen(true);
                setTimeout(() => inputRef.current?.focus(), 50);
            } else if (e.key === '/' && document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') {
                e.preventDefault();
                loadSearchIndex();
                setIsOpen(true);
                setTimeout(() => inputRef.current?.focus(), 50);
            } else if (e.key === 'Escape') {
                setIsOpen(false);
                onCloseMobile?.();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [loadSearchIndex, onCloseMobile]);

    // Handle clicks outside the search container to close
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen]);

    // Focus input when mobile modal opens
    useEffect(() => {
        if (isMobileOpen) {
            loadSearchIndex();
            setIsOpen(true);
            setTimeout(() => inputRef.current?.focus(), 50);
        }
    }, [isMobileOpen, loadSearchIndex]);

    // Filter and score search results
    const results = useMemo<SearchResult[]>(() => {
        const trimmed = query.trim().toLowerCase();
        if (!trimmed || docs.length === 0) return [];

        const terms = trimmed.split(/\s+/).filter(Boolean);

        const matched: SearchResult[] = [];

        for (const doc of docs) {
            const sectionLower = doc.section.toLowerCase();
            const titleLower = doc.pageTitle.toLowerCase();
            const categoryLower = doc.category.toLowerCase();
            const contentLower = doc.content.toLowerCase();

            // All terms must appear in at least one field
            const allTermsMatch = terms.every(
                (term) =>
                    sectionLower.includes(term) ||
                    titleLower.includes(term) ||
                    categoryLower.includes(term) ||
                    contentLower.includes(term)
            );

            if (!allTermsMatch) continue;

            let score = 0;

            // Full phrase matches get highest priority
            if (sectionLower.includes(trimmed)) score += 120;
            if (titleLower.includes(trimmed)) score += 90;
            if (categoryLower.includes(trimmed)) score += 40;
            if (contentLower.includes(trimmed)) score += 30;

            // Per-term scores
            for (const term of terms) {
                if (sectionLower.startsWith(term)) score += 40;
                else if (sectionLower.includes(term)) score += 25;

                if (titleLower.startsWith(term)) score += 30;
                else if (titleLower.includes(term)) score += 20;

                if (categoryLower.includes(term)) score += 10;
                if (contentLower.includes(term)) score += 5;
            }

            // Generate contextual snippet
            let snippet = '';
            let firstMatchIdx = -1;
            for (const term of terms) {
                const idx = contentLower.indexOf(term);
                if (idx !== -1 && (firstMatchIdx === -1 || idx < firstMatchIdx)) {
                    firstMatchIdx = idx;
                }
            }

            if (firstMatchIdx !== -1) {
                const start = Math.max(0, firstMatchIdx - 45);
                const end = Math.min(doc.content.length, firstMatchIdx + 110);
                snippet = (start > 0 ? '...' : '') +
                    doc.content.substring(start, end).trim() +
                    (end < doc.content.length ? '...' : '');
            } else {
                snippet = doc.content.substring(0, 140) + (doc.content.length > 140 ? '...' : '');
            }

            matched.push({
                ...doc,
                score,
                snippet,
                matchedTerms: terms,
            });
        }

        matched.sort((a, b) => b.score - a.score);
        return matched.slice(0, 12);
    }, [query, docs]);

    // Reset selected index when results change
    useEffect(() => {
        setSelectedIndex(0);
    }, [results]);

    // Scroll active item into view
    useEffect(() => {
        if (!listRef.current) return;
        const activeEl = listRef.current.children[selectedIndex] as HTMLElement;
        if (activeEl) {
            activeEl.scrollIntoView({ block: 'nearest' });
        }
    }, [selectedIndex]);

    const handleSelectResult = (result: SearchResult) => {
        setIsOpen(false);
        setQuery('');
        onCloseMobile?.();
        router.push(result.url);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (results.length > 0) {
                setSelectedIndex((prev) => (prev + 1) % results.length);
            }
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (results.length > 0) {
                setSelectedIndex((prev) => (prev - 1 + results.length) % results.length);
            }
        } else if (e.key === 'Enter') {
            e.preventDefault();
            if (results[selectedIndex]) {
                handleSelectResult(results[selectedIndex]);
            }
        } else if (e.key === 'Escape') {
            setIsOpen(false);
            onCloseMobile?.();
            inputRef.current?.blur();
        }
    };

    // Helper to highlight search terms
    const renderHighlightedText = (text: string, terms: string[]) => {
        if (!terms || terms.length === 0 || !text) return text;

        const escapedTerms = terms.map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).filter(Boolean);
        if (escapedTerms.length === 0) return text;

        const regex = new RegExp(`(${escapedTerms.join('|')})`, 'gi');
        const parts = text.split(regex);

        return (
            <>
                {parts.map((part, i) =>
                    regex.test(part) ? (
                        <mark
                            key={i}
                            className="bg-[#2693D8]/30 text-[#50bfff] font-medium px-0.5 rounded"
                        >
                            {part}
                        </mark>
                    ) : (
                        part
                    )
                )}
            </>
        );
    };

    return (
        <div ref={containerRef} className={`relative ${className}`}>
            {/* Input Wrapper */}
            <div className="relative flex items-center">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <Search size={16} />
                </div>
                <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={(e) => {
                        setQuery(e.target.value);
                        if (!isOpen) setIsOpen(true);
                    }}
                    onFocus={() => {
                        loadSearchIndex();
                        setIsOpen(true);
                    }}
                    onKeyDown={handleKeyDown}
                    placeholder="Search docs..."
                    aria-label="Search documentation"
                    className="w-full pl-9 pr-16 py-1.5 bg-[#1f2633] text-sm text-gray-100 placeholder-gray-400 rounded-md border border-[#4a5568] focus:outline-none focus:border-[#2693D8] focus:ring-1 focus:ring-[#2693D8] transition-colors"
                />

                {query ? (
                    <button
                        type="button"
                        onClick={() => {
                            setQuery('');
                            inputRef.current?.focus();
                        }}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white transition-colors"
                        title="Clear search"
                    >
                        <X size={15} />
                    </button>
                ) : (
                    <div className="absolute inset-y-0 right-0 pr-2.5 flex items-center pointer-events-none">
                        <kbd className="text-[10px] font-mono font-medium text-gray-400 bg-[#2d3748] px-1.5 py-0.5 rounded border border-[#4a5568]">
                            ⌘K
                        </kbd>
                    </div>
                )}
            </div>

            {/* Live Search Results Dropdown (MkDocs Material style) */}
            {isOpen && query.trim().length > 0 && (
                <div className="absolute left-0 right-0 mt-2 z-50 bg-[#1f2633] border border-[#3a4352] rounded-lg shadow-2xl overflow-hidden backdrop-blur-md">
                    {/* Header info */}
                    <div className="px-4 py-2 border-b border-[#3a4352] flex items-center justify-between text-xs text-gray-400 bg-[#19202c]">
                        <span>
                            {isLoading ? (
                                'Indexing documentation...'
                            ) : results.length > 0 ? (
                                <>
                                    Found <span className="text-white font-medium">{results.length}</span>{' '}
                                    {results.length === 1 ? 'result' : 'results'} for &ldquo;{query}&rdquo;
                                </>
                            ) : (
                                'No matching documents'
                            )}
                        </span>
                        <span className="text-[11px] text-gray-500 hidden sm:inline">
                            Navigate with ↑ ↓
                        </span>
                    </div>

                    {/* Results List */}
                    {results.length > 0 ? (
                        <ul
                            ref={listRef}
                            className="max-h-[60vh] sm:max-h-[420px] overflow-y-auto divide-y divide-[#2a3444] custom-scrollbar"
                            role="listbox"
                        >
                            {results.map((result, idx) => {
                                const isSelected = idx === selectedIndex;
                                return (
                                    <li
                                        key={result.id}
                                        role="option"
                                        aria-selected={isSelected}
                                        onMouseEnter={() => setSelectedIndex(idx)}
                                        onClick={() => handleSelectResult(result)}
                                        className={`p-3.5 cursor-pointer transition-colors ${
                                            isSelected
                                                ? 'bg-[#293548] text-white'
                                                : 'hover:bg-[#252f3f] text-gray-300'
                                        }`}
                                    >
                                        <div className="flex items-start gap-2.5">
                                            <div
                                                className={`mt-0.5 p-1 rounded ${
                                                    isSelected
                                                        ? 'bg-[#2693D8] text-white'
                                                        : 'bg-[#2d3748] text-gray-400'
                                                }`}
                                            >
                                                <FileText size={14} />
                                            </div>

                                            <div className="flex-1 min-w-0">
                                                {/* Hierarchy breadcrumbs */}
                                                <div className="flex items-center gap-1.5 text-[11px] text-gray-400 font-medium mb-0.5">
                                                    <span className="text-[#50bfff]">
                                                        {result.category}
                                                    </span>
                                                    <span>/</span>
                                                    <span className="truncate">{result.pageTitle}</span>
                                                </div>

                                                {/* Section Title */}
                                                <div className="text-sm font-semibold text-white tracking-tight flex items-center gap-1">
                                                    <span>
                                                        {renderHighlightedText(
                                                            result.section,
                                                            result.matchedTerms
                                                        )}
                                                    </span>
                                                    {isSelected && (
                                                        <ArrowRight
                                                            size={13}
                                                            className="text-[#50bfff] ml-auto flex-shrink-0"
                                                        />
                                                    )}
                                                </div>

                                                {/* Matching Text Snippet */}
                                                {result.snippet && (
                                                    <p className="text-xs text-gray-400 leading-relaxed mt-1 line-clamp-2">
                                                        {renderHighlightedText(
                                                            result.snippet,
                                                            result.matchedTerms
                                                        )}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </li>
                                );
                            })}
                        </ul>
                    ) : (
                        <div className="py-10 px-4 text-center">
                            <p className="text-sm text-gray-300 font-medium">
                                No documentation found matching &ldquo;{query}&rdquo;
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                                Try searching for alternative keywords (e.g. &ldquo;singularity&rdquo;, &ldquo;freesurfer&rdquo;, &ldquo;cli&rdquo;, &ldquo;bids&rdquo;)
                            </p>
                        </div>
                    )}

                    {/* Footer keyboard helpers */}
                    <div className="px-4 py-2 border-t border-[#3a4352] bg-[#19202c] hidden sm:flex items-center justify-between text-[11px] text-gray-400">
                        <div className="flex items-center gap-3">
                            <span className="flex items-center gap-1">
                                <kbd className="px-1.5 py-0.5 rounded bg-[#2d3748] border border-[#4a5568] font-mono text-[10px]">
                                    ↵
                                </kbd>
                                select
                            </span>
                            <span className="flex items-center gap-1">
                                <kbd className="px-1.5 py-0.5 rounded bg-[#2d3748] border border-[#4a5568] font-mono text-[10px]">
                                    ↑
                                </kbd>
                                <kbd className="px-1.5 py-0.5 rounded bg-[#2d3748] border border-[#4a5568] font-mono text-[10px]">
                                    ↓
                                </kbd>
                                navigate
                            </span>
                            <span className="flex items-center gap-1">
                                <kbd className="px-1.5 py-0.5 rounded bg-[#2d3748] border border-[#4a5568] font-mono text-[10px]">
                                    esc
                                </kbd>
                                close
                            </span>
                        </div>
                        <span className="text-[10px] text-gray-500">brainlife.io search</span>
                    </div>
                </div>
            )}
        </div>
    );
}
