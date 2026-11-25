# Custom hooks

Life cycle hooks are the scripts brainlife.io uses to start, stop and monitor your App. By default, brainlife.io looks for executables named `start`, `status` and `stop` on the PATH of each compute resource. The resource owner makes sure these scripts are installed and available to Apps.

> For most PBS and Slurm clusters and plain VMs, the resource owner can install the [ABCD default hooks](https://github.com/brainlife/abcd-spec/tree/master/hooks){target=_blank}. See [Registering a resource](/docs/resources/register/#abcd-default-hooks).

The default `start` hook runs a file named `main`. So the only file your App needs to run on brainlife.io is an executable `main` at the root of its repository.

In most cases you do not need to think about hooks. If your App needs a special way to start, stop or monitor it, you can provide your own hook scripts.

List the paths to your hook scripts in a file named `package.json` at the root of the repository:

```json
{
  "abcd": {
    "start": "./start.sh",
    "stop": "./stop.sh",
    "status": "./status.sh"
  }
}
```

Then add those scripts to your App's repository.

> Run `chmod +x *.sh` so that your hook scripts are executable.

### `start.sh`

This example `start` script submits `main` with `qsub` (PBS) and saves the job ID in a file called `jobid`, so the job can be monitored.

```
#!/bin/bash

#return code 0 = job started successfully.
#return code non-0 = job failed to start

qsub -d $PWD -V -o \$PBS_JOBID.log -e \$PBS_JOBID.err main > jobid
```

### `stop.sh`

This example `stop` script reads the job ID saved by the `start` script and stops the job with `qdel`.

```
#!/bin/bash
qdel `cat jobid`
```

### `status.sh`

The `status` hook is a little more complex. It returns an exit code that reports the state of the App. This example uses the job ID saved by the `start` script to query the job with the PBS `qstat` command.

Whatever the script prints to stdout becomes the job's status message. For example, print the last line of the log file to show users the latest log entry.

```
#!/bin/bash

#return code 0 = running
#return code 1 = finished successfully
#return code 2 = failed
#return code 3 = unknown (retry later)

if [ ! -f jobid ];then
    echo "no jobid - not yet submitted?"
    exit 1
fi

jobid=`cat jobid`
if [ -z $jobid ]; then
    echo "jobid is empty.. failed to submit?"
    exit 3
fi

jobstate=`qstat -f $jobid | grep job_state | cut -b17`
if [ -z $jobstate ]; then
    echo "Job removed before completing - maybe timed out?"
    exit 2
fi

case "$jobstate" in
Q)
    showstart $jobid | grep start
    exit 0
    ;;
R)
    #get last line of last log touched
    logfile=$(ls -rt *.log | tail -1)
    tail -1 $logfile
    exit 0
    ;;
H)
    echo "Job held.. waiting"
    exit 0
    ;;
C)
    exit_status=`qstat -f $jobid | grep exit_status | cut -d'=' -f2 | xargs`
    if [ $exit_status -eq 0 ]; then
        echo "finished with code 0"
        exit 1
    else
        echo "finished with code $exit_status"
        exit 2
    fi
    ;;
*)
    echo "unknown job status $jobstate .. will check later"
    exit 3
    ;;

esac

```
