export interface NavItem {
    title: string;
    href?: string;
    path?: string;
    icon?: string;
    children?: NavItem[];
}

export interface NavSection {
    title: string;
    items: NavItem[];
}

export const DOCS_SECTIONS: NavSection[] = [
    {
        title: 'OVERVIEW',
        items: [
            {
                title: 'Home',
                href: '/',
                icon: 'Home',
                children: [
                    { title: 'What is Brainlife?', href: '/#what-is-brainlife' },
                    { title: 'Key Features', href: '/#key-features' },
                ],
            },
            {
                title: 'ezBIDS',
                href: '/using_ezBIDS',
                path: 'using_ezBIDS.md',
                icon: 'EzBids',
            },
        ],
    },
    {
        title: 'USER GUIDE',
        items: [
            {
                title: 'Using brainlife',
                icon: 'Compass',
                children: [
                    { title: 'Getting Started', href: '/docs/user/started', path: 'user/started.md' },
                    { title: 'Projects', href: '/docs/user/project', path: 'user/project.md' },
                    { title: 'Project Data', href: '/docs/user/archive', path: 'user/archive.md' },
                    { title: 'Datatypes', href: '/docs/user/datatypes', path: 'user/datatypes.md' },
                    { title: 'Processes', href: '/docs/user/process', path: 'user/process.md' },
                    { title: 'Pipelines', href: '/docs/user/pipeline', path: 'user/pipeline.md' },
                    { title: 'Publications', href: '/docs/user/publication', path: 'user/publication.md' },
                    { title: 'Public Datasets', href: '/docs/user/datasets', path: 'user/datasets.md' },
                    { title: 'Group Analysis', href: '/docs/user/groupanalysis', path: 'user/groupanalysis.md' },
                    { title: 'Troubleshooting & Failure', href: '/docs/user/failure', path: 'user/failure.md' },
                ],
            },
            {
                title: 'Tutorials',
                icon: 'GraduationCap',
                children: [
                    { title: 'Introduction', href: '/docs/tutorial/introduction-to-brainlife', path: 'tutorial/introduction-to-brainlife.md' },
                    { title: 'Mobile', href: '/docs/tutorial/mobile', path: 'tutorial/mobile.md' },
                    { title: 'ezBIDS Tutorial', href: '/docs/tutorial/ezBIDS', path: 'tutorial/ezBIDS.md', icon: 'EzBids' },
                    { title: 'Anatomy', href: '/docs/tutorial/t1w-preprocessing', path: 'tutorial/t1w-preprocessing.md' },
                    { title: 'AWS', href: '/docs/tutorial/aws-brainlife', path: 'tutorial/aws-brainlife.md' },
                    { title: 'FMRI Preprocessing', href: '/docs/tutorial/fmri-preprocessing-tutorial', path: 'tutorial/fmri-preprocessing-tutorial.md' },
                    { title: 'PRF Mapping', href: '/docs/tutorial/prf-mapping', path: 'tutorial/prf-mapping.md' },
                    { title: 'DWI Preprocessing', href: '/docs/tutorial/diffusion-preprocessing', path: 'tutorial/diffusion-preprocessing.md' },
                    { title: 'DWI Tractography', href: '/docs/tutorial/diffusion-tractography', path: 'tutorial/diffusion-tractography.md' },
                    { title: 'Cortex Tissue Mapping', href: '/docs/tutorial/cortex-tissue-mapping', path: 'tutorial/cortex-tissue-mapping.md' },
                    { title: 'Structural Network Neuroscience', href: '/docs/tutorial/networkneuroscience-structural', path: 'tutorial/networkneuroscience-structural.md' },
                    { title: 'Functional Network Neuroscience', href: '/docs/tutorial/networkneuroscience-functional', path: 'tutorial/networkneuroscience-functional.md' },
                ],
            },
            {
                title: 'Using CLI',
                icon: 'Terminal',
                children: [
                    { title: 'Installation', href: '/docs/cli/install', path: 'cli/install.md' },
                    { title: 'Uploading Data', href: '/docs/cli/upload', path: 'cli/upload.md' },
                    { title: 'Downloading Data', href: '/docs/cli/download', path: 'cli/download.md' },
                    { title: 'Running Apps', href: '/docs/cli/app', path: 'cli/app.md' },
                    { title: 'Update Data', href: '/docs/cli/update', path: 'cli/update.md' },
                ],
            },
            {
                title: 'Developing Apps',
                icon: 'Code2',
                children: [
                    { title: 'Introduction', href: '/docs/apps/introduction', path: 'apps/introduction.md' },
                    { title: 'HelloWorld', href: '/docs/apps/helloworld', path: 'apps/helloworld.md' },
                    { title: 'Registering App', href: '/docs/apps/register', path: 'apps/register.md' },
                    { title: 'Containerizing App', href: '/docs/apps/container', path: 'apps/container.md' },
                    { title: 'Versioning Tips', href: '/docs/apps/versioning', path: 'apps/versioning.md' },
                    { title: 'Custom Hooks', href: '/docs/apps/customhooks', path: 'apps/customhooks.md' },
                    { title: 'product.json', href: '/docs/apps/product', path: 'apps/product.md' },
                    { title: 'submodules', href: '/docs/apps/submodules', path: 'apps/submodules.md' },
                ],
            },
            {
                title: 'Compute Resources',
                icon: 'Cpu',
                children: [
                    { title: 'Registering Resource', href: '/docs/resources/register', path: 'resources/register.md' },
                ],
            },
        ],
    },
    {
        title: 'REFERENCE',
        items: [
            {
                title: 'Technical',
                icon: 'Sliders',
                children: [
                    { title: 'Architecture', href: '/docs/technical/arthitecture', path: 'technical/arthitecture.md' },
                    { title: 'Task Orchestration (Amaretti)', href: '/docs/technical/amaretti', path: 'technical/amaretti.md' },
                    { title: 'Amaretti REST API', href: '/docs/technical/api', path: 'technical/api.md' },
                    { title: 'ezBIDS', href: '/docs/technical/ezBIDS', path: 'technical/ezBIDS.md' },
                ],
            },
            { title: 'FAQ & Contact', href: '/docs/contact', icon: 'HelpCircle' },
        ],
    },
    {
        title: 'COMMUNITY',
        items: [
            { title: 'Careers', href: '/docs/careers/jobs', path: 'careers/jobs.md', icon: 'Briefcase' },
            { title: 'Contact', href: '/docs/contact', path: 'contact.md', icon: 'Mail' },
            { title: 'Privacy Policy', href: '/docs/privacy', path: 'privacy.md', icon: 'Shield' },
            { title: 'AUP', href: '/docs/aup', path: 'aup.md', icon: 'FileCheck' },
            { title: 'Media / Branding', href: '/docs/media', path: 'media.md', icon: 'Image' },
        ],
    },
];

export const DOCS_NAV: NavItem[] = DOCS_SECTIONS.flatMap((s) => s.items);

export const GITHUB_REPO_URL = 'https://github.com/brainlife/docs-next';
export const SLACK_URL = 'https://brainlife.slack.com';
export const MAIN_SITE_URL = 'https://brainlife.github.io/brainlife.hugo_v2/';

export const getGithubEditUrl = (relativePath: string) =>
    `${GITHUB_REPO_URL}/edit/main/content/${relativePath}`;
