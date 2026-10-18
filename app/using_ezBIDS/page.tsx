import React from 'react';
import fs from 'fs';
import path from 'path';
import { processMarkdown } from '@/lib/markdown';
import { getGithubEditUrl } from '@/lib/docsNavigation';
import EzBidsGuide from '@/components/EzBidsGuide';

export const metadata = {
    title: 'ezBIDS User Documentation - brainlife Documentation',
    description: 'Documentation for ezBIDS User Documentation on brainlife.io',
};

export default function EzBidsAliasPage() {
    const filePath = path.join(process.cwd(), 'content', 'using_ezBIDS.md');
    const raw = fs.readFileSync(/*turbopackIgnore: true*/ filePath, 'utf8');

    // Extract all headings for the Table of Contents from the complete markdown
    const { headings } = processMarkdown(raw, 'using_ezBIDS.md');

    // Slicing markdown to start from step 1, so the Primer and Key Features card
    // appear directly above Step 1 without duplicating the title or lead text.
    const step1Marker = '### 1. Upload Imaging Data';
    const step1Index = raw.indexOf(step1Marker);
    const bodyMarkdown = step1Index !== -1 ? raw.slice(step1Index) : raw;
    const { html: markdownHtml } = processMarkdown(bodyMarkdown, 'using_ezBIDS.md');

    const githubEditUrl = getGithubEditUrl('using_ezBIDS.md');

    return (
        <EzBidsGuide
            markdownHtml={markdownHtml}
            headings={headings}
            githubEditUrl={githubEditUrl}
        />
    );
}
