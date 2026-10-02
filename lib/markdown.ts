import { marked } from 'marked';
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

export function processMarkdown(rawMarkdown: string): ProcessedMarkdown {
    const headings: TocHeading[] = [];
    let pageTitle = '';

    // 1. Pre-process admonitions:
    const admonitionRegex = /^!!!\s*(note|info|warning|tip|caution|danger|important)?\s*(.*?)\n((?:(?: {4}|\t).*(?:\n|$))+)/gm;

    let processed = rawMarkdown.replace(admonitionRegex, (_match, type = 'note', title = '', content = '') => {
        const cleanedType = type.toLowerCase();
        const displayTitle = title.trim() || (cleanedType.charAt(0).toUpperCase() + cleanedType.slice(1));
        
        // Strip 4 spaces or 1 tab of indentation from each line
        const unindentedContent = content
            .split('\n')
            .map((line: string) => line.replace(/^( {4}|\t)/, ''))
            .join('\n');

        // Color and icon styles based on type
        let borderClass = 'border-l-4 border-[#2693D8] bg-[#ebf8ff] dark:bg-[#1e293b]/70 text-[#1e3a8a] dark:text-[#93c5fd]';
        let badgeClass = 'text-[#2693D8] dark:text-[#50bfff]';

        if (cleanedType === 'warning' || cleanedType === 'caution') {
            borderClass = 'border-l-4 border-amber-500 bg-amber-50 dark:bg-amber-950/30 text-amber-900 dark:text-amber-200';
            badgeClass = 'text-amber-600 dark:text-amber-400';
        } else if (cleanedType === 'danger') {
            borderClass = 'border-l-4 border-red-500 bg-red-50 dark:bg-red-950/30 text-red-900 dark:text-red-200';
            badgeClass = 'text-red-600 dark:text-red-400';
        } else if (cleanedType === 'tip') {
            borderClass = 'border-l-4 border-emerald-500 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-900 dark:text-emerald-200';
            badgeClass = 'text-emerald-600 dark:text-emerald-400';
        }

        return `\n<div class="my-6 p-4 rounded-r-lg ${borderClass} shadow-xs">
            <div class="font-bold text-sm tracking-wide uppercase mb-1.5 flex items-center gap-1.5 ${badgeClass}">
                <span>${displayTitle}</span>
            </div>
            <div class="text-sm leading-relaxed text-gray-800 dark:text-gray-200 font-normal">
                ${unindentedContent}
            </div>
        </div>\n`;
    });

    // 2. Pre-process image paths:
    processed = processed.replace(/!\[(.*?)\]\((?:\.{1,2}\/)?img\/(.*?)\)/g, '![$1](/img/$2)');
    
    // Also remove mkdocs style tag attributes e.g. {target=_blank}
    processed = processed.replace(/\{target=[^}]+\}/g, '');

    // Configure marked renderer for custom heading IDs, images, and links
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
            1: 'text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight mt-0 mb-6 font-[\'Work_Sans\',sans-serif] pr-28 sm:pr-32',
            2: 'text-2xl font-bold text-gray-900 dark:text-white tracking-tight mt-12 mb-4 pb-2 border-b border-gray-100 dark:border-gray-800 font-[\'Work_Sans\',sans-serif]',
            3: 'text-xl font-bold text-gray-900 dark:text-white mt-8 mb-3 font-[\'Work_Sans\',sans-serif]',
            4: 'text-lg font-semibold text-gray-900 dark:text-white mt-6 mb-2 font-[\'Work_Sans\',sans-serif]',
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
        const imageSrc = getAssetPath(href);
        return `
        <figure class="my-8">
            <div class="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm bg-gray-50 dark:bg-gray-900/50">
                <img src="${imageSrc}" alt="${caption}" class="w-full h-auto object-contain mx-auto block max-h-[600px]" loading="lazy" />
            </div>
            ${caption ? `<figcaption class="mt-2 text-center text-xs text-gray-500 dark:text-gray-400 italic">${caption}</figcaption>` : ''}
        </figure>
        `;
    };

    // Custom link renderer
    renderer.link = ({ href, text, title }: { href: string; text: string; title?: string | null }) => {
        const isExternal = href.startsWith('http://') || href.startsWith('https://');
        const titleAttr = title ? ` title="${title}"` : '';
        const targetAttr = isExternal ? ' target="_blank" rel="noopener noreferrer"' : '';
        
        let finalHref = href;
        if (!isExternal && !href.startsWith('#')) {
            if (!finalHref.startsWith('/')) {
                finalHref = '/' + finalHref;
            }
            finalHref = getAssetPath(finalHref);
        }

        return `<a href="${finalHref}" class="text-[#2693D8] hover:text-[#1d74ae] underline font-medium transition-colors"${targetAttr}${titleAttr}>${text}</a>`;
    };

    // Custom code block renderer
    renderer.code = ({ text }: { text: string; lang?: string }) => {
        return `
        <div class="my-6 rounded-lg overflow-hidden border border-gray-800 bg-[#1e293b] text-gray-100 shadow-md">
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
        title: pageTitle || 'ezBIDS Documentation',
    };
}
