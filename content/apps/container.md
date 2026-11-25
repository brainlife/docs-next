# Containerizing an App

Docker packages software and its dependencies into a portable *container* that runs on any machine with the Docker engine or Singularity (Apptainer). Most brainlife.io Apps run their software from a Docker container through Singularity.

You can build a complete, standalone Docker container for your App. For brainlife.io, we recommend that you containerize only the App's *environment and dependencies*, and keep the main part of the App (the Python or MATLAB scripts that drive your algorithm) out of the container.

Your scripts stay in your GitHub repository, and Singularity runs them inside the environment container at run time. For example:

```bash
singularity exec -e docker://brainlife/dipy:0.13 ./app.py
```

Here `brainlife/dipy:0.13` is the environment container, and `app.py` comes from the App's repository and runs inside that environment.

You can share one container across several Apps that you and your lab maintain. Always name a specific container version ("0.13" above), so that your App does not change when the container is updated.

If you write a `brainlife.app.json` manifest, list the container image under `runtime` (see [Describe your App with a manifest](/docs/apps/register/#describe-your-app-with-a-manifest)).

## Docker engine

To build a Docker container, [install Docker](https://docs.docker.com/get-started/get-docker/){target=_blank} on your computer or use a server that has it. If you need help, [contact the brainlife.io team](/docs/contact/).

The steps below assume your App is already on GitHub and you are working in a clone of its repository on a machine with Docker.

## Compiling MATLAB scripts

> Skip this section if you do not use MATLAB.

MATLAB code needs a MATLAB license to run. If your App contains MATLAB code, compile it with the [`mcc` command](https://www.mathworks.com/help/compiler/mcc.html){target=_blank}. The compiled program runs without a MATLAB license, against the MATLAB Runtime (*MCR*), which is free to distribute.

You can write a script that compiles your MATLAB code. This example comes from an HPC cluster; adjust the module name and paths to your system.

#### compile.sh

```bash
#!/bin/bash
module load matlab/2017a

mkdir -p compiled

cat > build.m <<END
addpath(genpath('/N/u/brlife/git/vistasoft'))
addpath(genpath('/N/u/brlife/git/jsonlab'))
addpath(genpath('/N/soft/mason/SPM/spm8'))
mcc -m -R -nodisplay -a /N/u/brlife/git/vistasoft/mrDiffusion/templates -d compiled myapp
exit
END
matlab -nodisplay -nosplash -r build

```

The script writes a MATLAB script called `build.m` and runs it. `build.m` sets the MATLAB paths and runs `mcc`, which compiles your code into an executable that runs without a MATLAB license. The executable still needs the MATLAB Runtime (MCR) libraries, which you can download from MathWorks.

!!! note
    The brainlife.io team maintains Docker images with the MATLAB Runtime, [brainlife/mcr](https://hub.docker.com/r/brainlife/mcr/tags){target=_blank}, that you can use to run compiled MATLAB code with Singularity.

In `build.m`, add every MATLAB dependency of your code with `addpath()`. `myapp` is the name of the MATLAB entry function of your App; `mcc` writes an executable with the same name, `myapp`, into `./compiled`.

Some `mcc` options:

* `-m ...` names the main entry function of your App (the function that reads `config.json` and runs the whole App).
* `-R -nodisplay` sets the command-line options you would normally pass to MATLAB.
* `-d ...` sets where to write the executable. Avoid the root of the repository, to keep it tidy.
* If your App or its libraries read non-MATLAB files (MEX files, data files, models, templates, and so on), include them with `-a`. `mcc` adds the files and directories to the executable, and the compiled code reads them as if they were on the local file system.

* If you use OpenMP, install the `libgomp1` library in your MCR container.
* Compiled code cannot run some MATLAB statements, such as `addpath`. Wrap such code in `if ~isdeployed` so it does not run.

!!! note
    Custom paths set in `startup.m` can affect how your code compiles. A workaround is to rename `startup.m` temporarily while you compile.

### Loading custom MATLAB data structures

If your code loads custom data structures (for example with `load('data.mat')`, such as the sparse tensor array in encode's `fe` structure), `addpath()` is not enough to include their classes in the executable. Tell the compiler about them with a special comment like this:

`%# function sptensor`

This tells the compiler to include the `sptensor` class.

## Creating a Docker container

There are many guides to writing a Dockerfile. A good place to start is [Docker's Getting Started guide](https://docs.docker.com/get-started/){target=_blank}.

Because most brainlife.io Apps run Docker containers through Singularity, a few details matter for your App to run correctly.

### ldconfig

Singularity runs containers as a normal user, so some system setup has to happen when you build the image.

When Docker installs system packages, it may not create the links for shared libraries until they are first used. Under Singularity the container runs as a normal user and cannot create them. Run `ldconfig` as the last command in your Dockerfile; it creates the links and cache for the shared libraries in the library directories:

```
#make it work under singularity
RUN ldconfig 
```

### Mount points on older hosts

Some older operating systems (such as RHEL 6) only let Singularity mount a host path if the same directory already exists in the container, because the kernel lacks overlay support.

If your App must run on such a host, create the mount points in your Dockerfile. For example, for a cluster that mounts its storage under `/N`:

```
RUN mkdir -p /N/u /N/home /N/dc2 /N/soft
```

### Use bash

On Ubuntu, `/bin/sh` points to `dash`, not `bash`. `dash` loads faster, but many programs expect `/bin/sh` to be `bash`. To reset it, add this to your Dockerfile:

```
#https://wiki.ubuntu.com/DashAsBinSh
RUN rm /bin/sh && ln -s /bin/bash /bin/sh
```

Your container is now ready.

## Example Dockerfile for an environment container

* [brainlife/app-dipy-workflows](https://github.com/brainlife/app-dipy-workflows/blob/master/Dockerfile){target=_blank}
* MATLAB Runtime images: [brainlife/mcr on Docker Hub](https://hub.docker.com/r/brainlife/mcr/tags){target=_blank}

## Example Apps that use environment containers

* [brainlife/app-freesurfer](https://github.com/brainlife/app-freesurfer){target=_blank}
* [brainlife/app-wmaSeg](https://github.com/brainlife/app-wmaSeg){target=_blank}
