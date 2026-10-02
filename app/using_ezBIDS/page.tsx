import React from 'react';
import fs from 'fs';
import path from 'path';
import { Pencil } from 'lucide-react';
import DocLayout from '@/components/DocLayout';
import { processMarkdown } from '@/lib/markdown';

export const metadata = {
    title: 'ezBIDS User Documentation - brainlife Documentation',
    description: 'Documentation for ezBIDS User Documentation on brainlife.io',
};

export default function EzBidsAliasPage() {
    const filePath = path.join(process.cwd(), 'content', 'using_ezBIDS.md');
    const raw = fs.readFileSync(/*turbopackIgnore: true*/ filePath, 'utf8');
    const { html, headings } = processMarkdown(raw);

    const githubEditUrl = 'https://github.com/brainlife/docs/edit/master/docs/using_ezBIDS.md';

    return (
        <DocLayout headings={headings}>
            <article className="min-w-0">
                <div className="flex items-center justify-end pb-2 mb-4">
                    <a
                        href={githubEditUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs text-gray-500 hover:text-[#2693D8] transition-colors py-1 px-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
                        title="Edit this page on GitHub"
                    >
                        <Pencil size={14} />
                        <span>Edit on GitHub</span>
                    </a>
                </div>

                <div
                    className="prose-docs"
                    dangerouslySetInnerHTML={{ __html: html }}
                />
            </article>
        </DocLayout>
    );
}
