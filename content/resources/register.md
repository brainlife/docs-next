!!! note
You need to be a resource owner to register your own resource. Contact brainlife.io at [brainlife.io@gmail.com](mailto:brainlife.io@gmail.com).

## Background

brainlife.io lets you make a compute resource, such as a cloud system or a high-performance computing cluster, available to specific users and projects. By default, shared public resources are available to all users, and most brainlife.io Apps are enabled on them.

Because everyone uses the public resources, jobs sometimes wait in the queue. You can register your own compute resource in these cases:

1. You have access to your own HPC resource, and you'd like to use it to run brainlife.io Apps, for better performance, or better access control.
2. You are an app developer and you'd like to use your own resource to troubleshoot your apps on your own resource, for easier debugging.
3. You are an app developer and your app can only run on specialized resources (like Hadoop, Spark, etc..) that the public brainlife.io resources do not provide.

Only brainlife.io administrators can make a resource available to all projects. To share your resource that way, contact the [brainlife.io administrators](mailto:brainlife.io@gmail.com).

!!! note
	Resource owner decides which apps are allowed to run on their resource. If you register a resource and enable apps on it, only you can run those apps on that resource. If you are publishing your app, and you want all users to be able to execute your app, contact the [brainlife.io administrators](mailto:brainlife.io@gmail.com) to enable your App on the public resources.

!!! warning
	Although we do our best to limit access to your dataset on shared resources, we recommend registering your own resource for added security
	especially if you are planning to process sensitive data. We currently do not allow any datasets with PHI (protected health information).

## Configuring Resources

Before you can register your resource, you should make sure that your resource is ready to run brainlife Apps.

### ABCD Default Hooks

[ABCD Hooks](https://github.com/brainlife/abcd-spec){target=_blank} are used to start, stop and monitor apps on remote resources. Some app provides its own hooks, but many of them relies on default hooks that are installed on each resource. As a resource provider, you need to provide these default hooks and make them available by setting `$PATH`. If you are not sure how to write these scripts, you can install and use the default brainlife.io ABCD hooks:

```
cd ~
git clone https://github.com/brainlife/abcd-spec
```

Then, add one of following to your ~/.bashrc

#### For PBS cluster

```
export PATH=~/abcd-spec/hooks/pbs:$PATH
```

#### For Slurm cluster (for most HPC systems)

```
export PATH=~/abcd-spec/hooks/slurm:$PATH
```

#### For direct execution - no batch submission manager (like.. VMs)

```
export PATH=~/abcd-spec/hooks/direct:$PATH
```

### Work/Scratch directory

In order to process data, you will need scratch / workdir to host your input/output files as well as any temporary files generated. Most HPC systems provide a scratch storage system; on some systems you need to request a scratch allocation first and configure your brainlife resource to use it. You can then create a directory inside your scratch directory such as

```
mkdir /path/to/scratch/<username>/brainlife-workdir
```

!!! note
    brainlife keeps data on scartch volume up to 3 months. Most likely, you will not be able to keep your data that long without running out of your storage space. Please purge unnsed data periodically 
    and monitor your storage usage (use `quota` command).
    
    You can run a command like this to search and purge unused workdirs (create a script and run this, or setup a cron job to run it automatically)

    ```
    find /path/to/scratch/<username>/brainlife-workdir -maxdepth 2 -type d -ctime +$days -exec rm -v -rf {} \;
    ```

### Common Binaries

brainlife.io expects these binaries on every resource. Please make sure following commands are installed.

* jq (command line JSON parser that many brainlife.io Apps use to read config.json)
* git (used to clone / update apps installed)
* singularity (user level container execution engine)
* node (some app uses node to generate job submission file)

For singularity, you can either install it on the system (`apt install singularity-container` with neurodebian, or `yum install epel-release singularity` for yum based systems), or for most HPC systems you can simply add `module load singularity` in your `~/.modules` file.

By default, singularity uses user's home directory to cache docker images (and /tmp to create a merged container image to run). If you have limited amount of home directory space, you will need to override it by setting SINGULARITY_CACHEDIR. 

```
export SINGULARITY_CACHEDIR=/path/to/scratch/<username>/singularity-cachedir
```

* Please replace <username> with your username, and make sure specified directories exists.

!!! note
    singularity by default does not expose any mounted file systems inside the container. On HPC systems, for example, you will need to specify your scratch work directory in your .bashrc (comma delimited)

    ```
    export SINGULARITY_BINDPATH=/path/to/scratch/<username>/brainlife-workdir,/any/other/paths/you/want/to/mount
    ```

### Other ENV parameters

Depending on the app you are trying to run, some app may require additional ENV parameters. For example, brainlife/app-freesurfer requires you to provide your freesurfer license via `FREESURFER_LICENSE`.

```
export FREESURFER_LICENSE="you@example.edu 29511 *xxxxxxxxxxx xxxxxxxxxxx"
```

You can request your freesurfer license [here](https://surfer.nmr.mgh.harvard.edu/registration.html){target=_blank}

Some Apps do dynamic resource allocation. It *requests max number of tasks / memories / walltime based on configuration / input data. For these Apps uses a special ENV parameter `BRAINLIFE_MAXTASKS` to limit the number of
maximum number of tasks per threads. Please set this ENV if your resource support batch scheduler like SLURM.

```
#instruct dynamic Apps to limit number of tasks (#SLURM --ntasks-per-node=N)
export BRAINLIFE_MAXTASKS=24
```

## Registering Resources

To register your resource:

1. In the sidebar, select **My Resources**.
2. Select **Resource** (the plus button).
3. In **Create New Resource**, choose the **Resource Type** (**SSH (traditional HPC)** or **AWS Batch**), enter the **Resource Name**, choose the **Projects** that can use it, and select **Create Resource**.

An SSH resource needs the following settings:

* *Name*: the name of the resource
* *Hostname* The hostname of your compute resource (usually a login/submit host)
* *Username* Username used to ssh to this resource
* *Workdir* Directory used to stage and store generated datasets by apps. *You should not share the same directory with other resources*. Please make sure that the specified directory exits (mkdir if not).
* SSH Public Key: Copy the content of this key to your resource's ~/.ssh/authorized_keys. Please read [authorized_keys](https://www.ssh.com/ssh/authorized_keys/){target=_blank} for more detail.

You can leave the rest of the fields empty for now.

!!! warning
	Some HPC systems require you to submit an SSH public key agreement form before you can authenticate using your SSH public key. Check your system's documentation.

When you have copied the SSH key and the workdir exists, open the resource page and select **Test Resource** to check that brainlife.io can reach your resource.

## Enabling Apps

Once you have registered and tested your resource, you can now enable apps to run on your resource.

1. In **My Resources**, open the resource you created and select **Edit**.
2. Open the **Apps** tab. Under **Allowed apps** ("Only apps listed here are submitted to this resource."), add each App you want to enable by its GitHub org/repo name (such as `brainlife/app-life`).
3. Set a score for each App. The higher the score, the more likely this resource runs the App when several resources are available. brainlife.io gives a higher score to resources you own than to shared ones, so keep the default of 10 unless the resource competes with another resource you can use.
4. Select **Save Changes**.

To see which resources run an App, and which one will be chosen when you run it, open the App page and look under **Computing Resources**. [example](https://brainlife.io/app/58c56cf7e13a50849b258800){target=_blank}


