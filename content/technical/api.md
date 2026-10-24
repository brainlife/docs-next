# Amaretti & Brainlife REST API Reference

The **Amaretti REST API** provides programmatic control over computational tasks, workflow instances, and compute resource registrations on Brainlife.

External clients (such as the Brainlife Web UI, the Brainlife CLI, automated pipeline daemons, and third-party scientific scripts) use these endpoints to submit jobs, monitor execution progress, stream logs, and retrieve output derivatives.

---

## 1. Authentication & Base URL

### Base URL
- **Production API**: `https://brainlife.io/api/amaretti`
- **Warehouse API**: `https://brainlife.io/api/warehouse`

### Authentication Header
All authenticated endpoints require a valid Brainlife JSON Web Token (JWT) passed in the HTTP `Authorization` header:

```http
Authorization: Bearer <your-brainlife-jwt-token>
Content-Type: application/json
```

To retrieve your JWT token via the [Brainlife CLI](/docs/cli/install/):
```bash
brainlife token
```

---

## 2. Task Management Endpoints

A **Task** represents an individual application execution on a designated computing resource.

### Submit a New Task
Create and queue a computational task for execution.

```http
POST /task
```

#### Request Body
```json
{
  "instance_id": "60d5ec49f1b2c82b9c8d1234",
  "service": "brainlife/app-freesurfer",
  "service_branch": "7.3.2",
  "name": "freesurfer-sub-01",
  "config": {
    "t1": "../60d5ec49f1b2c82b9c8d1230/t1.nii.gz",
    "reconall_args": "-all -parallel"
  },
  "deps": ["60d5ec49f1b2c82b9c8d1230"],
  "preferred_resource_id": "60d5ec49f1b2c82b9c8d5678",
  "max_runtime": 1440
}
```

| Parameter | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `instance_id` | String | **Yes** | MongoDB ID of the parent workflow instance. |
| `service` | String | **Yes** | GitHub repository of the App (e.g. `brainlife/app-freesurfer`). |
| `service_branch` | String | No | Git branch or release tag (defaults to `master`). |
| `name` | String | No | Human-readable label for the task. |
| `config` | Object | **Yes** | Input arguments, parameter flags, and input data paths. |
| `deps` | Array | No | List of parent task IDs that must finish successfully before this task runs. |
| `preferred_resource_id` | String | No | Optional compute resource ID override. |
| `max_runtime` | Number | No | Maximum execution walltime in minutes. |

#### Example Response (`200 OK`)
```json
{
  "_id": "60d5ec49f1b2c82b9c8d9999",
  "instance_id": "60d5ec49f1b2c82b9c8d1234",
  "service": "brainlife/app-freesurfer",
  "service_branch": "7.3.2",
  "status": "requested",
  "progress_key": "task-60d5ec49f1b2c82b9c8d9999",
  "user_id": 105,
  "request_date": "2026-10-24T19:30:00.000Z"
}
```

---

### Query Tasks
Filter and retrieve tasks across instances.

```http
GET /task?find={"instance_id":"60d5ec49f1b2c82b9c8d1234"}&limit=20&sort=-request_date
```

#### Query Parameters
- `find`: URL-encoded JSON query matching MongoDB fields (e.g., `{"status":"failed"}`).
- `limit`: Maximum number of records to return (defaults to `100`).
- `skip`: Pagination offset.
- `sort`: Sorting field (e.g., `-request_date` for newest first).
- `select`: Space-separated list of fields to return (e.g., `status service name`).

---

### Get Task Details
Retrieve full execution metadata, remote job scheduler IDs, and status.

```http
GET /task/:taskid
```

#### Example Response (`200 OK`)
```json
{
  "_id": "60d5ec49f1b2c82b9c8d9999",
  "name": "freesurfer-sub-01",
  "status": "finished",
  "status_msg": "Job finished successfully with exit code 0",
  "resource_id": "60d5ec49f1b2c82b9c8d5678",
  "resource_name": "carbonate-hpc",
  "run_date": "2026-10-24T19:32:00.000Z",
  "finish_date": "2026-10-24T23:45:00.000Z"
}
```

