# Amaretti REST API

The **Amaretti REST API** controls jobs (tasks), the instances (processes) that group them, and compute resources on brainlife.io. The brainlife.io web app and the CLI use it, and so can your own scripts: to submit tasks, follow their progress, read their logs and download files from their working directories.

This page covers the most used endpoints. The [Amaretti source code](https://github.com/brainlife/amaretti){target=_blank} documents each endpoint in comments (apiDoc format) in `api/controllers/`.

---

## 1. Base URL and authentication

### Base URLs
- **Amaretti API**: `https://brainlife.io/api/amaretti`
- **Warehouse API** (projects, datasets, Apps, publications): `https://brainlife.io/api/warehouse`

### Authentication
Endpoints that need a signed-in user take a brainlife.io JWT in the `Authorization` header:

```http
Authorization: Bearer <your-brainlife-jwt-token>
Content-Type: application/json
```

To get a token, log in with the [CLI](/docs/cli/install/) (`bl login`); it saves the token in `~/.config/brainlife.io/.jwt`:

```bash
export BRAINLIFE_JWT=$(cat ~/.config/brainlife.io/.jwt)
```

---

## 2. Tasks

A **task** is one run of an App (a job) on a compute resource.

### Submit a task

```http
POST /task
```

#### Request body
```json
{
  "instance_id": "60d5ec49f1b2c82b9c8d1234",
  "service": "brainlife/app-freesurfer",
  "service_branch": "7.3.2",
  "name": "freesurfer-sub-01",
  "config": {
    "t1": "../60d5ec49f1b2c82b9c8d1230/t1.nii.gz"
  },
  "deps_config": [ { "task": "60d5ec49f1b2c82b9c8d1230" } ],
  "preferred_resource_id": "60d5ec49f1b2c82b9c8d5678"
}
```

| Parameter | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `instance_id` | String | **Yes** | The instance to submit the task in. |
| `service` | String | **Yes** | The App's GitHub repository (for example `brainlife/app-freesurfer`). |
| `service_branch` | String | No | Branch or tag to run (`master` by default). |
| `name`, `desc` | String | No | Name and description of the task. |
| `config` | Object | No | Parameters and input paths; stored as `config.json` in the task directory. |
| `deps_config` | Array | No | Tasks this task depends on (`{"task": "<task id>"}`). The task runs when all of them have finished. |
| `preferred_resource_id` | String | No | A resource you would like the task to run on (it may or may not be chosen). |
| `max_runtime` | Number | No | Maximum run time of the job, in milliseconds. |
| `remove_date` | String | No | Date (ISO format) after which the task directory is removed. |
| `cleanup_on_success` | Boolean | No | Remove the task directory after the outputs are archived. |

#### Response (`200 OK`)
```json
{
  "message": "Task successfully registered",
  "task": { "_id": "60d5ec49f1b2c82b9c8d9999", "status": "requested", "...": "..." }
}
```

---

### Query tasks
Returns the tasks you own or that are shared with you through their instance.

```http
GET /task?find={"instance_id":"60d5ec49f1b2c82b9c8d1234"}&limit=20&sort=-create_date
```

#### Query parameters
- `find`: a MongoDB query, as URL-encoded JSON (for example `{"status":"failed"}`).
- `limit`: maximum number of records (default `100`).
- `skip`: offset for paging.
- `sort`: sort order (for example `-create_date` for newest first).
- `select`: fields to return, separated by spaces (for example `status service name`).

The response lists the tasks and the total count.

---

### Get one task

```http
GET /task/:id
```

Returns the task, including `status`, `status_msg`, the resource it ran on (`resource_id`) and its dates.

---

### Rerun a task
Sets a finished or failed task back to `requested`.

```http
PUT /task/rerun/:taskid
```

```bash
curl -X PUT https://brainlife.io/api/amaretti/task/rerun/60d5ec49f1b2c82b9c8d9999 \
  -H "Authorization: Bearer $BRAINLIFE_JWT"
```

---

### Stop a task
Sets a running task to `stop_requested`, so that Amaretti stops it.

```http
PUT /task/stop/:taskid
```

---

### Remove a task
Marks the task for removal: its working directory is deleted at the next housekeeping, and its status becomes `removed`.

```http
DELETE /task/:taskid
```

---

### List files in the task directory

```http
GET /task/ls/:taskid?p=output
```

- `p`: an optional subdirectory, relative to the task directory (URL-encoded).

#### Response (`200 OK`)
```json
{
  "files": [
    {
      "filename": "config.json",
      "directory": false,
      "attrs": { "mode_string": "-rw-r--r--", "size": 117, "mtime": 1466517617, "...": "..." }
    }
  ]
}
```

---

### Download a file or directory

```http
GET /task/download/:taskid/<path>
```

- If `<path>` is a file, the file is streamed.
- If `<path>` is a directory, it is streamed as a `.tar.gz` archive.
- If you cannot set the `Authorization` header (for example in a browser link), pass the token as `?at=<jwt>`.

```bash
curl -L -O https://brainlife.io/api/amaretti/task/download/60d5ec49f1b2c82b9c8d9999/config.json \
  -H "Authorization: Bearer $BRAINLIFE_JWT"
```

---

## 3. Instances

An **instance** groups related tasks; in the web app it is a process.

### Create an instance
```http
POST /instance
```

#### Request body
```json
{
  "name": "preprocessing-cohort-a",
  "desc": "T1w and DWI preprocessing for cohort A"
}
```

Optional: `group_id` (the group to share it with; a project's group) and `config` (any information to store with it).

---

### Query instances
```http
GET /instance?find={"name":"preprocessing-cohort-a"}
```

---

### Remove an instance
Schedules the instance's tasks for removal (running tasks are stopped first).

```http
DELETE /instance/:instid
```

---

## 4. Resources

A **resource** is a compute resource (an HPC cluster, a VM or a cloud service) that runs tasks. Most users manage resources in the web app under **My Resources**; see [Registering a resource](/docs/resources/register/).

### Register a resource
Creates the resource entry only; it does not test the resource or install keys.

```http
POST /resource
```

Main fields: `config` (the resource configuration), `name`, `hostname`, `envs` (environment variables for tasks), `services` (the Apps enabled on it, as `{"name": "<github repo>", "score": <n>}`), `gids` (groups that can use it), `admins` and `active`.

---

### List resources
```http
GET /resource
```

---

### Find the best resource
Runs the resource selection that a new task would go through (see [Amaretti](/docs/technical/amaretti/)).

```http
GET /resource/best?service=brainlife/app-freesurfer
```

The response includes the chosen `resource`, its `score`, and the list of resources `considered`, or `{"nomatch": true, ...}` if none can run the App.

---

### Test a resource
Checks that Amaretti can connect to the resource and stores the result on the resource's `status` and `status_msg`.

```http
PUT /resource/test/:resource_id
```

In the web app this is **Test Resource** on the resource settings.

---

## 5. Health

```http
GET /health
```

Returns `status` (`"ok"` or `"failed"`), with `messages` and `reports` from the checks.
