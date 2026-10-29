# Updating & Managing Data Objects

Data objects stored on Brainlife are immutable regarding their actual binary payload (e.g. imaging volume contents cannot be modified in-place to ensure reproducibility and provenance). However, you can update their metadata, descriptions, subject/session tags, and search tags using the `bl data update` command, or remove unwanted objects with `bl data delete`.

---

## 1. Updating Data Object Metadata (`bl data update`)

To update a data object, provide its ID along with the fields you wish to change:

```bash
bl data update --id <data_id> --desc "New description for this dataset"
bl data update --id <data_id> --subject "sub-101"
bl data update --id <data_id> --session "ses-02"
bl data update --id <data_id> --run "1"
```

You can combine multiple updates into a single command:

```bash
bl data update \
    --id 5b031990251f5200274d9cc4 \
    --desc "Corrected subject identifier" \
    --subject "101" \
    --session "01" \
    --add_tag "verified"
```

!!! tip "Clearing Fields"
    To clear an existing subject, session, or run identifier, pass an empty string:
    ```bash
    bl data update --id <data_id> --session ""
    ```

---

## 2. Managing Tags

Brainlife distinguishes between two types of tags:

### Search Tags (`--add_tag` / `--remove_tag`)
Search tags are general labels used to filter and organize data objects within your project (e.g. `baseline`, `pre-op`, `control`):

```bash
# Add a tag
bl data update --id <data_id> --add_tag "cohort-A"

# Remove an old tag
bl data update --id <data_id> --remove_tag "test"
```

### Datatype Tags (`--add_dtag` / `--remove_dtag`)
Datatype tags qualify the specific variant or processing state of the datatype (e.g. `acpc_aligned`, `defaced`, `wNODDI`):

```bash
# Add a datatype tag
bl data update --id <data_id> --add_dtag "acpc_aligned"

# Remove a datatype tag
bl data update --id <data_id> --remove_dtag "raw"
```

*(Use datatype tags cautiously, as downstream Apps may rely on specific datatype tags to match valid pipeline inputs.)*

---

## 3. Updating Sidecar / JSON Metadata (`-m, --meta`)

Brainlife stores detailed acquisition and BIDS metadata as key-value pairs associated with the data object. You can merge new or updated fields from a local JSON file into the existing metadata using `-m` or `--meta`:

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

The CLI merges these fields into the existing object's metadata without erasing other existing keys.

---

## 4. Deleting Data Objects (`bl data delete`)

If you have test data, failed uploads, or deprecated derivatives you want to remove from your project:

```bash
bl data delete --id <data_id>
```

You can also pass the ID with `-i`:

```bash
bl data delete -i 5b031990251f5200274d9cc4
```

!!! warning "Deletion is Permanent"
    Deleting a data object marks it as removed in the Brainlife warehouse. Ensure no downstream pipelines or publications depend on the data object before removing it.

---

## 5. Bulk Updating with Scripts

You can combine `bl data query` with `bl data update` to batch-process objects across an entire study.

### Example: Bulk Adding a Tag to a Cohort

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
    echo "Updating object: $ID"
    bl data update --id "$ID" --add_tag "$TAG_TO_ADD"
done

echo "Bulk update complete!"
```

### Example: Normalizing Subject IDs (Python)

If subject identifiers were uploaded with inconsistent prefixes (e.g. `sub-001` vs `001`) and you want to standardize them:

```python
#!/usr/bin/env python3
import json
import subprocess

project_id = "5afc2c8de68fc50028e90820"

# Fetch objects
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
