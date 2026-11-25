# Updating and deleting datasets

You cannot change the files of a dataset once it is stored; this keeps results reproducible and provenance intact. You can change a dataset's description, subject, session, run, annotations, datatype tags and metadata with `bl data update`, and remove datasets with `bl data delete`.

---

## 1. Update a dataset (`bl data update`)

Give the dataset ID and the fields to change:

```bash
bl data update --id <data_id> --desc "New description for this dataset"
bl data update --id <data_id> --subject "sub-101"
bl data update --id <data_id> --session "ses-02"
bl data update --id <data_id> --run "1"
```

You can change several fields in one command:

```bash
bl data update \
    --id 5b031990251f5200274d9cc4 \
    --desc "Corrected subject identifier" \
    --subject "101" \
    --session "01" \
    --add_tag "verified"
```

!!! tip "Clear a field"
    To remove the subject, session or run, pass an empty string:
    ```bash
    bl data update --id <data_id> --session ""
    ```

---

## 2. Annotations and datatype tags

Datasets have two kinds of tags:

### Annotations (`--add_tag` / `--remove_tag`)
Annotations (dataset tags) are free-text labels for filtering and organizing the datasets in your project (for example `baseline`, `pre-op`, `control`). The web app shows them in the **Annotations** column of **2. Data**.

```bash
# Add a tag
bl data update --id <data_id> --add_tag "cohort-A"

# Remove an old tag
bl data update --id <data_id> --remove_tag "test"
```

### Datatype tags (`--add_dtag` / `--remove_dtag`)
Datatype tags narrow a datatype, for example to a processing state (`acpc_aligned`, `defaced`, `wNODDI`):

```bash
# Add a datatype tag
bl data update --id <data_id> --add_dtag "acpc_aligned"

# Remove a datatype tag
bl data update --id <data_id> --remove_dtag "raw"
```

*(Change datatype tags with care: Apps use them to decide which datasets are valid inputs.)*

---

## 3. Update metadata (`-m, --meta`)

brainlife.io stores acquisition and BIDS metadata as key-value pairs on each dataset. To merge new or changed fields from a JSON file into the existing metadata, use `-m` or `--meta`:

```bash
# Create or edit a JSON patch
cat > meta_update.json <<EOF
{
    "RepetitionTime": 2.0,
    "EchoTime": 0.03,
    "Manufacturer": "Siemens"
}
EOF

# Apply the update
bl data update --id 5b031990251f5200274d9cc4 -m meta_update.json
```

The CLI merges these fields into the dataset's metadata and keeps the other keys.

---

## 4. Delete a dataset (`bl data delete`)

To remove test data, failed uploads or outdated derivatives from your project:

```bash
bl data delete --id <data_id>
```

Or use the short option `-i`:

```bash
bl data delete -i 5b031990251f5200274d9cc4
```

!!! warning "Before you delete"
    Deleting a dataset marks it as removed on brainlife.io. Make sure no pipeline automations or publications depend on it first.

---

## 5. Update many datasets with a script

Combine `bl data query` and `bl data update` to change many datasets at once. `bl data query` returns at most 100 datasets unless you set `--limit`, so raise it (or page with `--skip`) for larger projects.

### Example: add an annotation to every dataset in a project

```bash
#!/usr/bin/env bash
set -e

PROJECT_ID="5afc2c8de68fc50028e90820"
TAG_TO_ADD="Cohort-2026"

# Query all datasets matching project in JSON format
echo "Fetching datasets from project..."
DATASETS=$(bl data query --project "$PROJECT_ID" --json)

# Extract IDs and apply update
echo "$DATASETS" | jq -r '.[]._id' | while read -r ID; do
    echo "Updating dataset: $ID"
    bl data update --id "$ID" --add_tag "$TAG_TO_ADD"
done

echo "Bulk update complete!"
```

### Example: make subject IDs consistent (Python)

If some subjects were uploaded with a `sub-` prefix and others without (for example `sub-001` and `001`), remove the prefix:

```python
#!/usr/bin/env python3
import json
import subprocess

project_id = "5afc2c8de68fc50028e90820"

# Fetch datasets
raw_json = subprocess.check_output([
    "bl", "data", "query", "--project", project_id, "--json"
])
objects = json.loads(raw_json)

for obj in objects:
    obj_id = obj["_id"]
    subject = obj.get("meta", {}).get("subject", "")
    
    # Strip 'sub-' prefix if present
    if subject.startswith("sub-"):
        new_subject = subject.replace("sub-", "", 1)
        print(f"Updating {obj_id}: '{subject}' -> '{new_subject}'")
        subprocess.run([
            "bl", "data", "update", "--id", obj_id, "--subject", new_subject
        ], check=True)
```
