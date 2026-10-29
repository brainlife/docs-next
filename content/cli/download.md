# Downloading Data

Brainlife CLI provides several flexible ways to download your data objects, entire BIDS-structured datasets, publication releases, and raw files stored in project S3 buckets.

---

## 1. Querying Data Objects

Before downloading, locate the project and data objects you wish to retrieve.

### Find Project ID
Search for a project by name or keyword using `bl project query`:

```bash
$ bl project query --query "O3D"
Id: 5a022fc99c0d250055709e9c
Name: O3D
Admins: hayashis, avesani, frakkopesto
Access: public
Description: O3D (Open Diffusion Data and Derivative)
(Returned 1 result)
```

### Find Data Objects within a Project
List data objects in that project using `bl data query`:

```bash
$ bl data query --project 5a022fc99c0d250055709e9c --subject "0008"

Id: 5bb5713a12512a003f32e9b6
Project: O3D
Subject: 0008
Datatype: neuro/wmc<dt_stream, afq>
Description: AFQ with no Life (dt_stream) run1
Storage: wrangler
Status: stored
Tags: dt_stream, pre_life, run1
Create Date: 10/3/2018, 9:47:38 PM
```

You can filter results using:
* `--datatype <name_or_id>`: Filter by datatype (e.g. `neuro/anat/t1w`).
* `--subject <subject>`: Filter by subject identifier.
* `--session <session>`: Filter by session.
* `--tag <tag>`: Filter by search tag.
* `--datatype_tag <dtag>`: Filter by datatype tag.
* `--skip <n>` and `--limit <n>`: Paginate through query results.
* `--json`: Output full raw records in JSON format.

---

## 2. Downloading Individual Data Objects (`bl data download`)

Once you know the ID of a data object, download it using `bl data download`:

```bash
bl data download --id 5a050ad5d76a2a002737e572 --directory ./t1_output
```

* `--id <id>` (or `-i`): The MongoDB ID of the data object. (Can also be passed as a positional argument: `bl data download 5a050ad5d76a2a002737e572`).
* `--directory <dir>` (or `-d`): Local directory where files will be unpacked. If omitted, a folder named after the object ID is created.
* `--json` (or `-j`): Suppress progress output and print output details as JSON.

Once finished, the folder contains the individual files corresponding to that datatype:

```bash
$ ls ./t1_output
t1.nii.gz
```

---

## 3. Downloading Datasets in BIDS Format (`bl bids download`)

Instead of downloading files one by one and manually reconstructing folders, `bl bids download` automatically queries the warehouse, generates a BIDS-compliant directory tree, and streams all files locally:

```bash
bl bids download --project 5a022fc99c0d250055709e9c --output ./my_bids_dataset
```

### Advanced BIDS Filtering

You can filter what to download so you only retrieve the subjects or modalities you need:

```bash
bl bids download \
    --project 5a022fc99c0d250055709e9c \
    --subject "0001" \
    --subject "0002" \
    --datatype "neuro/anat/t1w" \
    --datatype "neuro/dwi" \
    --tag "preprocessed" \
    --output ./filtered_bids
```

* `--project <project_id>`: Target project ID.
* `--subject <subject_id>`: Filter to specific subjects (repeatable).
* `--datatype <datatype>`: Filter to specific datatypes (repeatable).
* `--tag <tag>`: Filter by data tag (repeatable; prepend `!` to exclude, e.g. `!bad`).
* `--datatype_tag <dtag>`: Filter by datatype tag.
* `--pub <pub_id>`: Download datasets associated with a specific Brainlife publication release.
* `--output <dir>`: Local destination directory.

---

## 4. Downloading Project Files from S3 Storage

Brainlife projects support raw S3 storage for files and folders that may not be registered as discrete datatypes (e.g. project documentation, raw DICOM archives, custom scripts).

### Listing S3 Files in a Project
Use `bl data query --s3` to inspect files stored in a project's S3 storage:

```bash
bl data query --project 5a022fc99c0d250055709e9c --s3
```

To list a specific subdirectory:

```bash
bl data query --project 5a022fc99c0d250055709e9c --s3 --path raw_dicoms/
```

### Downloading a Single S3 File
Specify `--project` and `--path` together:

```bash
bl data download \
    --project 5a022fc99c0d250055709e9c \
    --path raw_dicoms/sub-01.tar.gz \
    --directory ./local_downloads
```

### Downloading an S3 Folder
To download an entire folder from S3, end the path with a trailing slash (`/`). The Brainlife warehouse automatically streams the folder as an uncompressed tar archive and the CLI extracts it into your target directory:

```bash
bl data download \
    --project 5a022fc99c0d250055709e9c \
    --path raw_dicoms/ \
    --directory ./local_dicoms
```

---

## 5. Downloading Published Datasets

Brainlife allows researchers to permanently publish open datasets with DOIs. You can discover publications using `bl pub query`:

```bash
$ bl pub query --query "O3D" --json | jq .[0].releases
```

You can then download all data objects attached to a publication release using `bl bids download --pub`:

```bash
bl bids download --pub 59e51b181e188c0028e3b2e3 --output ./o3d_published_bids
```

---

## 6. Downloading Files from Active / Completed Processes (Amaretti API)

When Brainlife runs an App, intermediate and unarchived task files exist inside the computing task directory on the compute cluster. You can download specific files or folders directly from a task using the Amaretti task download API:

```python
#!/usr/bin/env python3
import os
import requests

# Load authentication token
jwt_path = os.path.expanduser('~/.config/brainlife.io/.jwt')
with open(jwt_path) as f:
    jwt = f.read().strip()

task_id = "60a7e1f48c089a1b023e10ab"
# Specify relative path inside the task directory (e.g. output/stats)
path_in_task = "output/stats"

url = f"https://brainlife.io/api/amaretti/task/download/{task_id}/{path_in_task}?at={jwt}"
res = requests.get(url, stream=True)

if res.status_code == 200:
    with open("task_stats.tar.gz", "wb") as f:
        for chunk in res.iter_content(chunk_size=8192):
            f.write(chunk)
    print("Downloaded task output successfully.")
else:
    print(f"Failed to download task files: {res.status_code}")
```
