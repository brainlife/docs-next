# Downloading data

With the CLI you can download single datasets, a project's data as a BIDS folder, the data of a publication release, and the files of projects stored on S3.

---

## 1. Find the datasets

First find the project and the datasets you want.

### Find the project ID
Search for a project by name or keyword with `bl project query`:

```bash
$ bl project query --query "O3D"
Id: 5a022fc99c0d250055709e9c
Name: O3D
Admins: hayashis, avesani, frakkopesto
Access: public
Description: O3D (Open Diffusion Data and Derivative)
(Returned 1 result)
```

### Find datasets in the project
List the project's datasets with `bl data query`:

```bash
$ bl data query --project 5a022fc99c0d250055709e9c --subject "0008"

Id: <dataset_id>
Project: O3D
Admins: ...
Members: ...
Guests: ...
Subject: 0008
Session: 
Run: 
Datatype: neuro/wmc<dt_stream, afq>
Description: AFQ with no Life (dt_stream) run1
Create Date: ...
Storage: ...
Status: stored
Tags: dt_stream, pre_life, run1
```

Filter the results with:
* `--datatype <name_or_id>`: datatype (for example `neuro/anat/t1w`).
* `--subject <subject>`, `--session <session>`, `--run <run>`: subject, session or run.
* `--tag <tag>`: annotation (dataset tag); repeatable.
* `--datatype_tag <dtag>`: datatype tag; repeatable.
* `--pub <release_id>`: datasets in a publication release.
* `--taskid <task_id>`: datasets produced by a job.
* `--skip <n>` and `--limit <n>`: page through the results.
* `--json`: print the full records as JSON.

---

## 2. Download one dataset (`bl data download`)

With the ID of a dataset, download it with `bl data download`:

```bash
bl data download --id 5a050ad5d76a2a002737e572 --directory ./t1_output
```

* `--id <id>` (or `-i`): the dataset ID. You can also give it without the option: `bl data download 5a050ad5d76a2a002737e572`.
* `--directory <dir>` (or `-d`): the folder to unpack the files into. Without it, the CLI creates a folder named after the dataset ID.
* `--json` (or `-j`): print details as JSON instead of progress messages.

The folder then holds the files of the dataset's datatype:

```bash
$ ls ./t1_output
t1.nii.gz
```

---

## 3. Download as BIDS (`bl bids download`)

Instead of downloading datasets one by one and arranging the folders yourself, use `bl bids download`. It finds the datasets, builds a BIDS folder tree and downloads the files into it:

```bash
bl bids download --project 5a022fc99c0d250055709e9c --output ./my_bids_dataset
```

### Filter what you download

Download only the subjects and datatypes you need:

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

* `--project <project_id>`: the project.
* `--subject <subject_id>`: subjects to include (repeatable).
* `--datatype <datatype>`: datatypes to include (repeatable).
* `--tag <tag>`: annotations (dataset tags) to require (repeatable; put `!` in front to exclude, for example `!bad`).
* `--datatype_tag <dtag>`: datatype tags to require (repeatable; `!` excludes).
* `--id <dataset_id>`: specific datasets (repeatable).
* `--pub <release_id>`: the datasets of a publication release (see below).
* `--limit <n>`: the maximum number of datasets (default 100).
* `--output <dir>`: the destination folder.

---

## 4. Download project files from S3

Some projects keep files and folders on S3 that are not datasets of a datatype (for example documentation, raw DICOM archives or scripts). In the web app, these projects open **2. Data** as a file browser.

### List the files
Use `bl data query --s3`:

```bash
bl data query --project 5a022fc99c0d250055709e9c --s3
```

To list a folder:

```bash
bl data query --project 5a022fc99c0d250055709e9c --s3 --path raw_dicoms/
```

### Download one file
Give `--project` and `--path` together:

```bash
bl data download \
    --project 5a022fc99c0d250055709e9c \
    --path raw_dicoms/sub-01.tar.gz \
    --directory ./local_downloads
```

### Download a folder
End the path with a slash (`/`). brainlife.io streams the folder as a tar archive and the CLI unpacks it into your folder:

```bash
bl data download \
    --project 5a022fc99c0d250055709e9c \
    --path raw_dicoms/ \
    --directory ./local_dicoms
```

---

## 5. Download the data of a publication

A publication shares results with a DOI, and its releases list the published data objects. Find a publication and the IDs of its releases with `bl pub query`:

```bash
$ bl pub query --query "Open Diffusion Data Derivatives" --json | jq '.[0].releases[] | {_id, name}'
```

Then download a release's data with `bl bids download --pub <release_id>`. For example, release 1 of Open Diffusion Data Derivatives:

```bash
bl bids download --pub 5bab993aa918ae0027024192 --output ./o3d_published_bids
```

---

## 6. Download files from a job's working directory (Amaretti API)

While a job's working directory still exists on the compute resource, it holds files that were not archived (intermediate files, logs). You can download a file or folder from it with the [Amaretti](/docs/technical/api/) task download API. A folder is sent as a `.tar.gz` stream:

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
