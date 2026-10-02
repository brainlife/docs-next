import fs from 'fs';
import path from 'path';

// Clean text by stripping markdown syntax
function stripMarkdown(md) {
    return md
        // Remove code blocks
        .replace(/```[\s\S]*?```/g, ' ')
        // Remove inline code
        .replace(/`([^`]+)`/g, '$1')
        // Remove image tags
        .replace(/!\[.*?\]\(.*?\)/g, ' ')
        // Remove links, keep text
        .replace(/\[([^\]]+)\]\(.*?\)/g, '$1')
        // Remove markdown attribute tags like {target=_blank}
        .replace(/\{[^}]+\}/g, ' ')
        // Remove HTML tags
        .replace(/<[^>]*>/g, ' ')
        // Remove admonitions markers like !!! note "Title"
        .replace(/!!!\s*\w*\s*(?:"[^"]*")?/g, ' ')
        // Remove headers markers
        .replace(/#{1,6}\s+/g, ' ')
        // Remove emphasis (*, _, **)
        .replace(/(\*\*|__)(.*?)\1/g, '$2')
        .replace(/(\*|_)(.*?)\1/g, '$2')
        // Remove blockquotes
        .replace(/^\s*>\s+/gm, ' ')
        // Normalize whitespace
        .replace(/\s+/g, ' ')
        .trim();
}

function slugify(text) {
    return text
        .toLowerCase()
        .replace(/<[^>]*>/g, '')
        .replace(/[^a-z0-9\s-]/g, '')
        .trim()
        .replace(/\s+/g, '-');
}

// Category mapping based on directory or nav
const CATEGORY_MAP = {
    user: 'Using brainlife',
    tutorial: 'Tutorials',
    cli: 'Using CLI',
    apps: 'Developing Apps',
    resources: 'Compute Resources',
    technical: 'Technical',
    careers: 'Careers',
};

function getCategory(relPath) {
    const parts = relPath.split('/');
    if (parts.length > 1 && CATEGORY_MAP[parts[0]]) {
        return CATEGORY_MAP[parts[0]];
    }
    if (relPath === 'using_ezBIDS.md') return 'ezBIDS';
    if (relPath === 'index.md') return 'Overview';
    return 'General';
}

function getUrl(relPath) {
    if (relPath === 'index.md') return '/';
    if (relPath === 'using_ezBIDS.md') return '/using_ezBIDS/';
    const withoutExt = relPath.replace(/\.md$/, '');
    return `/docs/${withoutExt}/`;
}

function parseMarkdownSections(relPath, content) {
    const lines = content.split('\n');
    const sections = [];
    const category = getCategory(relPath);
    const baseUrl = getUrl(relPath);

    let docTitle = '';
    let currentSection = '';
    let currentAnchor = '';
    let currentTextLines = [];

    function saveSection() {
        if (!currentSection && currentTextLines.length === 0) return;
        const rawText = currentTextLines.join(' ');
        const clean = stripMarkdown(rawText);
        if (clean.length > 0 || currentSection.length > 0) {
            sections.push({
                id: `${baseUrl}${currentAnchor ? '#' + currentAnchor : ''}`,
                url: `${baseUrl}${currentAnchor ? '#' + currentAnchor : ''}`,
                pageTitle: docTitle || 'Documentation',
                section: currentSection || docTitle || 'Overview',
                category,
                content: clean.slice(0, 1500), // Index first 1500 chars of each section for fast search
            });
        }
        currentTextLines = [];
    }

    for (const line of lines) {
        const hMatch = line.match(/^(#{1,3})\s+(.*)$/);
        if (hMatch) {
            const depth = hMatch[1].length;
            const headingText = hMatch[2].replace(/\*\*|__|\*|_/g, '').trim();

            if (depth === 1 && !docTitle) {
                docTitle = headingText;
            }

            saveSection();
            currentSection = headingText;
            currentAnchor = slugify(headingText);
        } else {
            currentTextLines.push(line);
        }
    }

    saveSection();
    return sections;
}

function scanDir(dir, baseRel = '') {
    let results = [];
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        const relPath = baseRel ? `${baseRel}/${entry.name}` : entry.name;

        if (entry.isDirectory()) {
            if (entry.name !== 'img' && entry.name !== 'mov' && entry.name !== 'css') {
                results = results.concat(scanDir(fullPath, relPath));
            }
        } else if (entry.name.endsWith('.md')) {
            const content = fs.readFileSync(fullPath, 'utf8');
            const sections = parseMarkdownSections(relPath, content);
            results = results.concat(sections);
        }
    }

    return results;
}

export function generateSearchIndex() {
    const contentDir = path.join(process.cwd(), 'content');
    const publicDir = path.join(process.cwd(), 'public');

    console.log('Generating search index from:', contentDir);
    const index = scanDir(contentDir);

    if (!fs.existsSync(publicDir)) {
        fs.mkdirSync(publicDir, { recursive: true });
    }

    const outputPath = path.join(publicDir, 'search-index.json');
    fs.writeFileSync(outputPath, JSON.stringify(index, null, 2), 'utf8');
    console.log(`Successfully indexed ${index.length} sections to ${outputPath}`);
}

generateSearchIndex();
