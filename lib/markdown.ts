import { marked } from 'marked';
import path from 'path';
import { TocHeading } from '@/components/TableOfContents';
import { getAssetPath } from '@/lib/basePath';

export interface ProcessedMarkdown {
    html: string;
    headings: TocHeading[];
    title: string;
}

// Generate a clean slug from heading text
function slugify(text: string): string {
    return text
        .toLowerCase()
        .replace(/<[^>]*>/g, '') // remove HTML tags
        .replace(/[^a-z0-9\s-]/g, '') // remove non-alphanumeric chars
        .trim()
        .replace(/\s+/g, '-'); // replace spaces with hyphens
}

// Parse MkDocs-style admonitions line-by-line
function parseAdmonitions(text: string): string {
    const lines = text.split('\n');
    const output: string[] = [];
    let i = 0;

    while (i < lines.length) {
        const line = lines[i];
        const match = line.match(/^(\s*)!!!\s*([a-zA-Z0-9_-]+)(?:\s+(.*))?$/);

        if (match) {
            const baseIndent = match[1];
            const type = match[2].toLowerCase();
            let rawTitle = (match[3] || '').trim();
            // Remove surrounding quotes if present
            if (
                (rawTitle.startsWith('"') && rawTitle.endsWith('"')) ||
                (rawTitle.startsWith("'") && rawTitle.endsWith("'"))
            ) {
                rawTitle = rawTitle.slice(1, -1);
            }
            const displayTitle = rawTitle || (type.charAt(0).toUpperCase() + type.slice(1));

            i++;
            // Skip initial empty lines between header and content
            while (i < lines.length && lines[i].trim() === '') {
                i++;
            }

            const contentLines: string[] = [];
            let minIndent: number | null = null;

            if (i < lines.length) {
                const indentMatch = lines[i].match(/^(\s+)/);
                if (indentMatch && indentMatch[1].length > baseIndent.length) {
                    minIndent = indentMatch[1].length;
                }
            }

            if (minIndent !== null) {
                while (i < lines.length) {
                    const cLine = lines[i];
                    if (cLine.trim() === '') {
                        contentLines.push('');
                        i++;
                        continue;
                    }
                    const cIndent = (cLine.match(/^(\s+)/) || ['', ''])[1].length;
                    if (cIndent >= minIndent) {
                        contentLines.push(cLine.slice(minIndent));
                        i++;
                    } else {
                        break;
                    }
                }
            }

            let borderClass = 'border-l-4 border-[#2693D8] bg-[#ebf8ff] dark:bg-[#1e293b]/70 text-[#1e3a8a] dark:text-[#93c5fd]';
            let badgeClass = 'text-[#2693D8] dark:text-[#50bfff]';

            if (['warning', 'caution', 'disclaimer'].includes(type)) {
                borderClass = 'border-l-4 border-amber-500 bg-amber-50 dark:bg-amber-950/30 text-amber-900 dark:text-amber-200';
                badgeClass = 'text-amber-600 dark:text-amber-400';
            } else if (['danger', 'error'].includes(type)) {
                borderClass = 'border-l-4 border-red-500 bg-red-50 dark:bg-red-950/30 text-red-900 dark:text-red-200';
                badgeClass = 'text-red-600 dark:text-red-400';
            } else if (['tip', 'hint'].includes(type)) {
                borderClass = 'border-l-4 border-emerald-500 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-900 dark:text-emerald-200';
                badgeClass = 'text-emerald-600 dark:text-emerald-400';
            }

            const body = contentLines.join('\n').trim();
            output.push(`\n<div class="my-6 p-4 rounded-r-lg ${borderClass} shadow-xs">
<div class="font-bold text-sm tracking-wide uppercase mb-1.5 flex items-center gap-1.5 ${badgeClass}">
<span>${displayTitle}</span>
</div>
<div class="text-sm leading-relaxed text-gray-800 dark:text-gray-200 font-normal">

${body}

</div>
</div>\n`);
        } else {
            output.push(line);
            i++;
        }
    }

    return output.join('\n');
}

