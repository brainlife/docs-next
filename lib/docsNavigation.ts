export interface NavItem {
    title: string;
    href?: string;
    path?: string;
    children?: NavItem[];
}

export const DOCS_NAV: NavItem[] = [
    {
        title: 'Home',
        href: '/',
        path: 'index.md',
    },
    {
        title: 'ezBIDS',
        href: '/docs/using_ezBIDS',
        path: 'using_ezBIDS.md',
    },
    {
        title: 'Using brainlife',
        children: [
            { title: 'Getting Started', href: '/docs/user/started', path: 'user/started.md' },
            { title: 'Projects', href: '/docs/user/project', path: 'user/project.md' },
            { title: 'Datatypes', href: '/docs/user/datatypes', path: 'user/datatypes.md' },
            { title: 'Archive', href: '/docs/user/archive', path: 'user/archive.md' },
            { title: 'Preprocess', href: '/docs/user/process', path: 'user/process.md' },
            { title: 'Pipelines', href: '/docs/user/pipeline', path: 'user/pipeline.md' },
            { title: 'Publications', href: '/docs/user/publication', path: 'user/publication.md' },
            { title: 'Datasets', href: '/docs/user/datasets', path: 'user/datasets.md' },
            { title: 'Failure', href: '/docs/user/failure', path: 'user/failure.md' },
        ],
    },
    {
        title: 'Tutorials',
        children: [
            { title: 'Introduction', href: '/docs/tutorial/introduction-to-brainlife', path: 'tutorial/introduction-to-brainlife.md' },
            { title: 'Mobile', href: '/docs/tutorial/mobile', path: 'tutorial/mobile.md' },
            { title: 'ezBIDS', href: '/docs/tutorial/ezBIDS', path: 'tutorial/ezBIDS.md' },
            { title: 'Anatomy', href: '/docs/tutorial/t1w-preprocessing', path: 'tutorial/t1w-preprocessing.md' },
            { title: 'AWS', href: '/docs/tutorial/aws-brainlife', path: 'tutorial/aws-brainlife.md' },
            { title: 'FMRI Preprocessing', href: '/docs/tutorial/fmri-preprocessing-tutorial', path: 'tutorial/fmri-preprocessing-tutorial.md' },
            { title: 'PRF Mapping', href: '/docs/tutorial/prf-mapping', path: 'tutorial/prf-mapping.md' },
            { title: 'DWI Preprocessing', href: '/docs/tutorial/diffusion-preprocessing', path: 'tutorial/diffusion-preprocessing.md' },
            { title: 'DWI Tractometry', href: '/docs/tutorial/diffusion-tractography', path: 'tutorial/diffusion-tractography.md' },
            { title: 'Network Neuroscience - Structural', href: '/docs/tutorial/networkneuroscience-structural', path: 'tutorial/networkneuroscience-structural.md' },
            { title: 'Network Neuroscience - Functional', href: '/docs/tutorial/networkneuroscience-functional', path: 'tutorial/networkneuroscience-functional.md' },
            { title: 'Cortex Tissue Mapping', href: '/docs/tutorial/cortex-tissue-mapping', path: 'tutorial/cortex-tissue-mapping.md' },
            { title: 'Pipeline Tutorial', href: '/docs/tutorial/anat-t1-pipeline-tutorial', path: 'tutorial/anat-t1-pipeline-tutorial.md' },
            { title: 'Clairvoy', href: '/docs/tutorial/using-clairvoy', path: 'tutorial/using-clairvoy.md' },
        ],
    },
    {
        title: 'Using CLI',
        children: [
            { title: 'Installation', href: '/docs/cli/install', path: 'cli/install.md' },
            { title: 'Uploading Data', href: '/docs/cli/upload', path: 'cli/upload.md' },
            { title: 'Running Apps', href: '/docs/cli/app', path: 'cli/app.md' },
            { title: 'Downloading Data', href: '/docs/cli/download', path: 'cli/download.md' },
            { title: 'Update Data', href: '/docs/cli/update', path: 'cli/update.md' },
            { title: 'Group Analysis', href: '/docs/cli/group', path: 'cli/group.md' },
        ],
    },
    {
        title: 'Developing Apps',
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
        children: [
            { title: 'Registering Resource', href: '/docs/resources/register', path: 'resources/register.md' },
        ],
    },
    {
        title: 'Technical',
        children: [
            { title: 'Architecture', href: '/docs/technical/arthitecture', path: 'technical/arthitecture.md' },
            { title: 'APIs', href: '/docs/technical/api', path: 'technical/api.md' },
            { title: 'ezBIDS', href: '/docs/technical/ezBIDS', path: 'technical/ezBIDS.md' },
        ],
    },
    {
        title: 'Careers',
        href: '/docs/careers/jobs',
        path: 'careers/jobs.md',
    },
    {
        title: 'Contact',
        href: '/docs/contact',
        path: 'contact.md',
    },
    {
        title: 'Privacy Policy',
        href: '/docs/privacy',
        path: 'privacy.md',
    },
    {
        title: 'AUP',
        href: '/docs/aup',
        path: 'aup.md',
    },
    {
        title: 'Media / Branding',
        href: '/docs/media',
        path: 'media.md',
    },
];

export const GITHUB_REPO_URL = 'https://github.com/brainlife/docs';
export const SLACK_URL = 'https://brainlife.slack.com';
export const MAIN_SITE_URL = 'https://brainlife.io';
