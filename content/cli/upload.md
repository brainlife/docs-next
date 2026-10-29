# Uploading Data

Brainlife CLI allows you to upload neuroimaging data objects directly from your local computer or cluster. You can upload individual data objects with `bl data upload`, or upload an entire structured dataset at once with `bl bids upload`.

---

## Prerequisites: Projects & Datatypes

Every data object uploaded to Brainlife must be associated with:
1. **A Project ID**: The destination project where data will be stored.
2. **A Datatype**: The data structure specification defining which files are required (e.g. `neuro/anat/t1w` requires a `t1.nii.gz` file).
3. **A Subject Name**: A subject identifier (e.g. `sub-01` or `101`).

### 1. Finding Your Project ID

To find your project's ID, search using `bl project query`:

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

You can also filter by administrator or member:

```bash
bl project query --admin your_username
```

To extract just the project ID in scripts, pass `--json` and use `jq`:

```bash
PROJECT_ID=$(bl project query --query "My Study" --json | jq -r '.[0]._id')
```

### 2. Finding the Right Datatype

Brainlife datatypes specify the file format and required files for each modality. Search for matching datatypes with `bl datatype query`:

```bash
$ bl datatype query --query t1
Id: 58c33bcee13a50849b25879a
Name: neuro/anat/t1w
Description: T1 Weighted
Files: [(required) t1: t1.nii.gz]
(Returned 1 result)
```

Notice the **`Files:`** section. The identifier before the colon (`t1`) is the file flag name you will pass to the upload command (i.e. `--t1 <path>`).

For diffusion MRI (`neuro/dwi`), multiple files are required:

```bash
$ bl datatype query --query "neuro/dwi"
Id: 58c33bcee13a50849b258793
Name: neuro/dwi
Description: Diffusion Weighted MRI
Files: [(required) dwi: dwi.nii.gz, (required) bvecs: dwi.bvecs, (required) bvals: dwi.bvals]
```

Here you must provide `--dwi <path>`, `--bvecs <path>`, and `--bvals <path>`.

---

## Method 1: Uploading Individual Data Objects (`bl data upload`)

To upload an individual data object, run `bl data upload`. 

### Required Parameters
* `-p, --project <project_id>`: Target Brainlife project ID.
* `-d, --datatype <datatype_name_or_id>`: Name or ID of the datatype (e.g. `neuro/anat/t1w`).
* `-s, --subject <subject_id>`: Subject identifier (e.g. `sub-01`).
* `--<file_key> <path>`: Path to each file required by the datatype (e.g. `--t1 path/to/t1.nii.gz`).

### Optional Parameters
* `-e, --session <session>`: Session label (e.g. `ses-01`).
* `-r, --run <run>`: Run label (e.g. `1`).
* `-n, --desc <description>`: Text description for this data object.
* `-t, --tag <tag>`: Custom tag for searching (can be specified multiple times).
* `--datatype_tag <tag>`: Datatype tag (e.g. `defaced`, `acpc_aligned`).
* `-m, --meta <file.json>`: Path to a JSON sidecar file containing BIDS-compliant or custom metadata.
* `-j, --json`: Output uploaded dataset details in JSON format.

### Example: Uploading an Anatomical T1w Image

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

### Example: Uploading a Diffusion MRI Dataset

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

### The Upload Process

When you run `bl data upload`:
1. The CLI bundles the files into an archive.
2. It submits a temporary staging task (`app-noop`) on Brainlife compute services.
3. The data is uploaded and untarred on the staging resource.
4. If a validator is registered for that datatype (e.g. BIDS / neuroimaging validation), it validates the dataset before archiving.
5. The object is registered and becomes visible in your project's **Archive / Data** view.

---

## Method 2: Uploading Complete BIDS Datasets (`bl bids upload`)

If your data is already organized following the [BIDS (Brain Imaging Data Structure)](https://bids.neuroimaging.io/){target=_blank} standard (containing `dataset_description.json`, `sub-<id>/` folders, etc.), you can upload your entire dataset with a single command:

```bash
bl bids upload -d /path/to/bids_dataset -p <project_id>
```

### What `bl bids upload` does:
1. **Validates BIDS**: Runs the BIDS validator to ensure folder and filename specifications are compliant.
2. **Parses Metadata**: Automatically ingests `dataset_description.json`, `participants.tsv`, and `participants.json`, updating participant demographics in your project.
3. **Automatic Datatype Mapping**: Detects `anat`, `dwi`, `func`, `fmap`, and other modalities, mapping them to the proper Brainlife datatypes and sidecar metadata.
4. **Batch Staging**: Iterates over all subjects, sessions, and runs, uploading and registering each data object automatically.
5. **Auto-Project Creation**: If you omit `--project`, the CLI will automatically create a new project using the name and description from `dataset_description.json`.

### Adding Tags to BIDS Uploads

You can attach tags to all data objects uploaded from the BIDS folder:

```bash
bl bids upload -d ./BIDS_DATASET -p 5afc2c8de68fc50028e90820 --tag "cohort-1"
```

---

## Verifying Uploaded Data

After uploading, you can verify your data objects using `bl data query`:

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

## Scripting Bulk Uploads

If you have raw data files organized in custom directories (not in BIDS format), you can automate uploads with a bash loop:

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
