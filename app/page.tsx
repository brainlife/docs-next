'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
    Pencil,
    Box,
    Folder,
    Database,
    GitFork,
    FileText,
    ChevronRight,
    ChevronLeft,
    MessageSquare,
    ExternalLink,
    ArrowRight,
    Copy,
    Check,
    Cpu,
    Server,
    Eye,
    Layers,
    BookOpen,
    HardDrive,
    FolderKanban,
} from 'lucide-react';
import DocLayout from '@/components/DocLayout';
import { TocHeading } from '@/components/TableOfContents';
import { getGithubEditUrl, SLACK_URL } from '@/lib/docsNavigation';
import { getAssetPath } from '@/lib/basePath';

const HOME_HEADINGS: TocHeading[] = [
    { id: 'what-is-brainlife', text: 'What is Brainlife?', level: 1 },
    { id: 'apps', text: 'Apps', level: 2 },
    { id: 'projects', text: 'Projects', level: 2 },
    { id: 'publications', text: 'Publications', level: 2 },
    { id: 'datatypes', text: 'Datatypes', level: 2 },
    { id: 'datasets', text: 'Datasets', level: 2 },
    { id: 'resources', text: 'Resources', level: 2 },
    { id: 'visualizations', text: 'Visualizations', level: 2 },
];

