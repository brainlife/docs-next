import React from 'react';
import Link from 'next/link';
import {
    Pencil,
    Cpu,
    FolderKanban,
    BookOpen,
    Database,
    HardDrive,
    Server,
    Eye,
    MessageSquare,
    ArrowRight,
} from 'lucide-react';
import DocLayout from '@/components/DocLayout';
import { TocHeading } from '@/components/TableOfContents';
import { getGithubEditUrl } from '@/lib/docsNavigation';

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
    return (
        <DocLayout headings={HOME_HEADINGS}>
            <article className="prose prose-slate dark:prose-invert max-w-none">
                {/* Header Title with Edit link */}
                <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-800 pb-5 mb-8">
                    <h1
                        id="what-is-brainlife"
                        className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight font-['Work_Sans',sans-serif] m-0"
                    >
                        What is Brainlife?
                    </h1>
                    <a
                        href={getGithubEditUrl('index.md')}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 text-gray-400 hover:text-[#2693D8] transition-colors rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
                        title="Edit this page on GitHub"
                        aria-label="Edit this page on GitHub"
                    >
                        <Pencil size={18} />
                    </a>
                </div>

                {/* Introduction Paragraphs */}
                <div className="text-base text-gray-700 dark:text-gray-300 leading-relaxed space-y-4 mb-8">
                    <p>
                        <strong className="text-gray-900 dark:text-white font-semibold">brainlife.io</strong> promotes engagement and education in reproducible neuroscience by providing an online, community-based platform where users can publish code (Apps) and Data while integrating HPC and cloud-computing resources to run Apps. brainlife.io also allows users to publish all of the research assets associated with their projects that are embedded in our cloud-computing environment and referenced by a single digital-object identifier (DOI). Our platform is unique because of its focus on supporting scientific reproducibility beyond open code and open data &mdash; brainlife.io also provides fundamental smart mechanisms for what we call &ldquo;Open Services.&rdquo;
                    </p>
                    <p>
                        Below, you will learn about the main panel of tools you will encounter as soon as you log into brainlife.io. While these run-through are brief, you&rsquo;ll learn much more about each feature as you review the rest of brainlife.io&rsquo;s documentation.
                    </p>
                </div>

                {/* Slack Callout */}
                <div className="my-6 p-4 rounded-lg bg-[#ebf8ff] dark:bg-[#1e293b] border-l-4 border-[#2693D8] flex items-start gap-3">
                    <MessageSquare size={20} className="text-[#2693D8] flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-gray-800 dark:text-gray-200 m-0 leading-normal">
                        If you have any questions, do not forget to reach out to us on the{' '}
                        <Link
                            href="/docs/contact"
                            className="font-semibold text-[#2693D8] hover:text-[#1d74ae] underline"
                        >
                            brainlife.io slack channel
                        </Link>
                        !
                    </p>
                </div>

                {/* Section: Apps */}
                <section className="mt-12 pt-6 border-t border-gray-100 dark:border-gray-800/60">
                    <div className="flex items-center gap-2.5 mb-3">
                        <div className="p-1.5 rounded-md bg-[#486c98]/10 text-[#486c98]">
                            <Cpu size={20} />
                        </div>
                        <h2
                            id="apps"
                            className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight m-0 font-['Work_Sans',sans-serif]"
                        >
                            Apps
                        </h2>
                    </div>
                    <div className="text-base text-gray-700 dark:text-gray-300 leading-relaxed space-y-3">
                        <p>
                            brainlife.io uses Apps to analyze data. Apps are small programs that can process data individually or be made part of a larger series of steps in a full data analysis workflow.
                        </p>
                        <p>
                            Anyone can develop, use, combine, and reuse Apps to build complex pipelines for customized brain data analyses on the platform. You can publish apps to be used privately or shared publicly with the brainlife.io community. Combining multiple Apps allows for high-throughput data processing and aggregation across thousands of datasets.
                        </p>
                    </div>
                </section>

                {/* Section: Projects */}
                <section className="mt-12 pt-6 border-t border-gray-100 dark:border-gray-800/60">
                    <div className="flex items-center gap-2.5 mb-3">
                        <div className="p-1.5 rounded-md bg-[#3a6f7c]/10 text-[#3a6f7c]">
                            <FolderKanban size={20} />
                        </div>
                        <h2
                            id="projects"
                            className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight m-0 font-['Work_Sans',sans-serif]"
                        >
                            Projects
                        </h2>
                    </div>
                    <p className="text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                        The best way to manage your data is with brainlife.io&rsquo;s Projects feature. Here you can organize your datasets, perform data processing, and share results with your team by granting varying levels of access to members of your group. Projects can be public or private.
                    </p>
                </section>

                {/* Section: Publications */}
                <section className="mt-12 pt-6 border-t border-gray-100 dark:border-gray-800/60">
                    <div className="flex items-center gap-2.5 mb-3">
                        <div className="p-1.5 rounded-md bg-[#685d4a]/10 text-[#685d4a]">
                            <BookOpen size={20} />
                        </div>
                        <h2
                            id="publications"
                            className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight m-0 font-['Work_Sans',sans-serif]"
                        >
                            Publications
                        </h2>
                    </div>
                    <p className="text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                        Once a Project is mature, the data is analyzed and all the derivatives generated, a portion of the Project can be made public via a brainlife.io publication. A brainlife.io publication creates a snapshot of your datasets and Apps archived on brainlife.io for at least 10 years. Anyone can access your publication page and download your datasets without logging or reuse the Apps and data on brainlife.io.
                    </p>
                </section>

                {/* Section: Datatypes */}
                <section className="mt-12 pt-6 border-t border-gray-100 dark:border-gray-800/60">
                    <div className="flex items-center gap-2.5 mb-3">
                        <div className="p-1.5 rounded-md bg-[#5c4f6e]/10 text-[#5c4f6e]">
                            <Database size={20} />
                        </div>
                        <h2
                            id="datatypes"
                            className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight m-0 font-['Work_Sans',sans-serif]"
                        >
                            Datatypes
                        </h2>
                    </div>
                    <div className="text-base text-gray-700 dark:text-gray-300 leading-relaxed space-y-3">
                        <p>
                            Think of brainlife Datatypes as the way brainlife Apps communicate. A Datatype defines the expected list of filenames or the directory structure that an App can use as input or generate as output. Typically, multiple Apps use the same Datatype to communicate through their input and output datasets and reuse data to generate more data derivatives. Datatypes help join Apps together to form a pipeline or workflows.
                        </p>
                        <p>
                            brainlife Datatypes are maintained by individual developers and are updated at{' '}
                            <a
                                href="https://brainlife.io/datatypes"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[#2693D8] hover:underline font-medium"
                            >
                                brainlife.io/datatypes
                            </a>.
                        </p>
                    </div>
                </section>

                {/* Section: Datasets */}
                <section className="mt-12 pt-6 border-t border-gray-100 dark:border-gray-800/60">
                    <div className="flex items-center gap-2.5 mb-3">
                        <div className="p-1.5 rounded-md bg-[#3a6f7c]/10 text-[#3a6f7c]">
                            <HardDrive size={20} />
                        </div>
                        <h2
                            id="datasets"
                            className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight m-0 font-['Work_Sans',sans-serif]"
                        >
                            Datasets
                        </h2>
                    </div>
                    <p className="text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                        Our Datasets feature offers more than 300 datasets that users can import. This feature was established as part of a project that brainlife.io is collaborating with DataLad on. brainlife.io&rsquo;s Datasets feature allows you to select and import the DataLad datasets you need from our list.
                    </p>
                </section>

                {/* Section: Resources */}
                <section className="mt-12 pt-6 border-t border-gray-100 dark:border-gray-800/60">
                    <div className="flex items-center gap-2.5 mb-3">
                        <div className="p-1.5 rounded-md bg-[#5c8a6c]/10 text-[#5c8a6c]">
                            <Server size={20} />
                        </div>
                        <h2
                            id="resources"
                            className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight m-0 font-['Work_Sans',sans-serif]"
                        >
                            Resources
                        </h2>
                    </div>
                    <div className="text-base text-gray-700 dark:text-gray-300 leading-relaxed space-y-3">
                        <p>
                            We know it takes a lot of computing power to run workflows. That is why brainlife.io allows users to work with data and computers across a mix of cloud systems and high-performance computing clusters (HPC). Both brainlife.io users and compute resource providers can register a compute resource that is publicly available to the entire brainlife.io community or privately available to certain users.
                        </p>
                        <p>
                            Our compute resources are unique because, instead of running an entire workflow on a single resource, App developers can identify the best resource for each individual App by scoring brainlife.io&rsquo;s compute resources on how well they work with each App. brainlife.io automatically keeps track of success rate and time to compute so that users can easily see how efficiently each resource processes data for each App.
                        </p>
                    </div>
                </section>

                {/* Section: Visualizations */}
                <section className="mt-12 pt-6 border-t border-gray-100 dark:border-gray-800/60">
                    <div className="flex items-center gap-2.5 mb-3">
                        <div className="p-1.5 rounded-md bg-[#486c98]/10 text-[#486c98]">
                            <Eye size={20} />
                        </div>
                        <h2
                            id="visualizations"
                            className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight m-0 font-['Work_Sans',sans-serif]"
                        >
                            Visualizations
                        </h2>
                    </div>
                    <p className="text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                        Users can perform data visualizations on brainlife.io in the cloud instead of on their own computer, which means better security and data management. Data visualization gives users feedback on the quality of the results generated by Apps and pipelines. The visualizations allow users to run popular software for data visualization like FreeView, FSLview, or MRview. Users can additionally run GPU-rendered visualizations on the cloud through Docker and VNC. Similar to Apps, developers can contribute visualizations to the platform.
                    </p>
                </section>

                {/* Bottom CTA */}
                <div className="mt-12 p-6 rounded-xl bg-gradient-to-r from-[#2d3748] to-[#1a202c] text-white shadow-md flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div>
                        <h3 className="text-lg font-bold font-['Work_Sans',sans-serif] m-0 text-white">
                            Ready to start using brainlife.io?
                        </h3>
                        <p className="text-sm text-gray-300 m-0 mt-1">
                            Follow our step-by-step onboarding guide to set up your account and launch your first pipeline.
                        </p>
                    </div>
                    <Link
                        href="/docs/user/started"
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#2693D8] hover:bg-[#1d74ae] text-white font-semibold text-sm transition-all shadow-md hover:shadow-[#2693D8]/30 flex-shrink-0"
                    >
                        <span>Get Started</span>
                        <ArrowRight size={16} />
                    </Link>
                </div>
            </article>
        </DocLayout>
    );
}
