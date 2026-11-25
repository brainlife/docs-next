<style> #disqus_thread, #__comments { display: none } </style>

<a id="what-is-brainlife"></a>

# What is brainlife.io?

**Brain data across scales. One place to analyze, share and publish it.**

brainlife.io is an open platform from The University of Texas at Austin for brain data across scales: electron and light microscopy, PS-OCT, MRI, fMRI, EEG and MEG. You bring data in from your computer or from public archives, run reproducible analyses as **Apps** on shared supercomputers, look at the results in your browser, and publish them with a DOI. brainlife.io is free for researchers.

This page introduces the main ideas in the order you meet them. Each section links to a page with the details. When you are ready, go to [Getting started](/docs/user/started/).

If you have questions, see [Contact](/docs/contact/) for email and the brainlife.io Slack.

# Projects

A project is your workspace. It holds your data, your processing, your notebooks and your publications, and you share it with your team. Each person in a project is an admin, a member or a guest: admins edit the settings, members process data, and guests view. A project is public or private.

To find your projects, select **My Projects** in the sidebar. To browse projects that others share, select **Public Projects**. See [Projects](/docs/user/project/).

# Datasets

A dataset is one item of project data: the files of one datatype for one subject (and session), for example the T1-weighted image of subject 01. You add datasets to a project in three ways:

- Copy them from **Public Datasets**, which brings together DANDI, EMBER, BossDB, OpenNeuro and the brainlife.io **Dataset Library**. See [Public Datasets](/docs/user/datasets/).
- Copy them from another project.
- Upload your own data. See [Project data](/docs/user/archive/) for the upload routes that work today.

# Datatypes

A datatype describes which files a dataset contains, so that Apps can exchange data. An App declares the datatypes it takes in and the datatypes it produces, so the output of one App can be the input of the next. Browse them under **Datatypes** in the sidebar. See [Datatypes](/docs/user/datatypes/).

# Apps

An App is a containerized program, built from a GitHub repository, that takes datatypes in and produces datatypes out. Any GitHub repository can become an App. Commonly used tools such as FreeSurfer, FSL, MRtrix3, DIPY, fMRIPrep, QSIPrep and ANTs run as Apps, along with hundreds of others in the **Apps** catalog.

You run Apps in a project in two ways:

- **Processes**: choose data and Apps by hand, one step at a time. See [Processes](/docs/user/process/).
- **Pipeline**: add automations that run an App for every subject and session that has the inputs. See [Pipelines](/docs/user/pipeline/).

To write your own App, see [Developing Apps](/docs/apps/introduction/).

# Resources

A resource is a computer, a cluster or a cloud, that runs your jobs. Public resources are shared by everyone; you can also register private resources and enable them for your projects. Jobs run on TACC, Jetstream2 and ACCESS. See **Public Resources** and **My Resources** in the sidebar, and [Registering a resource](/docs/resources/register/).

# Visualizations

You look at data in your browser, without downloading it. Select a dataset and choose a viewer for its datatype, for example NiiVue for volumes, surfaces and streamlines, or Neuroglancer for large microscopy and EM volumes. Some datatypes also offer desktop programs streamed to your browser. See [Datatypes](/docs/user/datatypes/#look-at-a-dataset).

# Publications

When your results are ready, you publish them. A publication is a citable record with a DOI that describes and shares your results; the DOI is assigned when you create it. A publication can hold releases of your data and the Apps and notebooks that produced them. Find yours under **My Publications** and everyone's under **Public Publications**. See [Publications](/docs/user/publication/).

# Analysis

Each project can launch Jupyter notebooks against its data, from a blank template or from a notebook published with a publication. See [Analysis with notebooks](/docs/user/groupanalysis/).

Ready to start? [Get started here](/docs/user/started/).