export default function HomePage() {
    const [copied, setCopied] = useState(false);

    const handleCopyCode = () => {
        navigator.clipboard.writeText(
            '# Run a brainlife app with the CLI\nbrainlife run <app-id> --input /path/to/data --output /path/to/results'
        );
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <DocLayout headings={HOME_HEADINGS} githubEditUrl={getGithubEditUrl('index.md')}>
            <div className="space-y-6">
                {/* Breadcrumbs */}
                <div className="flex items-center gap-2 text-xs text-bl-muted">
                    <span className="hover:text-bl-ink cursor-pointer">Documentation</span>
                    <span>&gt;</span>
                    <span className="text-bl-ink font-medium">Overview</span>
                </div>

                {/* Page Title & Edit link */}
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <h1
                            id="what-is-brainlife"
                            className="text-3xl sm:text-4xl font-semibold text-bl-ink tracking-tight"
                        >
                            What is Brainlife?
                        </h1>
                        <p className="text-sm sm:text-base text-bl-muted mt-2 font-normal">
                            A platform for reproducible neuroscience powered by open science, cloud computing, and community.
                        </p>
                    </div>

                    <a
                        href={getGithubEditUrl('index.md')}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs text-bl-muted hover:text-bl-accent transition-colors shrink-0 pt-1"
                        title="Edit this page on GitHub"
                    >
                        <Pencil size={13} />
                        <span>Edit this page</span>
                    </a>
                </div>

                {/* Hero Card with Brain graphic */}
                <div className="bg-bl-band border border-bl-line rounded-2xl p-6 sm:p-7 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex-1 text-bl-ink text-xs sm:text-sm leading-relaxed space-y-3">
                        <p>
                            <strong className="text-bl-ink font-semibold">brainlife.io</strong> promotes engagement and education in reproducible neuroscience by providing an online, community-based platform where users can publish code (Apps) and Data while integrating HPC and cloud-computing resources to run Apps. brainlife.io also allows users to publish all of the research assets associated with their projects that are embedded in our cloud-computing environment and referenced by a single digital-object identifier (DOI). Our platform is unique because of its focus on supporting scientific reproducibility beyond open code and open data &mdash; brainlife.io also provides fundamental smart mechanisms for what we call &ldquo;Open Services.&rdquo;
                        </p>
                        <p>
                            Below, you will learn about the main panel of tools you will encounter as soon as you log into brainlife.io. While these run-through are brief, you&rsquo;ll learn much more about each feature as you review the rest of brainlife.io&rsquo;s documentation.
                        </p>
                    </div>

                    <div className="w-full md:w-56 lg:w-64 h-40 sm:h-48 relative shrink-0 flex items-center justify-center p-2">
                        <Image
                            src={getAssetPath('/brand/brainlife-mark-lightblue-orange-app-on-light.svg')}
                            alt="Brainlife Logo"
                            fill
                            className="object-contain dark:hidden"
                            priority
                        />
                        <Image
                            src={getAssetPath('/brand/brainlife-mark-lightblue-orange-app-on-dark.svg')}
                            alt=""
                            fill
                            className="object-contain hidden dark:block"
                        />
                    </div>
                </div>

                {/* 5 Feature Cards Row */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                    {/* Apps Card */}
                    <Link
                        href="#apps"
                        className="bg-bl-surface border border-bl-line hover:border-bl-accent rounded-xl p-3.5 transition-all hover:shadow-sm group flex items-center justify-between"
                    >
                        <div className="space-y-1 min-w-0">
                            <div className="flex items-center gap-2">
                                <Box size={18} className="text-bl-accent shrink-0" />
                                <span className="text-sm font-semibold text-bl-ink truncate">Apps</span>
                            </div>
                            <p className="text-[11px] text-bl-muted truncate">Run and share analysis tools</p>
                        </div>
                        <span className="text-bl-muted font-light pl-2">|</span>
                    </Link>

                    {/* Projects Card */}
                    <Link
                        href="/docs/user/project"
                        className="bg-bl-surface border border-bl-line hover:border-bl-accent rounded-xl p-3.5 transition-all hover:shadow-sm group flex items-center justify-between"
                    >
                        <div className="space-y-1 min-w-0">
                            <div className="flex items-center gap-2">
                                <Folder size={18} className="text-bl-accent shrink-0" />
                                <span className="text-sm font-semibold text-bl-ink truncate">Projects</span>
                            </div>
                            <p className="text-[11px] text-bl-muted truncate">Organize your research</p>
                        </div>
                        <ChevronRight size={14} className="text-bl-muted group-hover:text-bl-ink shrink-0 ml-1" />
                    </Link>

                    {/* Datasets Card */}
                    <Link
                        href="/docs/user/datasets"
                        className="bg-bl-surface border border-bl-line hover:border-bl-accent rounded-xl p-3.5 transition-all hover:shadow-sm group flex items-center justify-between"
                    >
                        <div className="space-y-1 min-w-0">
                            <div className="flex items-center gap-2">
                                <Database size={18} className="text-bl-accent shrink-0" />
                                <span className="text-sm font-semibold text-bl-ink truncate">Datasets</span>
                            </div>
                            <p className="text-[11px] text-bl-muted truncate">Find and publish data with DOIs</p>
                        </div>
                        <ChevronRight size={14} className="text-bl-muted group-hover:text-bl-ink shrink-0 ml-1" />
                    </Link>

                    {/* Pipelines Card */}
                    <Link
                        href="/docs/user/pipeline"
                        className="bg-bl-surface border border-bl-line hover:border-bl-accent rounded-xl p-3.5 transition-all hover:shadow-sm group flex items-center justify-between"
                    >
                        <div className="space-y-1 min-w-0">
                            <div className="flex items-center gap-2">
                                <GitFork size={18} className="text-bl-accent shrink-0" />
                                <span className="text-sm font-semibold text-bl-ink truncate">Pipelines</span>
                            </div>
                            <p className="text-[11px] text-bl-muted truncate">Combine tools into workflows</p>
                        </div>
                        <ChevronRight size={14} className="text-bl-muted group-hover:text-bl-ink shrink-0 ml-1" />
                    </Link>

                    {/* Publications Card */}
                    <Link
                        href="/docs/user/publication"
                        className="bg-bl-surface border border-bl-line hover:border-bl-accent rounded-xl p-3.5 transition-all hover:shadow-sm group flex items-center justify-between"
                    >
                        <div className="space-y-1 min-w-0">
                            <div className="flex items-center gap-2">
                                <FileText size={18} className="text-bl-accent shrink-0" />
                                <span className="text-sm font-semibold text-bl-ink truncate">Publications</span>
                            </div>
                            <p className="text-[11px] text-bl-muted truncate">Track and share your research</p>
                        </div>
                        <ChevronRight size={14} className="text-bl-muted group-hover:text-bl-ink shrink-0 ml-1" />
                    </Link>
                </div>

                {/* Slack Alert Banner */}
                <div className="my-6 p-4 rounded-xl bg-bl-band border-l-4 border-bl-accent flex items-center gap-3 text-xs sm:text-sm text-bl-ink">
                    <MessageSquare size={18} className="text-bl-accent shrink-0" />
                    <p className="m-0 leading-normal">
                        If you have any questions, do not forget to reach out to us on the{' '}
                        <Link
                            href="/docs/contact"
                            className="text-bl-accent hover:underline font-semibold inline-flex items-center gap-1"
                        >
                            brainlife.io slack channel! <ExternalLink size={12} />
                        </Link>
                    </p>
                </div>

                {/* Apps Section */}
                <section className="pt-2">
                    <div className="flex items-center gap-2.5 mb-3">
                        <div className="p-1.5 rounded-lg bg-bl-accent/10 text-bl-accent dark:bg-bl-accent/20">
                            <Cpu size={18} />
                        </div>
                        <h2
                            id="apps"
                            className="text-xl sm:text-2xl font-semibold text-bl-ink tracking-tight m-0"
                        >
                            Apps
                        </h2>
                    </div>

                    <div className="flex flex-col lg:flex-row items-center gap-6 mb-6">
                        <div className="flex-1 text-xs sm:text-sm text-bl-ink leading-relaxed space-y-3">
                            <p>
                                <strong className="text-bl-ink font-medium">brainlife.io</strong> uses Apps to analyze data. Apps are small programs that can process data individually or be made part of a larger series of steps in a full data analysis workflow.
                            </p>
                            <p>
                                Anyone can develop, use, combine, and reuse Apps to build complex pipelines for customized brain data analyses on the platform. You can publish apps to be used privately or shared publicly with the brainlife.io community. Combining multiple Apps allows for high-throughput data processing and aggregation across thousands of datasets.
                            </p>
                        </div>

                        {/* Interactive Workflow Diagram Card */}
                        <div className="w-full lg:w-80 bg-bl-surface border border-bl-line rounded-xl p-5 shrink-0 flex items-center justify-around shadow-sm">
                            {/* Input Data */}
                            <div className="flex flex-col items-center gap-1.5">
                                <div className="p-2.5 rounded-xl bg-bl-accent/10 text-bl-accent">
                                    <Database size={20} />
                                </div>
                                <span className="text-[11px] text-bl-muted font-medium">Input Data</span>
                            </div>

                            {/* Arrow 1 */}
                            <ArrowRight size={16} className="text-bl-muted" />

                            {/* App */}
                            <div className="flex flex-col items-center gap-1.5">
                                <div className="p-2.5 rounded-xl bg-bl-accent text-bl-accent-ink shadow-md shadow-bl-accent/30">
                                    <Box size={20} />
                                </div>
                                <span className="text-[11px] text-bl-ink font-semibold">App</span>
                            </div>

                            {/* Arrow 2 */}
                            <ArrowRight size={16} className="text-bl-muted" />

                            {/* Results */}
                            <div className="flex flex-col items-center gap-1.5">
                                <div className="p-2.5 rounded-xl bg-brand-teal/15 text-brand-teal">
                                    <FileText size={20} />
                                </div>
                                <span className="text-[11px] text-bl-muted font-medium">Results</span>
                            </div>
                        </div>
                    </div>

                    {/* Terminal Code Block */}
                    <div className="bg-bl-code-bg text-bl-code-ink border border-bl-line rounded-xl overflow-hidden font-mono text-xs sm:text-sm">
                        <div className="flex items-center justify-between px-4 py-2 border-b border-bl-code-line bg-bl-code-bar">
                            <span className="px-2 py-0.5 rounded bg-white/10 text-bl-code-muted text-xs font-mono font-medium">
                                bash
                            </span>
                            <button
                                type="button"
                                onClick={handleCopyCode}
                                className="text-bl-code-muted hover:text-bl-code-ink transition-colors flex items-center gap-1.5 text-xs font-sans"
                                title="Copy snippet"
                            >
                                {copied ? (
                                    <>
                                        <Check size={13} className="text-brand-lightblue" />
                                        <span className="text-brand-lightblue">Copied</span>
                                    </>
                                ) : (
                                    <Copy size={13} />
                                )}
                            </button>
                        </div>
                        <div className="p-4 space-y-1.5 overflow-x-auto text-xs sm:text-sm leading-relaxed">
                            <div className="text-bl-code-muted"># Run a brainlife app with the CLI</div>
                            <div>
                                <span className="text-brand-lightblue font-medium">brainlife run</span>{' '}
                                <span className="text-bl-code-ink">&lt;app-id&gt;</span>{' '}
                                <span className="text-bl-code-muted">--input</span>{' '}
                                <span className="text-brand-orange">/path/to/data</span>{' '}
                                <span className="text-bl-code-muted">--output</span>{' '}
                                <span className="text-brand-orange">/path/to/results</span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Section: Projects */}
                <section className="pt-6 border-t border-bl-line">
                    <div className="flex items-center gap-2.5 mb-3">
                        <div className="p-1.5 rounded-lg bg-brand-teal/10 text-brand-teal dark:bg-brand-teal/20">
                            <FolderKanban size={18} />
                        </div>
                        <h2
                            id="projects"
                            className="text-xl sm:text-2xl font-semibold text-bl-ink tracking-tight m-0"
                        >
                            Projects
                        </h2>
                    </div>
                    <p className="text-xs sm:text-sm text-bl-ink leading-relaxed">
                        The best way to manage your data is with brainlife.io&rsquo;s Projects feature. Here you can organize your datasets, perform data processing, and share results with your team by granting varying levels of access to members of your group. Projects can be public or private.
                    </p>
                </section>

                {/* Section: Publications */}
                <section className="pt-6 border-t border-bl-line">
                    <div className="flex items-center gap-2.5 mb-3">
                        <div className="p-1.5 rounded-lg bg-brand-orange/10 text-brand-orange dark:bg-brand-orange/20">
                            <BookOpen size={18} />
                        </div>
                        <h2
                            id="publications"
                            className="text-xl sm:text-2xl font-semibold text-bl-ink tracking-tight m-0"
                        >
                            Publications
                        </h2>
                    </div>
                    <p className="text-xs sm:text-sm text-bl-ink leading-relaxed">
                        Once a Project is mature, the data is analyzed and all the derivatives generated, a portion of the Project can be made public via a brainlife.io publication. A brainlife.io publication creates a snapshot of your datasets and Apps archived on brainlife.io for at least 10 years. Anyone can access your publication page and download your datasets without logging or reuse the Apps and data on brainlife.io.
                    </p>
                </section>

                {/* Section: Datatypes */}
                <section className="pt-6 border-t border-bl-line">
                    <div className="flex items-center gap-2.5 mb-3">
                        <div className="p-1.5 rounded-lg bg-brand-red/10 text-brand-red dark:bg-brand-red/20">
                            <Layers size={18} />
                        </div>
                        <h2
                            id="datatypes"
                            className="text-xl sm:text-2xl font-semibold text-bl-ink tracking-tight m-0"
                        >
                            Datatypes
                        </h2>
                    </div>
                    <div className="text-xs sm:text-sm text-bl-ink leading-relaxed space-y-3">
                        <p>
                            Think of brainlife Datatypes as the way brainlife Apps communicate. A Datatype defines the expected list of filenames or the directory structure that an App can use as input or generate as output. Typically, multiple Apps use the same Datatype to communicate through their input and output datasets and reuse data to generate more data derivatives. Datatypes help join Apps together to form a pipeline or workflows.
                        </p>
                        <p>
                            brainlife Datatypes are maintained by individual developers and are updated at{' '}
                            <a
                                href="https://brainlife.io/datatypes"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-bl-accent hover:underline font-medium"
                            >
                                brainlife.io/datatypes
                            </a>.
                        </p>
                    </div>
                </section>

                {/* Section: Datasets */}
                <section className="pt-6 border-t border-bl-line">
                    <div className="flex items-center gap-2.5 mb-3">
                        <div className="p-1.5 rounded-lg bg-brand-teal/10 text-brand-teal dark:bg-brand-teal/20">
                            <HardDrive size={18} />
                        </div>
                        <h2
                            id="datasets"
                            className="text-xl sm:text-2xl font-semibold text-bl-ink tracking-tight m-0"
                        >
                            Datasets
                        </h2>
                    </div>
                    <p className="text-xs sm:text-sm text-bl-ink leading-relaxed">
                        Our Datasets feature offers more than 300 datasets that users can import. This feature was established as part of a project that brainlife.io is collaborating with DataLad on. brainlife.io&rsquo;s Datasets feature allows you to select and import the DataLad datasets you need from our list.
                    </p>
                </section>

                {/* Section: Resources */}
                <section className="pt-6 border-t border-bl-line">
                    <div className="flex items-center gap-2.5 mb-3">
                        <div className="p-1.5 rounded-lg bg-brand-blue/10 text-brand-blue dark:bg-brand-blue/20">
                            <Server size={18} />
                        </div>
                        <h2
                            id="resources"
                            className="text-xl sm:text-2xl font-semibold text-bl-ink tracking-tight m-0"
                        >
                            Resources
                        </h2>
                    </div>
                    <div className="text-xs sm:text-sm text-bl-ink leading-relaxed space-y-3">
                        <p>
                            We know it takes a lot of computing power to run workflows. That is why brainlife.io allows users to work with data and computers across a mix of cloud systems and high-performance computing clusters (HPC). Both brainlife.io users and compute resource providers can register a compute resource that is publicly available to the entire brainlife.io community or privately available to certain users.
                        </p>
                        <p>
                            Our compute resources are unique because, instead of running an entire workflow on a single resource, App developers can identify the best resource for each individual App by scoring brainlife.io&rsquo;s compute resources on how well they work with each App. brainlife.io automatically keeps track of success rate and time to compute so that users can easily see how efficiently each resource processes data for each App.
                        </p>
                    </div>
                </section>

                {/* Section: Visualizations */}
                <section className="pt-6 border-t border-bl-line">
                    <div className="flex items-center gap-2.5 mb-3">
                        <div className="p-1.5 rounded-lg bg-brand-lightblue/10 text-brand-lightblue dark:bg-brand-lightblue/20">
                            <Eye size={18} />
                        </div>
                        <h2
                            id="visualizations"
                            className="text-xl sm:text-2xl font-semibold text-bl-ink tracking-tight m-0"
                        >
                            Visualizations
                        </h2>
                    </div>
                    <p className="text-xs sm:text-sm text-bl-ink leading-relaxed">
                        Users can perform data visualizations on brainlife.io in the cloud instead of on their own computer, which means better security and data management. Data visualization gives users feedback on the quality of the results generated by Apps and pipelines. The visualizations allow users to run popular software for data visualization like FreeView, FSLview, or MRview. Users can additionally run GPU-rendered visualizations on the cloud through Docker and VNC. Similar to Apps, developers can contribute visualizations to the platform.
                    </p>
                </section>

                {/* Get Started Callout */}
                <div className="my-8 p-6 rounded-xl bg-bl-code-bar text-bl-code-ink border border-bl-line flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div>
                        <h3 className="text-lg font-semibold m-0 text-bl-code-ink">
                            Are you ready to start using brainlife.io?
                        </h3>
                        <p className="text-xs sm:text-sm text-bl-code-muted m-0 mt-1">
                            Follow our step-by-step onboarding guide to set up your account and launch your first pipeline.
                        </p>
                    </div>
                    <Link
                        href="/docs/user/started"
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md bg-brand-lightblue hover:bg-brand-lightblue/90 text-[#0b1a24] font-normal text-sm transition-all flex-shrink-0"
                    >
                        <span>Get started here!</span>
                        <ArrowRight size={16} />
                    </Link>
                </div>

                {/* Previous / Next Pagination Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6 border-t border-bl-line">
                    {/* Previous Card */}
                    <Link
                        href="/"
                        className="bg-bl-surface border border-bl-line hover:border-bl-accent rounded-xl p-4 transition-all hover:shadow-sm group block"
                    >
                        <span className="font-mono text-[11px] text-bl-muted uppercase tracking-[0.14em] block">
                            Previous
                        </span>
                        <div className="flex items-center gap-1.5 text-sm font-semibold text-bl-ink group-hover:text-bl-accent transition-colors mt-1">
                            <ChevronLeft size={16} />
                            <span>Home</span>
                        </div>
                        <span className="text-xs text-bl-muted mt-1 block">
                            Return to the documentation homepage
                        </span>
                    </Link>

                    {/* Next Card */}
                    <Link
                        href="/docs/apps/introduction"
                        className="bg-bl-surface border border-bl-line hover:border-bl-accent rounded-xl p-4 transition-all hover:shadow-sm group block text-right"
                    >
                        <span className="font-mono text-[11px] text-bl-muted uppercase tracking-[0.14em] block">
                            Next
                        </span>
                        <div className="flex items-center justify-end gap-1.5 text-sm font-semibold text-bl-ink group-hover:text-bl-accent transition-colors mt-1">
                            <span>Apps</span>
                            <ChevronRight size={16} />
                        </div>
                        <span className="text-xs text-bl-muted mt-1 block">
                            Learn more about Apps and how to use them
                        </span>
                    </Link>
                </div>
            </div>
        </DocLayout>
    );
}
