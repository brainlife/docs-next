import React from 'react';
import fs from 'fs';
import path from 'path';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { Pencil } from 'lucide-react';
import DocLayout from '@/components/DocLayout';
import EzBidsGuide from '@/components/EzBidsGuide';
import { processMarkdown } from '@/lib/markdown';
import { getGithubEditUrl } from '@/lib/docsNavigation';

interface PageProps {
    params: Promise<{
        slug: string[];
    }>;
}

function resolveDocFile(slug: string[]): { filePath: string; relativePath: string } | null {
    const slugPath = slug.join('/');
    const contentDir = path.join(process.cwd(), 'content');

    const candidates = [
        { file: path.join(contentDir, `${slugPath}.md`), rel: `${slugPath}.md` },
        { file: path.join(contentDir, slugPath, 'index.md'), rel: `${slugPath}/index.md` },
    ];

    for (const candidate of candidates) {
        if (fs.existsSync(/*turbopackIgnore: true*/ candidate.file)) {
            return { filePath: candidate.file, relativePath: candidate.rel };
        }
    }

    return null;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params;
    const doc = resolveDocFile(slug);

    if (!doc) {
        return {
            title: 'Page Not Found - brainlife Documentation',
        };
    }

    const raw = fs.readFileSync(/*turbopackIgnore: true*/ doc.filePath, 'utf8');
    const processed = processMarkdown(raw, doc.relativePath);

    return {
        title: `${processed.title} - brainlife Documentation`,
        description: `Documentation for ${processed.title} on brainlife.io`,
    };
}

export async function generateStaticParams() {
    const contentDir = path.join(process.cwd(), 'content');
    const params: { slug: string[] }[] = [];

    function scanDir(dir: string, base: string[] = []) {
        if (!fs.existsSync(dir)) return;
        const entries = fs.readdirSync(dir, { withFileTypes: true });

        for (const entry of entries) {
            if (entry.isDirectory()) {
                scanDir(path.join(dir, entry.name), [...base, entry.name]);
            } else if (entry.name.endsWith('.md')) {
                const nameWithoutExt = entry.name.replace(/\.md$/, '');
                if (nameWithoutExt === 'index' && base.length === 0) {
                    // Root index.md is handled by app/page.tsx
                    continue;
                }
                if (nameWithoutExt === 'index') {
                    params.push({ slug: [...base] });
                } else {
                    params.push({ slug: [...base, nameWithoutExt] });
                }
            }
        }
    }

    scanDir(contentDir);
    return params;
}

export default async function DocPage({ params }: PageProps) {
    const { slug } = await params;
    const doc = resolveDocFile(slug);

    if (!doc) {
        notFound();
    }

    const raw = fs.readFileSync(/*turbopackIgnore: true*/ doc.filePath, 'utf8');
    const { html, headings } = processMarkdown(raw, doc.relativePath);
    const githubEditUrl = getGithubEditUrl(doc.relativePath);

    if (doc.relativePath === 'using_ezBIDS.md') {
        const step1Marker = '### 1. Upload Imaging Data';
        const step1Index = raw.indexOf(step1Marker);
        const bodyMarkdown = step1Index !== -1 ? raw.slice(step1Index) : raw;
        const { html: markdownHtml } = processMarkdown(bodyMarkdown, 'using_ezBIDS.md');

        return (
            <EzBidsGuide
                markdownHtml={markdownHtml}
                headings={headings}
                githubEditUrl={githubEditUrl}
            />
        );
    }

    return (
        <DocLayout headings={headings} githubEditUrl={githubEditUrl}>
            <article className="min-w-0 relative">
                {/* Top Action Bar with GitHub Edit button */}
                <div className="absolute top-1 right-0 z-10">
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

                {/* Optional ezBIDS branding banner */}
                {doc.relativePath.toLowerCase().includes('ezbids') && (
                    <div className="mb-6 flex items-center gap-3 pb-4 border-b border-gray-200 dark:border-gray-800">
                        <img
                            src="/ezbids-logo.svg"
                            alt="ezBIDS Logo"
                            className="h-11 w-auto object-contain"
                        />
                    </div>
                )}

                {/* Rendered Markdown Body */}
                <div
                    className="prose-docs"
                    dangerouslySetInnerHTML={{ __html: html }}
                />
            </article>
        </DocLayout>
    );
}
