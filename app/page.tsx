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
    { id: 'what-is-brainlife', text: 'What is brainlife.io?', level: 1 },
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
            '# Run an App on a dataset with the brainlife CLI\nbl app run --id <app-id> --input <input-id>:<dataset-id> --project <project-id>'
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
                            What is brainlife.io?
                        </h1>
                        <p className="text-sm sm:text-base text-bl-muted mt-2 font-normal">
                            Brain data across scales. One place to analyze, share and publish it.
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
                            <strong className="text-bl-ink font-semibold">brainlife.io</strong> is an open platform from The University of Texas at Austin for brain data across scales: electron and light microscopy, PS-OCT, MRI, fMRI, EEG and MEG. You bring data in from your computer or from public archives, run reproducible analyses as Apps on shared supercomputers, look at the results in your browser, and publish them with a DOI. brainlife.io is free for researchers.
                        </p>
                        <p>
                            This page introduces the main ideas in the order you meet them. Each section links to a page with the details. When you are ready, go to <a href={getAssetPath('/docs/user/started')} className="text-bl-accent underline">Getting started</a>.
                        </p>
                    </div>

                    <div className="w-full md:w-56 lg:w-64 h-40 sm:h-48 relative shrink-0 flex items-center justify-center p-2">
                        <Image
                            src={getAssetPath('/brand/brainlife-mark-lightblue-orange-app-on-light.svg')}
                            alt="brainlife.io logo"
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
                            <div className="text-bl-code-muted"># Run an App on a dataset with the brainlife CLI</div>
                            <div>
                                <span className="text-brand-lightblue font-medium">bl app run</span>{' '}
                                <span className="text-bl-code-muted">--id</span>{' '}
                                <span className="text-bl-code-ink">&lt;app-id&gt;</span>{' '}
                                <span className="text-bl-code-muted">--input</span>{' '}
                                <span className="text-brand-orange">&lt;input-id&gt;:&lt;dataset-id&gt;</span>{' '}
                                <span className="text-bl-code-muted">--project</span>{' '}
                                <span className="text-brand-orange">&lt;project-id&gt;</span>
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
                        A project is your workspace. It holds your data, your processing, your notebooks and your publications, and you share it with your team. Each person in a project is an admin, a member or a guest: admins edit the settings, members process data, and guests view. A project is public or private.
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
                        When your results are ready, you publish them. A publication is a citable record with a DOI that describes and shares your results; the DOI is assigned when you create it. A publication can hold releases of your data and the Apps and notebooks that produced them. Find yours under My Publications and everyone&rsquo;s under Public Publications.
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
                            Datatypes are how brainlife.io Apps communicate. A Datatype defines the expected list of filenames or the directory structure that an App can use as input or generate as output. Typically, multiple Apps use the same Datatype to communicate through their input and output datasets and reuse data to generate more data derivatives. Datatypes help join Apps together to form a pipeline or workflows.
                        </p>
                        <p>
                            brainlife.io datatypes are maintained by individual developers and are updated at{' '}
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
                        A dataset is one item of project data: the files of one datatype for one subject (and session). Copy datasets into a project from Public Datasets, which brings together DANDI, EMBER, BossDB, OpenNeuro and the brainlife.io Dataset Library, copy them from another project, or upload your own.
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
                            A resource is a computer, a cluster or a cloud that runs your jobs. Public resources are shared by everyone; you can also register private resources and enable them for your projects. Jobs run on TACC, Jetstream2 and ACCESS. Find them under Public Resources and My Resources in the sidebar.
                        </p>
                        <p>
                            Each resource lists the Apps it runs, with a score; brainlife.io sends each job to the best available resource and tracks success rates and run times for every App.
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
                        You look at data in your browser, without downloading it. Select a dataset and choose a viewer for its datatype, for example NiiVue for volumes, surfaces and streamlines, or Neuroglancer for large microscopy and EM volumes. Some datatypes also offer desktop programs streamed to your browser.
                    </p>
                </section>

                {/* Get Started Callout */}
                <div className="my-8 p-6 rounded-xl bg-bl-code-bar text-bl-code-ink border border-bl-line flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div>
                        <h3 className="text-lg font-semibold m-0 text-bl-code-ink">
                            Are you ready to start using brainlife.io?
                        </h3>
                        <p className="text-xs sm:text-sm text-bl-code-muted m-0 mt-1">
                            Follow the step-by-step guide to set up your account, create a project and run your first App.
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
