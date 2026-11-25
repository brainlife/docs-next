# Introduction

## What is an App?

An App is a containerized program from a GitHub repository that takes datatypes in and produces datatypes out. On brainlife.io, any GitHub repository can become an App. The App catalog describes it this way: "Apps process data, taking in specific datatypes as input and producing resulting datatypes."

An App usually does one short series of processing steps within a larger analysis. Write it so that other people can run it on their own data, not only to reproduce your results. Use well-known tools, keep the code readable and document what the App does.

Every App:

1. Lives in a public repository on github.com. The code can be in MATLAB, Python, shell or any other language.
2. Has one executable file named `main` at the root of the repository. brainlife.io runs `main` on a compute resource, directly or through a batch scheduler such as Slurm (`sbatch`) or PBS (`qsub`).
3. Reads all its parameters from a `config.json` file. brainlife.io writes `config.json` into the working directory when a job starts.
4. Reads its input data from the paths listed in `config.json`. The file holds both the parameters (for example command-line options) and the paths to input files (for example `t1.nii.gz`).
5. Writes its output files into the working directory (`./`), in the structure defined by a [datatype](https://connects.brainlife.io/datatypes?scope=public){target=_blank}. See [Datatypes](/docs/user/datatypes/).

New Apps should also:

6. Describe themselves in a `brainlife.app.json` manifest at the root of the repository (see [Describe your App](/docs/apps/register/#describe-your-app-with-a-manifest)). The manifest only describes the App; it does not change how the App runs.
7. Start their README from the [brainlife App README template](https://github.com/brainlife/abcd-spec/blob/master/templates/README.md){target=_blank}.

!!! note
    brainlife.io Apps follow a technical specification called Application for Big Computational Data, or [ABCD](https://github.com/brainlife/abcd-spec){target=_blank}. The specification defines how an App starts and is monitored, and, in its draft version 2, the `brainlife.app.json` manifest.

Apps run on many different clusters and clouds. To keep the software environment the same everywhere, most Apps run their programs inside a container with Singularity (Apptainer). See [Containerizing an App](/docs/apps/container/).

## Prerequisites

Before you write an App for brainlife.io, you should be comfortable with:

1. At least one programming language (MATLAB, Python, R, and so on).

2. The bash terminal and basic shell scripting. See [Introduction to Bash](https://docs.microsoft.com/en-us/learn/modules/bash-introduction/){target=_blank}.

3. [git](https://git-scm.com/docs/gittutorial){target=_blank} and [GitHub](https://guides.github.com/){target=_blank}, to publish your repository.

4. Basic concepts of high-performance computing (HPC). You can develop and test an App on your own computer, but brainlife.io runs most Apps on shared clusters. See:

    - [Slurm on HPC clusters (Princeton Research Computing)](https://researchcomputing.princeton.edu/support/knowledge-base/slurm){target=_blank}

5. Containers. Apps run their software from a Docker container through Singularity. You do not need to build containers yourself (the brainlife.io team can help), but you should know what a container is and what Singularity does. See the [Singularity introduction](https://singularity-tutorial.github.io/00-introduction/){target=_blank}.

!!! hint
    Writing an App draws on programming, the Unix shell, git and HPC. The community list [learn-neuroimaging/tutorials-and-resources](https://github.com/learn-neuroimaging/tutorials-and-resources){target=_blank} collects online tutorials on these topics.

## How to develop an App

You normally follow these steps.

1. Make your algorithm run on your computer or local cluster with your test data.
2. Write a sample `config.json`.
3. Write `main`, which reads `config.json` and passes the values to your algorithm. See [HelloWorld](/docs/apps/helloworld/).
4. Publish the code as a public GitHub repository.
5. Add a `brainlife.app.json` manifest and a README based on the template, and check the manifest with `python tools/blapp.py validate` from the [abcd-spec](https://github.com/brainlife/abcd-spec){target=_blank} repository.
6. Register the App on brainlife.io (**My Apps** → **App**). This is where you define the parameters and input files that reach your App through `config.json`. See [Registering an App](/docs/apps/register/).
7. Ask resource administrators to enable your App on their compute resources (below).

## Enable an App on a compute resource

An App runs only on compute resources where it is enabled. Each user has access to a different set of resources, and brainlife.io provides shared public resources for everyone. If you want every brainlife.io user to be able to run your App, [contact the brainlife.io team](/docs/contact/) and ask for it to be enabled on the public resources.

Discuss with the resource administrators how your App gets its dependencies and libraries. To keep this simple and reproducible, put your App's **dependencies** (not the App itself) in a Docker container and run your code inside that container with [Singularity](https://sylabs.io/singularity/){target=_blank} from your `main`.

!!! hint
    Most compute resources now provide Singularity (Apptainer), so containerized Apps can run on more resources.

## What happens when someone runs your App

brainlife.io runs an App in these steps.

1. A user runs your App in a project, in a process or through a pipeline automation.
2. brainlife.io lists the compute resources that the user can use and that have your App enabled, and picks the best one (see [Amaretti](/docs/technical/amaretti/)).
3. brainlife.io stages the input datasets from the project, or copies the working directory of an earlier job that produced them.
4. brainlife.io creates a working directory by cloning your repository (at the registered branch or tag), usually on the resource's scratch disk, and writes `config.json` with the user's parameters and the paths to the input files.
5. brainlife.io runs the `start` hook installed on the resource, as defined by the ABCD specification. In most cases you do not need to think about hooks.
6. On a batch cluster, the `start` hook submits your `main` to the local scheduler queue.
7. The scheduler runs `main` on a compute node. Your App runs your algorithm and writes its outputs into the working directory.
8. brainlife.io monitors the job and shows its status and logs to the user.
9. When the job finishes, the outputs are archived as datasets in the project (if the user chose to archive them).

## Datatypes

Apps exchange data through *datatypes*. A datatype is a file and directory structure, defined by developers, that holds a specific kind of data. Datatypes keep Apps interoperable.

Some examples of registered datatypes:

* `neuro/anat/t1w` (`t1.nii.gz`)
* `neuro/anat/t2w` (`t2.nii.gz`)
* `neuro/dwi` (diffusion data with `bvecs` and `bvals`)
* `neuro/freesurfer` (the whole FreeSurfer output)
* `neuro/track/tck` (`track.tck` with streamlines)
* `neuro/dtiinit` (dtiInit output directory)
* `generic/images` (a list of images)
* `raw` (unstructured data, often used during development)

Your App should read one or more of these datatypes and write its output in the format of another datatype. When you use existing datatypes, your App can read data produced by other Apps, and other Apps can use your outputs as their inputs.

To propose a new datatype, ask in the [#datatype](https://brainlife.slack.com/archives/C946FA6PK){target=_blank} channel on the brainlife.io Slack.

See [Datatypes](/docs/user/datatypes/) for more detail.

!!! quote
    "Write programs that do one thing and do it well. Write programs to work together." - A Quarter Century of Unix by Doug McIlroy

Follow the [Do One Thing and Do It Well](https://en.wikipedia.org/wiki/Unix_philosophy#Do_One_Thing_and_Do_It_Well){target=_blank} principle: split a complex workflow into several smaller Apps (but no more than is practical). Smaller Apps are easier to reuse, run in parallel and can each run on the most suitable compute resource.

!!! hint
    Before you write an App, browse the [Apps](https://connects.brainlife.io/apps?scope=public){target=_blank} and [Datatypes](https://connects.brainlife.io/datatypes?scope=public){target=_blank} catalogs to check that the App you need does not already exist. If a similar App exists, contact its developer and discuss whether the feature you need can be added.

## Job size and resource requirements

Every App should have a clear upper bound on the compute resources and time it needs. Most `main` scripts start with batch scheduler directives like these:

```
#!/bin/bash
#SBATCH --nodes=1                # node count
#SBATCH --ntasks=1               # total number of tasks across all nodes
#SBATCH --cpus-per-task=1        # cpu-cores per task (>1 if multi-threaded tasks)
#SBATCH --mem-per-cpu=2G         # memory per cpu-core (4G is default)
#SBATCH --time=00:01:00          # total run time limit (HH:MM:SS)
```

These lines tell the batch scheduler how much time and how many resources your App needs. If your job exceeds them, the scheduler stops it.

On an HPC system, the scheduler reserves the requested time and resources and charges service units (SUs) for them. Keep the request as low as you can: measure how much CPU and memory your App usually uses and set the directives to match. If your App runs for a long time, set the walltime high enough. Larger requests cost more and also wait longer in the queue for the resources to become free.

!!! warning
    Be conservative with `cpus-per-task` (or `ppn`). Most schedulers charge the number of CPUs you request times the run time. For example, a 2-hour job with 16 cores costs 2 x 16 = 32 units. If your job only uses 4 cores, request 4, and it costs 2 x 4 = 8 units.

People use brainlife.io to process their own data, not only to reproduce the developer's results. Your App should handle a wide range of input data, not just the data you used to develop it. This is hard, and Apps usually take time to become robust. Users may submit data that is much larger or more complex than you expected, and sometimes the job cannot finish within the time limit. To handle this, make your App able to restart and resume from where it stopped.

For example, if your App runs 3 steps that each take an hour, make each step check whether it has already finished. If the job stops at the time limit, the user can run it again and only the remaining steps run. Check whether the output of each step exists, and skip the step if it does:

``` bash
echo "running process1"
if [ ! -f output1.data ]; then
    ./process1 -in <someinput> -out tmp.data
    mv tmp.data output1.data
else
    echo "output1.data already exists.. skipping this step"
fi

echo "running process2"
if [ ! -f output2.data ]; then
    ./process2 -in <someinput> -out tmp.data
    mv tmp.data output2.data
else
    echo "output2.data already exists.. skipping this step"
fi

#etc..

```

If the job completes step 1 but not step 2, the user can run the job again to complete step 2.