// Process footnotes: [^1] and [^1]: definition
function processFootnotes(markdown: string): string {
    const footnoteDefs: Record<string, string> = {};

    let cleaned = markdown.replace(/^\[\^(\w+)\]:\s*(.*(?:\n(?: {4}|\t).*)*)/gm, (_m, id, text) => {
        footnoteDefs[id] = text.trim();
        return '';
    });

    const ids = Object.keys(footnoteDefs);
    if (ids.length === 0) return markdown;

    cleaned = cleaned.replace(/\[\^(\w+)\]/g, (_m, id) => {
        if (footnoteDefs[id]) {
            return `<sup class="footnote-ref"><a href="#fn-${id}" id="fnref-${id}" class="text-[#2693D8] hover:underline font-semibold">[${id}]</a></sup>`;
        }
        return _m;
    });

    let footnotesHtml = '\n\n<div class="mt-12 pt-6 border-t border-gray-200 dark:border-gray-800 text-sm text-gray-600 dark:text-gray-400"><ol class="list-decimal pl-5 space-y-2">';
    for (const id of ids) {
        footnotesHtml += `\n<li id="fn-${id}">${footnoteDefs[id]} <a href="#fnref-${id}" class="text-[#2693D8] hover:underline font-bold" aria-label="Back to reference">↩</a></li>`;
    }
    footnotesHtml += '\n</ol></div>\n';

    return cleaned + footnotesHtml;
}