---

### Rerun a Task
Reset and resubmit a failed or completed task.

```http
PUT /task/rerun/:taskid
```

```bash
curl -X PUT https://brainlife.io/api/amaretti/task/rerun/60d5ec49f1b2c82b9c8d9999 \
  -H "Authorization: Bearer $BRAINLIFE_JWT"
```

---

### Stop a Running Task
Cancel active execution on the remote cluster scheduler.

```http
PUT /task/stop/:taskid
```

---

### List Task Directory Files
Inspect standard output, error logs, and generated files in the task working directory.

```http
GET /task/ls/:taskid?p=sub-01
```

#### Query Parameters
- `p`: Optional sub-directory path to explore.

#### Example Response (`200 OK`)
```json
{
  "files": [
    { "filename": "slurm-1284920.err", "size": 1024, "directory": false },
    { "filename": "slurm-1284920.out", "size": 45020, "directory": false },
    { "filename": "config.json", "size": 512, "directory": false },
    { "filename": "output", "size": 4096, "directory": true }
  ]
}
```

---

### Download File or Directory Tarball
Stream files directly out of the remote compute resource's scratch space.

```http
GET /task/download/:taskid/:filepath
```

- If `:filepath` is a file (e.g., `slurm-1284920.err`), the file is streamed directly.
- If `:filepath` is a directory (e.g., `output`), Amaretti dynamically bundles it into a `.tar.gz` stream on the fly.

```bash
curl -L -O https://brainlife.io/api/amaretti/task/download/60d5ec49f1b2c82b9c8d9999/slurm-1284920.err \
  -H "Authorization: Bearer $BRAINLIFE_JWT"
```

---

## 3. Instance Management Endpoints

An **Instance** groups related compute tasks together under a single logical workflow and remote directory namespace.

### Create an Instance
```http
POST /instance
```

#### Request Body
```json
{
  "name": "preprocessing-cohort-a",
  "desc": "T1w and DWI preprocessing pipeline for Cohort A"
}
```

---

### Query Instances
```http
GET /instance?find={"name":"preprocessing-cohort-a"}
```

---

### Remove an Instance
Removes an instance and marks all child tasks for scratch cleanup.

```http
DELETE /instance/:instid
```

---

## 4. Resource Management Endpoints

Computing resources represent HPC clusters, campus grids, and cloud servers authorized to run Amaretti workloads.

### Register a Compute Resource
```http
POST /resource
```

#### Request Body
```json
{
  "name": "iu-carbonate",
  "hostname": "carbonate.uits.iu.edu",
  "envs": {
    "TMPDIR": "/N/scratch/username/brainlife"
  },
  "services": [
    "brainlife/app-freesurfer",
    "brainlife/app-fsl-bet"
  ]
}
```

---

### Query Registered Resources
```http
GET /resource
```

---

### Find Best Resource
Simulate the scoring algorithm to determine which cluster would be selected for an App.

```http
GET /resource/best?service=brainlife/app-freesurfer
```

#### Example Response (`200 OK`)
```json
{
  "resource": {
    "_id": "60d5ec49f1b2c82b9c8d5678",
    "name": "carbonate-hpc",
    "score": 92.5
  }
}
```

---

### Test Resource Connectivity
Triggers an immediate SSH health check, verifies scratch write access, and reports status.

```http
PUT /resource/test/:resource_id
```

---

## 5. System Health & Monitoring

### Microservice Health Check
```http
GET /health
```

#### Example Response (`200 OK`)
```json
{
  "status": "ok",
  "mongodb": "connected",
  "redis": "connected",
  "amqp": "connected",
  "version": "1.8.4"
}
```

---

### Running & Requested Task Metrics
Query real-time job counts across all services, resources, and users.

```http
GET /services/running
```

#### Example Response (`200 OK`)
```json
{
  "services": [
    { "service": "brainlife/app-freesurfer", "running": 42, "requested": 15 },
    { "service": "brainlife/app-qsiprep", "running": 18, "requested": 4 }
  ],
  "total_running": 60,
  "total_requested": 19
}
```
