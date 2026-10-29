# Running Apps

Brainlife Apps are containerized neuroimaging pipelines and algorithms (packaged as Docker/Singularity containers) that execute reproducibly on high-performance compute resources. Using the Brainlife CLI, you can query available Apps, run them with specific inputs and parameters, monitor their execution, and retrieve their output data objects.

---

## 1. Finding Apps (`bl app query`)

Before running an App, discover which Apps are available to process your data.

### Query by Input Datatype
To find Apps that accept a specific input datatype (e.g. `neuro/anat/t1w`):

```bash
$ bl app query --input-datatype neuro/anat/t1w

Id: 5ac01066029f78002be2c481
Name: ACPC alignment via ART
Type: (t1: neuro/anat/t1w) -> (t1: neuro/anat/t1w<acpc_aligned>)
Description: This app uses the Automatic Registration Toolbox (ART) to perform ACPC alignment of the T1 image.

(Returned 6 results)
```

Notice the **`Type:`** signature:
`(t1: neuro/anat/t1w) -> (t1: neuro/anat/t1w<acpc_aligned>)`
* **Inputs**: It expects an input with key `t1` of datatype `neuro/anat/t1w`.
* **Outputs**: It produces an output with key `t1` of datatype `neuro/anat/t1w` tagged as `acpc_aligned`.

### Query by Keyword
You can also search for Apps by name or description:

```bash
bl app query --query "freesurfer"
bl app query --query "tractography"
```

---

## 2. Running an App (`bl app run`)

To run an App, you need:
1. `--id <app_id>`: The ID of the App to run.
2. `--project <project_id>`: The project where outputs will be stored.
3. `--input <key>:<data_object_id>`: One or more input mappings matching the App's input keys.
4. `--config '<json_string>'`: Optional configuration parameters for the App.

### Example: Running ACPC Alignment

```bash
$ bl app run \
    --id 5ac01066029f78002be2c481 \
    --project 5afc2c8de68fc50028e90820 \
    --input t1:5b031990251f5200274d9cc4 \
    --config '{"reorient": true, "crop": true}' \
    --tag "processed_cli"
```

### Advanced Options
* `--preferred-resource <resource_id>`: Specify a preferred compute resource or cluster registered on Brainlife (query resources via `bl resource query`).
* `--branch <branch>`: Execute a specific branch of the App repository (default is the production branch).
* `--tag <tag>`: Add custom tags to the resulting archived output data objects (repeatable).
* `--json` (or `-j`): Output the created task metadata in JSON format (useful for capturing the task ID).

---

## 3. Monitoring Execution (`bl app wait`)

When you submit an App, Brainlife creates an asynchronous processing task on Amaretti. You can wait for the task to finish using `bl app wait`:

```bash
bl app wait --id <task_id>
```

The CLI displays live progress and notifies you once execution and output archiving are complete:

```
ACPC alignment via ART Task (5b031dacc1b8f90044ad6c3b): running (1m 12s)
ACPC alignment via ART Task (5b031dacc1b8f90044ad6c3b): archiving
ACPC alignment via ART Task (5b031dacc1b8f90044ad6c3b): finished
```

---

## 4. End-to-End Automation Script

Here is an end-to-end Bash script that uploads raw data, launches an App, waits for completion, and downloads the resulting outputs automatically:

```bash
#!/usr/bin/env bash
set -e

# 1. Login (keeps token valid for 30 days)
bl login --ttl 30

PROJECT_ID="5afc2c8de68fc50028e90820"
SUBJECT="sub-001"

# 2. Upload raw T1w image
echo "Uploading raw T1w image..."
UPLOAD_RES=$(bl data upload \
    --project "$PROJECT_ID" \
    --datatype neuro/anat/t1w \
    --subject "$SUBJECT" \
    --t1 ./raw_data/sub-001_T1w.nii.gz \
    --tag "raw" \
    --json)

INPUT_T1_ID=$(echo "$UPLOAD_RES" | jq -r '._id')
echo "Raw T1w uploaded with ID: $INPUT_T1_ID"

# 3. Submit ACPC Alignment App
echo "Submitting ACPC Alignment App..."
APP_ID="5ac01066029f78002be2c481"
APP_TASK=$(bl app run \
    --id "$APP_ID" \
    --project "$PROJECT_ID" \
    --input "t1:$INPUT_T1_ID" \
    --config '{"reorient": true, "crop": true}' \
    --tag "acpc_cli" \
    --json)

TASK_ID=$(echo "$APP_TASK" | jq -r '._id')
echo "App task created: $TASK_ID"

# 4. Wait for completion
echo "Waiting for task to complete..."
bl app wait --id "$TASK_ID"

# 5. Query and download the resulting output
echo "Querying output datasets..."
OUTPUT_IDS=$(bl data query --taskid "$TASK_ID" --json | jq -r '.[]._id')

for OUT_ID in $OUTPUT_IDS; do
    echo "Downloading output data object: $OUT_ID"
    bl data download --id "$OUT_ID" --directory "./outputs/$SUBJECT"
done

echo "Pipeline execution finished successfully!"
```