// Resolve any internal markdown or asset link
function resolveInternalLink(href: string, currentFile: string): string {
    const isExternal =
        href.startsWith('http://') ||
        href.startsWith('https://') ||
        href.startsWith('//') ||
        href.startsWith('mailto:') ||
        href.startsWith('tel:');

    if (isExternal || href.startsWith('#')) {
        return href;
    }

    const [target, hash] = href.split('#');
    const hashPart = hash ? `#${hash}` : '';

    // Handle static assets (images, PDFs, media)
    if (/\.(pdf|png|jpe?g|gif|svg|zip|tar\.gz|mp4|webm)$/i.test(target)) {
        let clean = target.replace(/^(\.\.\/)+/, '').replace(/^\.\//, '').replace(/^\//, '');
        if (!clean.startsWith('img/') && !clean.startsWith('mov/')) {
            clean = path.posix.join(path.posix.dirname(currentFile || ''), clean);
        }
        return getAssetPath(`/${clean}${hashPart}`);
    }

    // Markdown or route link
    let normalized = target;
    if (normalized.endsWith('.md')) {
        normalized = normalized.slice(0, -3);
    }

    if (normalized.startsWith('/')) {
        if (normalized === '/' || normalized === '/docs' || normalized === '/docs/') {
            return getAssetPath(`/${hashPart}`);
        }
        if (!normalized.startsWith('/docs/')) {
            normalized = '/docs' + normalized;
        }
        return getAssetPath(`${normalized.replace(/\/$/, '')}${hashPart}`);
    }

    // Relative path to current markdown file
    const currentDir = path.posix.dirname(currentFile || '');
    const resolved = path.posix.normalize(path.posix.join(currentDir, normalized));
    if (resolved === 'index' || resolved === '.') {
        return getAssetPath(`/${hashPart}`);
    }
    return getAssetPath(`/docs/${resolved}${hashPart}`);
}

export function processMarkdown(rawMarkdown: string, currentDocRelPath: string = ''): ProcessedMarkdown {
    const headings: TocHeading[] = [];
    let pageTitle = '';

    // 1. Pre-process admonitions
    let processed = parseAdmonitions(rawMarkdown);

    // 2. Pre-process footnotes
    processed = processFootnotes(processed);

    // 3. Pre-process image paths
    processed = processed.replace(/!\[(.*?)\]\((?:\.{1,2}\/)?img\/(.*?)\)/g, '![$1](/img/$2)');

    // 4. Remove mkdocs style tag attributes e.g. {target=_blank}
    processed = processed.replace(/\{target=[^}]+\}/g, '');

    // 5. Pre-process fontawesome shortcodes
    processed = processed
        .replace(/\(?:fa-eye:\)?/g, '<svg class="inline-block w-4 h-4 align-text-bottom mx-0.5 text-[#2693D8]" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>')
        .replace(/\(?:fa-archive:\)?/g, '<svg class="inline-block w-4 h-4 align-text-bottom mx-0.5 text-[#2693D8]" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg>')
        .replace(/\(?:fa-download:\)?/g, '<svg class="inline-block w-4 h-4 align-text-bottom mx-0.5 text-[#2693D8]" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>')
        .replace(/\(?:fa-calendar:\)?/g, '<svg class="inline-block w-4 h-4 align-text-bottom mx-0.5 text-gray-500" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>')
        .replace(/\(?:fa-star:\)?/g, '<svg class="inline-block w-4 h-4 align-text-bottom mx-0.5 text-yellow-400 fill-yellow-400" viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>');

    // Configure marked renderer for custom heading IDs, images, links, and code
    const renderer = new marked.Renderer();

    // Custom heading renderer to collect TOC items and add IDs
    renderer.heading = ({ text, depth }: { text: string; depth: number }) => {
        const cleanText = text.replace(/\*\*(.*?)\*\*/g, '$1').replace(/\*(.*?)\*/g, '$1');
        const id = slugify(cleanText);

        if (depth === 1 && !pageTitle) {
            pageTitle = cleanText;
        }

        if (depth <= 3 && id) {
            headings.push({
                id,
                text: cleanText,
                level: depth,
            });
        }

        const headingClasses: Record<number, string> = {
            1: "text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight mt-0 mb-6 font-['Work_Sans',sans-serif] pr-28 sm:pr-32",
            2: "text-2xl font-bold text-gray-900 dark:text-white tracking-tight mt-12 mb-4 pb-2 border-b border-gray-100 dark:border-gray-800 font-['Work_Sans',sans-serif]",
            3: "text-xl font-bold text-gray-900 dark:text-white mt-8 mb-3 font-['Work_Sans',sans-serif]",
            4: "text-lg font-semibold text-gray-900 dark:text-white mt-6 mb-2 font-['Work_Sans',sans-serif]",
            5: 'text-base font-semibold text-gray-900 dark:text-white mt-4 mb-2',
            6: 'text-sm font-semibold text-gray-900 dark:text-white mt-4 mb-2',
        };

        const className = headingClasses[depth] || '';

        return `<h${depth} id="${id}" class="${className} scroll-mt-24 group flex items-center justify-between">
            <span>${cleanText}</span>
            <a href="#${id}" class="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-[#2693D8] transition-opacity ml-2 text-sm font-normal" aria-label="Link to section">#</a>
        </h${depth}>`;
    };

    // Custom image renderer with captions
    renderer.image = ({ href, title, text }: { href: string; title?: string | null; text: string }) => {
        const caption = text || title || '';
        let imageSrc = href;
        if (!href.startsWith('http://') && !href.startsWith('https://') && !href.startsWith('//')) {
            imageSrc = getAssetPath(href);
        }

        return `
        <figure class="my-8">
            <div class="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm bg-gray-50 dark:bg-gray-900/50">
                <img src="${imageSrc}" alt="${caption}" class="w-full h-auto object-contain mx-auto block max-h-[650px]" loading="lazy" />
            </div>
            ${caption ? `<figcaption class="mt-2 text-center text-xs text-gray-500 dark:text-gray-400 italic">${caption}</figcaption>` : ''}
        </figure>
        `;
    };

    // Custom link renderer
    renderer.link = ({ href, text, title }: { href: string; text: string; title?: string | null }) => {
        const isExternal =
            href.startsWith('http://') ||
            href.startsWith('https://') ||
            href.startsWith('//') ||
            href.startsWith('mailto:');
        const titleAttr = title ? ` title="${title}"` : '';
        const targetAttr = isExternal ? ' target="_blank" rel="noopener noreferrer"' : '';
        const finalHref = resolveInternalLink(href, currentDocRelPath);

        return `<a href="${finalHref}" class="text-[#2693D8] hover:text-[#1d74ae] underline font-medium transition-colors"${targetAttr}${titleAttr}>${text}</a>`;
    };

    // Custom code block renderer with optional language header
    renderer.code = ({ text, lang }: { text: string; lang?: string }) => {
        return `
        <div class="my-6 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-800 bg-[#1e293b] text-gray-100 shadow-sm">
            ${lang ? `<div class="px-4 py-1.5 bg-[#0f172a] text-xs font-mono text-gray-400 border-b border-gray-800 flex justify-between items-center uppercase tracking-wider"><span>${lang}</span></div>` : ''}
            <pre class="p-4 text-xs font-mono overflow-x-auto leading-relaxed"><code>${text}</code></pre>
        </div>
        `;
    };

    // Parse markdown to HTML synchronously
    const rawHtml = marked.parse(processed, {
        renderer,
        gfm: true,
        breaks: false,
    }) as string;

    return {
        html: rawHtml,
        headings,
        title: pageTitle || 'brainlife Documentation',
    };
}

