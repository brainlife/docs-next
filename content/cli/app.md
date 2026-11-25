# Running Apps

Apps are containerized programs, each from a GitHub repository, that take datatypes in and produce datatypes out. They run reproducibly on the compute resources available to you. With the CLI you can find Apps, run them on datasets in your project, wait for them to finish and download their outputs.

---

## 1. Find an App (`bl app query`)

### By input or output datatype
To find Apps that take a given datatype as input (for example `neuro/anat/t1w`):

```bash
$ bl app query --input-datatype neuro/anat/t1w
```

Each result looks like this:

```
Id: 5a0def2eb2f8e6004a894f3b
DOI: 10.25663/bl.app.16
Name: ACPC alignment via ART
Service: brainlife/app-acpcART
Type: (0: neuro/anat/t1w) -> (0: neuro/anat/t1w<acpc_aligned>)
Description: ...
Config:
    crop: (type: boolean) (default: true)
    reorient: (type: boolean) (default: true)
```

Read the **`Type:`** line as `(inputs) -> (outputs)`, each written as `<id>: <datatype><datatype tags>`:
* **Input**: an input with ID `0` of datatype `neuro/anat/t1w`.
* **Output**: an output with ID `0` of datatype `neuro/anat/t1w` with the datatype tag `acpc_aligned`.

A `[]` after a datatype means the input accepts several datasets; a `?` means it is optional.

Use `--output-datatype` to find Apps that produce a datatype. You can repeat both options.

### By keyword
Search App names and descriptions:

```bash
bl app query --query "freesurfer"
bl app query --query "tractography"
```

Other options: `--id <app_id>`, `--doi <doi>`, `--skip`, `--limit` and `--json`.

---

## 2. Run an App (`bl app run`)

To run an App, give:
1. `--id <app_id>`: the App to run.
2. `--project <project_id>`: the project where the outputs are archived.
3. `--input <input_id>:<dataset_id>`: one for each input, using the input IDs from the `Type:` line. Repeat `--input` for several inputs. Each dataset must have the input's datatype and required datatype tags.
4. `--config '<json>'`: the App's parameters, as JSON (optional).

### Example: ACPC alignment

```bash
$ bl app run \
    --id 5a0def2eb2f8e6004a894f3b \
    --project <project_id> \
    --input 0:<t1w_dataset_id> \
    --config '{"reorient": true, "crop": true}' \
    --tag "processed_cli"
```

### More options
* `--preferred-resource <resource_id>`: a compute resource you would like the job to run on (find IDs with `bl resource query`). brainlife.io uses it if it can.
* `--branch <branch>`: run another branch of the App's repository. By default the CLI runs the branch registered for the App.
* `--tag <tag>`: add an annotation (dataset tag) to the archived outputs; repeat for more.
* `--json` (or `-j`): print the created job (task) as JSON, for example to read its ID.

---

## 3. Wait for a job (`bl app wait`)

When you run an App, brainlife.io creates a job (a task in [Amaretti](/docs/technical/amaretti/)). To wait until it finishes and its outputs are archived:

```bash
bl app wait --id <task_id>
```

In a terminal, the CLI prints the job status as it changes, then `(done waiting)`.

---

## 4. A complete script

This bash script uploads a T1-weighted image, runs ACPC alignment on it, waits for the job and downloads the outputs:

```bash
#!/usr/bin/env bash
set -e

# 1. Log in (token valid for 30 days)
bl login --ttl 30

PROJECT_ID="<project_id>"
SUBJECT="sub-001"

# 2. Upload the T1w image
echo "Uploading T1w image..."
UPLOAD_RES=$(bl data upload \
    --project "$PROJECT_ID" \
    --datatype neuro/anat/t1w \
    --subject "$SUBJECT" \
    --t1 ./raw_data/sub-001_T1w.nii.gz \
    --tag "raw" \
    --json)

INPUT_T1_ID=$(echo "$UPLOAD_RES" | jq -r '._id')
echo "T1w uploaded with ID: $INPUT_T1_ID"

# 3. Run ACPC alignment
echo "Running ACPC alignment..."
APP_ID="5a0def2eb2f8e6004a894f3b"
APP_TASK=$(bl app run \
    --id "$APP_ID" \
    --project "$PROJECT_ID" \
    --input "0:$INPUT_T1_ID" \
    --config '{"reorient": true, "crop": true}' \
    --tag "acpc_cli" \
    --json)

TASK_ID=$(echo "$APP_TASK" | jq -r '._id')
echo "Job created: $TASK_ID"

# 4. Wait for it to finish
echo "Waiting for the job..."
bl app wait --id "$TASK_ID"

# 5. Find and download the outputs
echo "Querying output datasets..."
OUTPUT_IDS=$(bl data query --taskid "$TASK_ID" --json | jq -r '.[]._id')

for OUT_ID in $OUTPUT_IDS; do
    echo "Downloading output dataset: $OUT_ID"
    bl data download --id "$OUT_ID" --directory "./outputs/$SUBJECT/$OUT_ID"
done

echo "Done."
```
