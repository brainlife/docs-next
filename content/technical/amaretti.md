# Task orchestration (Amaretti)

**Amaretti** is brainlife.io's workflow service. Its [README](https://github.com/brainlife/amaretti){target=_blank} describes it as "a light-weight, cross-resource, multi-user task orchestration service written in Node.js". It is a meta-scheduler: it does not replace the batch schedulers of compute clusters, but works on top of them (Slurm, PBS and others, and plain VMs), and can also submit to AWS Batch.

Amaretti takes care of the work that running jobs on many resources involves: choosing a compute resource, staging input data, starting and monitoring jobs, copying working directories between resources, and cleaning up scratch space.

In brainlife.io, each run of an App is a job. In Amaretti a job is a **task**, and related tasks are grouped in an **instance** (a process in the web app).

---

## 1. Architecture

Amaretti connects to compute resources over SSH, keeps tasks, instances and resources in MongoDB, uses Redis as a cache, and publishes status changes on a RabbitMQ (AMQP) message bus, which the event service passes on to the web app and the CLI.

```
        brainlife.io web app / CLI
                  │  REST API and WebSockets
                  ▼
            nginx proxy
       ┌──────────┼───────────────┐
       ▼          ▼               ▼
  Auth service  Warehouse   Event service
   (JWT)        (projects,      ▲
                 data, Apps)    │ AMQP events
                  │ REST        │
                  ▼             │
          ┌─────────────────────┴──┐
          │        Amaretti        │
          │  resource selection,   │
          │  task state, rsync     │
          └──────┬──────────┬──────┘
                 │ SSH      │ SSH / AWS Batch
                 ▼          ▼
          HPC cluster     cloud VM or
          (Slurm, PBS)    AWS Batch
          Singularity     Docker
```

---

## 2. What Amaretti does

### A. Choosing a compute resource

When a task is submitted, Amaretti scores every resource the user can use and picks the one with the highest score:

1. **App enabled**: a resource only runs Apps that its administrators enabled on it, each with a score. A resource without the App, with a score of 0, with no free capacity (each resource sets the maximum number of tasks it runs at once) or whose status is not OK is not used.
2. **Bonuses**: the score goes up by 5 if the task's dependencies ran on that resource (no data needs to move), by 10 if it is a private resource of the user, and by 15 if the user prefers it (for example `--preferred-resource` in the CLI).

The App page shows these resources under **Computing Resources**, and `GET /resource/best` returns the result of this selection (see the [REST API](/docs/technical/api/)). If no resource can run the task yet, it stays `requested` until one can.

---

### B. Task states

A task moves through these states:

```
requested ──> running ──> finished ──> removed
                 │
                 ├──> failed  ──(rerun)──> requested
                 │
                 └──> stop_requested ──> stopped
```

* **`requested`**: the task is registered and waits for its dependencies and for a resource.
* **`running`**: the inputs are staged in the task's working directory on the resource and the job has been submitted to the resource (for example with the `start` hook, which submits `main` to the scheduler).
* **`finished`**: the job completed successfully. Outputs the user chose to archive are then archived as datasets.
* **`failed`**: the job failed, for example with a non-zero exit code, or the scheduler stopped it (time limit, memory). A task also fails if a task it depends on failed ("Dependency failed.") or was removed ("Dependency removed.").
* **`stop_requested`** and **`stopped`**: a user asked to stop the task, and it was stopped.
* **`removed`**: the working directory was deleted from the resource.

---

### C. Copying data between resources

If a task needs the output of a task that ran on another resource, Amaretti copies the parent task's working directory directly from one resource to the other, without passing the data through the brainlife.io servers:

1. Amaretti starts an `ssh-agent` holding the key for the source resource.
2. It connects to the destination resource over SSH with agent forwarding.
3. On the destination resource it runs `rsync` to pull the parent task's directory from the source resource.
4. When the copy ends, the agent is stopped.

---

### D. Task dependencies

Tasks can depend on other tasks:

- A task does not start until all the tasks it depends on are `finished` ("Waiting on dependencies").
- If a dependency fails or is removed, the task fails.
- Tasks in the same instance share a working area on the resource, so a task can read its parents' outputs there without a transfer when they ran on the same resource.

---

### E. Cleaning up scratch space

Working directories live on the scratch disks of compute resources and are temporary:

1. A task can set a `remove_date`. After that date, housekeeping deletes its working directory.
2. Without a `remove_date`, a task's working directory is deleted when the task is more than 90 days old.
3. When the working directory is gone, the task becomes `removed`.
4. Outputs that were archived as datasets in a project (**2. Data**) are stored by brainlife.io and do not depend on the working directory. Archive any output you want to keep.

---

### F. Reusing SSH connections

Opening a new SSH connection for every command is slow and can trip the connection limits of institutional firewalls. Amaretti keeps SSH connections to resources open and reuses them for commands, file transfers and log reads.

---

## 3. How an App runs

Amaretti runs Apps that follow the ABCD (Application for Big Computational Data) [specification](https://github.com/brainlife/abcd-spec){target=_blank}:

- **From GitHub**: an App is a GitHub repository. Each task records the branch it ran (`service_branch`), so results can be reproduced.
- **Hooks**: Amaretti starts, monitors and stops a task with the `start`, `status` and `stop` hooks installed on the resource (or provided by the App; see [Custom hooks](/docs/apps/customhooks/)). The default `start` hook runs the App's `main`.
- **Working directory**: Amaretti clones the App into the task's working directory and writes `config.json` there, with the user's parameters and the paths to the input data. The App writes its outputs into the same directory, in the structure of the output datatypes.
- **Containers**: most Apps run their software from a Docker container with Singularity (Apptainer) on HPC clusters, or Docker on cloud resources.

---

## 4. Running Amaretti yourself

The brainlife.io team runs Amaretti for brainlife.io. The [source code](https://github.com/brainlife/amaretti){target=_blank} is MIT licensed.

Amaretti uses these services:

| Service | Purpose |
| :--- | :--- |
| **MongoDB** | Tasks, instances and resource configurations |
| **Redis** | Cache |
| **RabbitMQ** | Event message bus |
| **Elasticsearch** | Task logs |
