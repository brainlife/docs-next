# Datatypes and visualization

Apps on brainlife.io do not exchange arbitrary files. They exchange **datatypes**. A datatype specifies which files and folders a dataset contains, so that "Apps process data, taking in specific datatypes as input and producing resulting datatypes." Because Apps agree on datatypes, the output of one App can be the input of another, even when the two Apps wrap different software (for example FSL, FreeSurfer, MRtrix3 or ANTs).

---

## What a datatype defines

A datatype has a name (for example `neuro/anat/t1w` or `neuro/dwi`), a description, and a list of the files and folders a dataset of that type contains. For example, a `neuro/dwi` dataset contains `dwi.nii.gz`, `dwi.bvecs` and `dwi.bvals`.

The definition is stored as JSON. This example, for the `neuro/life` datatype, lists two files and one folder:

```json
{
    "name": "neuro/life",
    "desc": "Linear Fascicle Evaluation (LiFE) output structure",
    "files": [
        { "id": "fe", "filename": "output_fe.mat", "required": true },
        { "id": "life_results", "filename": "life_results.json", "required": true },
        { "id": "tracts", "dirname": "tracts", "required": true }
    ]
}
```

### Datatypes and BIDS

Datatypes and [BIDS](https://bids-specification.readthedocs.io/en/stable/){target=_blank} both standardize data, for different purposes:

- **BIDS** organizes a whole dataset on disk: folders, subjects, sessions and metadata.
- **Datatypes** describe one item of data, raw or derived, so that an App receives exactly the files it expects, whoever produced them.

Each datatype records how it corresponds to BIDS (a BIDS datatype such as `anat` plus a suffix such as `T1w`):

| Match | Meaning | Example |
| :--- | :--- | :--- |
| **Equivalent** | Same content and files as the BIDS suffix. | `neuro/anat/t1w` and `anat/T1w` |
| **Partial** | A subset or superset, several suffixes bundled, or tags needed to tell them apart. | `neuro/fmap` and the `fmap` suffixes |
| **None** | BIDS has no counterpart, usually because BIDS does not standardize that derivative. | `neuro/tractmeasures` |

BIDS sidecar files (`.json`, `.tsv`) are either carried as files, rebuilt on export from the metadata brainlife.io keeps for each dataset, or noted as missing. The export to BIDS uses this mapping.

---

## About a datatype: uses, BIDS and sharing

The brainlife.io team keeps a reviewed record of every datatype. What you see on a datatype's page comes from it:

- the description and what each file contains;
- in the readme: what the datatype can and cannot be used for, its BIDS mapping (above), its default sharing tier, and how many Apps read or write it.

The sharing tier follows the [Global Brain Governance toolkit](https://braindatagovernance.org){target=_blank}:

| Tier | Meaning | Example |
| :--- | :--- | :--- |
| 1 | Aggregated, no participant-level records | group statistics, segmentation scores |
| 2 | Participant-level, no direct identifiers | preprocessed diffusion data, tractograms |
| 3 | Directly identifiable or traceable | a T1w image that has not been defaced (the face is visible) |
| 4 | Functionally revealing derivatives | connectivity matrices used as fingerprints |
| 5 | Model-associated | model weights trained on neurodata |

A tier is a default for the datatype. The data itself decides: for example, a defaced T1w image moves from tier 3 to tier 2. When in doubt, treat data as the more protective tier.

Changes to datatypes are reviewed before they reach brainlife.io. New BIDS datatypes are proposed for review the same way before they are added.

---

## Browse datatypes

- **Datatypes** (sidebar, under **Explore**): the catalog of all datatypes.
- **My Datatypes**: datatypes you administer.

Search by name or description, and filter by **Supports validation** (the datatype has a validator that checks new datasets) or **Supports Jupyter notebooks**.

A datatype's page shows:

- **About**: what the datatype is.
- **Files & directories**: the files and folders a dataset of this type contains.
- **Official tags**: the datatype tags officially supported for this datatype.
- **Apps**: Apps that take this datatype as input or produce it as output.
- **Maintainers**, **Sample Data** and **Visualizers**: who maintains the datatype, example datasets, and the viewers that can open it.
- **Upload Instructions**: how to upload data of this type with the command-line tool.

To create a datatype, open **My Datatypes**, select **Datatype** (the button with a plus sign), enter a **Name** and **Description**, and select **Create datatype**. You can add files, tags and a validator after it is created.

---

## Validation

When a dataset is uploaded (from the web app or with `bl data upload`), brainlife.io runs the datatype's **validator** before archiving it. The validator checks the files and reports:

- **Errors**, which stop the upload: a required file is missing, a file is empty, or a file is not in its format (for example a truncated `.nii.gz`, a file that is not a NIfTI image, or JSON that does not parse).
- **Warnings**, which are shown but let the upload through: for example a TSV file with uneven columns, or `bvals` and `bvecs` with different numbers of entries.

Some datatypes have their own validator (for example `brainlife/validator-neuro-anat`, which also checks image dimensions). Datatypes without one use [`brainlife/validator-catalog`](https://github.com/brainlife/validator-catalog){target=_blank}, which checks any datatype from its list of files. The **Supports validation** filter on the Datatypes page shows which datatypes have a validator.

What `brainlife/validator-catalog` checks:

| Check | Result if it fails |
| :--- | :--- |
| A required file or folder was uploaded | error |
| A file is not empty | error |
| A gzip file (`.nii.gz`, `.mgz`, `.gz`) decompresses completely | error |
| A NIfTI file has a valid NIfTI-1 or NIfTI-2 header | error |
| A JSON file parses | error |
| `bvals` and `bvecs` contain only numbers | error |
| A file starts like its format: MGH/MGZ, PNG, JPEG, PDF, HDF5, ZIP/TRX, MATLAB/EEGLAB, EDF, BDF, FIF, BrainVision header, MRtrix `.tck`, TrackVis `.trk` | error |
| A TSV or CSV file has a header row and even columns | warning |
| `bvecs` has 3 rows; `bvals` and `bvecs` have the same number of entries, matching the DWI volumes | warning |
| An SVG, HTML or GIfTI file contains its usual markup | warning |
| A folder is not empty; a Zarr folder contains `zarr.json`, `.zgroup` or `.zarray` | warning |

The format of each file comes from its name in the datatype (for example `channels.tsv` is checked as TSV). Files with other extensions are only checked for being present and not empty. A problem inside the validator itself is reported as a warning and never stops an upload, and the metadata and tags you give at upload are kept.

---

## Datatype tags

brainlife.io has two kinds of labels on datasets.

| | Datatype tags | Annotations |
| :--- | :--- | :--- |
| **Purpose** | Narrow a datatype, so Apps get compatible input. | Organize and filter datasets in a project. |
| **Examples** | `acpc_aligned`, `preprocessed`, `single-shell`, `defaced` | `control`, `patient`, `baseline` |
| **Who sets them** | The App that produced the dataset, or the uploader. | You and your project members, at any time. |
| **Effect on Apps** | An App can require an input datatype tag (for example `neuro/dwi` with `single-shell`). | Automations can use them to choose between several matching datasets. |

Older pages call annotations "tags". In the app, filters are labeled **Datatype** and **Annotations**, and a pipeline uses "Filter by Datatype Tag" and "Filter by Annotation" to resolve ambiguous inputs.

---

## Look at a dataset

Datasets open in your browser; you do not need to download them.

1. On a project's **2. Data** tab, select **Visualize** (the eye icon) in the dataset's row, or open the dataset and select **Visualize**.
2. Choose a viewer. The list shows the viewers registered for that datatype (see **Visualizers** on the datatype's page). Examples:
    - **NiiVue**: volumes, surfaces and streamlines (for example NIfTI images, tractography, OME-Zarr).
    - **Neuroglancer**: large volumes such as microscopy and electron microscopy.
    - **Neurosift**: NWB files.
    - Some datatypes also offer desktop programs, such as MrView or ITK-SNAP, that run on a server and stream to your browser.
3. To overlay compatible datasets, for example a T1w image with a mask or parcellation, select them in the table and choose **Visualize together**, then **MrView** or **ITK-SNAP**.

![Viewing datasets](../img/connect_datasets/visualization.png)
