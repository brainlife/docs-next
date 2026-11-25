# Uploading data

The CLI uploads data from your computer or cluster into a brainlife.io project. Upload one dataset at a time with `bl data upload`, or a whole BIDS folder at once with `bl bids upload`.

!!! note
    In the web app, "Upload Data From local Files" on the **Project Data** menu is shown as "Currently unavailable". The CLI is a way to upload your own data today. Each datatype page also shows CLI commands under **Upload Instructions**.

---

## What you need: a project, a datatype and a subject

Every dataset you upload needs:
1. **A project ID**: the project that receives the data.
2. **A datatype**: the specification of which files the dataset contains (for example `neuro/anat/t1w` needs a `t1.nii.gz` file).
3. **A subject**: a subject identifier (for example `sub-01` or `101`).

### 1. Find your project ID

Search with `bl project query`:

```bash
$ bl project query --query "My Study"
Id: 5afc2c8de68fc50028e90820
Name: My Study
Admins: your_username
Members: your_username
Access: private
Description: Diffusion and anatomical data
(Returned 1 result)
```

You can also filter by administrator (`--admin`), member (`--member`) or guest (`--guest`):

```bash
bl project query --admin your_username
```

In scripts, get just the ID with `--json` and `jq`:

```bash
PROJECT_ID=$(bl project query --query "My Study" --json | jq -r '.[0]._id')
```

### 2. Find the datatype

A datatype lists the files a dataset contains. Search with `bl datatype query`:

```bash
$ bl datatype query --query t1
Id: 58c33bcee13a50849b25879a
Name: neuro/anat/t1w
Description: T1 Weighted
Files: [(required) t1: t1.nii.gz]
(Returned 1 result)
```

Look at the **`Files:`** line. The name before the colon (`t1`) is the option you pass to the upload command (`--t1 <path>`).

Diffusion MRI (`neuro/dwi`) needs several files:

```bash
$ bl datatype query --query "neuro/dwi"
Id: 58c33bcee13a50849b258793
Name: neuro/dwi
Description: Diffusion Weighted MRI
Files: [(required) dwi: dwi.nii.gz, (required) bvecs: dwi.bvecs, (required) bvals: dwi.bvals]
```

Here you pass `--dwi <path>`, `--bvecs <path>` and `--bvals <path>`.

---

## Upload one dataset (`bl data upload`)

### Required options
* `-p, --project <project_id>`: the project ID.
* `-d, --datatype <datatype_name_or_id>`: the datatype name or ID (for example `neuro/anat/t1w`).
* `-s, --subject <subject_id>`: the subject (for example `sub-01`).
* `--<file_key> <path>`: the path to each file of the datatype (for example `--t1 path/to/t1.nii.gz`).

### Other options
* `-e, --session <session>`: session (for example `ses-01`).
* `-r, --run <run>`: run (for example `1`).
* `-n, --desc <description>`: a description of the dataset.
* `-t, --tag <tag>`: an annotation (dataset tag) for filtering; repeat for more.
* `--datatype_tag <tag>`: a datatype tag (for example `defaced`, `acpc_aligned`); repeat for more.
* `-m, --meta <file.json>`: a JSON sidecar file with BIDS or other metadata.
* `-j, --json`: print the uploaded dataset as JSON.

### Example: a T1-weighted image

```bash
bl data upload \
    --project 5afc2c8de68fc50028e90820 \
    --datatype neuro/anat/t1w \
    --subject "001" \
    --session "01" \
    --t1 ./data/sub-001_ses-01_T1w.nii.gz \
    --meta ./data/sub-001_ses-01_T1w.json \
    --tag "pre-op" \
    --tag "baseline" \
    --desc "Pre-operative T1w scan"
```

### Example: diffusion MRI

```bash
bl data upload \
    --project 5afc2c8de68fc50028e90820 \
    --datatype neuro/dwi \
    --subject "001" \
    --session "01" \
    --dwi ./data/sub-001_dwi.nii.gz \
    --bvecs ./data/sub-001_dwi.bvec \
    --bvals ./data/sub-001_dwi.bval \
    --meta ./data/sub-001_dwi.json
```

### What happens during an upload

When you run `bl data upload`:
1. The CLI packs the files into an archive.
2. It starts a staging job (`brainlife/app-noop`) on a brainlife.io compute resource.
3. It uploads the archive, which is unpacked on that resource.
4. If the datatype has a validator, the validator checks the dataset before it is archived. Otherwise the CLI prints "no validator registered for this datatype. skipping validation".
5. The dataset is archived and appears on the project's **2. Data** tab.

---

## Upload a BIDS folder (`bl bids upload`)

If your data is organized as [BIDS](https://bids.neuroimaging.io/){target=_blank} (with `dataset_description.json`, `sub-<id>/` folders and so on), upload it with one command:

```bash
bl bids upload -d /path/to/bids_dataset -p <project_id>
```

### What `bl bids upload` does
1. **Reads the metadata**: reads `dataset_description.json`, and loads `participants.tsv` and `participants.json` into the project's participants info.
2. **Maps files to datatypes**: finds anatomical (T1w, T2w, FLAIR, MP2RAGE), diffusion, functional (task), field map, MEG (CTF, FIF) and EEG files and maps each, with its sidecar metadata, to a brainlife.io datatype.
3. **Uploads each dataset**: goes through all subjects, sessions and runs and uploads each dataset.
4. **Creates a project if needed**: if you leave out `--project`, the CLI creates a new project named after `Name` in `dataset_description.json`.

It does not run the BIDS validator. Check your folder with the [BIDS validator](https://bids-standard.github.io/bids-validator/){target=_blank} first.

### Add annotations to a BIDS upload

To add a tag (annotation) to every uploaded dataset:

```bash
bl bids upload -d ./BIDS_DATASET -p 5afc2c8de68fc50028e90820 --tag "cohort-1"
```

---

## Check what you uploaded

List the datasets with `bl data query`:

```bash
$ bl data query --project 5afc2c8de68fc50028e90820 --subject "001"

Id: 5b031990251f5200274d9cc4
Project: My Study
Subject: 001
Session: 01
Datatype: neuro/anat/t1w
Description: Pre-operative T1w scan
Status: stored
Tags: pre-op, baseline
Create Date: 10/29/2026, 3:10:08 PM

(Returned 1 result)
```

---

## Upload many files with a script

If your files are not organized as BIDS, upload them with a bash loop:

```bash
#!/usr/bin/env bash
set -e

# Ensure logged in
bl login --ttl 30

PROJECT_ID="5afc2c8de68fc50028e90820"

for T1_FILE in raw_data/*_T1w.nii.gz; do
    # Extract subject ID from filename (e.g. sub-101_T1w.nii.gz -> sub-101)
    FILENAME=$(basename "$T1_FILE")
    SUBJECT="${FILENAME%_T1w.nii.gz}"
    
    echo "Uploading T1w for subject: $SUBJECT"
    bl data upload \
        --project "$PROJECT_ID" \
        --datatype neuro/anat/t1w \
        --subject "$SUBJECT" \
        --t1 "$T1_FILE" \
        --tag "raw"
done
```
