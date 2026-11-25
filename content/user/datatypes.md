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

## The datatype catalog

Every datatype has a record in the [datatype catalog](https://github.com/brainlife/abcd-spec/tree/master/datatypes){target=_blank} on GitHub. The short readme on a datatype's page summarizes it and links to the full record, which holds:

- what the datatype is and what each of its files contains;
- what it can and cannot be used for;
- the Apps that read or write it, and why;
- its BIDS mapping (above);
- **sharing defaults**, from the [Global Brain Governance toolkit](https://braindatagovernance.org){target=_blank}: whether it is human neurodata, a default tier, the conditions that change the tier, the kinds of information it can reveal, and what to check before sharing.

| Tier | Meaning | Example |
| :--- | :--- | :--- |
| 1 | Aggregated, no participant-level records | group statistics, segmentation scores |
| 2 | Participant-level, no direct identifiers | preprocessed diffusion data, tractograms |
| 3 | Directly identifiable or traceable | a T1w image that has not been defaced (the face is visible) |
| 4 | Functionally revealing derivatives | connectivity matrices used as fingerprints |
| 5 | Model-associated | model weights trained on neurodata |

A tier is a default for the datatype. The data itself decides: for example, a defaced T1w image moves from tier 3 to tier 2. When in doubt, treat data as the more protective tier.

The catalog is reviewed on GitHub before anything changes on brainlife.io, and the same records list candidate new datatypes drawn from BIDS for review.

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

Some datatypes have their own validator (for example `brainlife/validator-neuro-anat`, which also checks image dimensions). Datatypes without one use [`brainlife/validator-catalog`](https://github.com/brainlife/validator-catalog){target=_blank}, which checks any datatype from its file list in the catalog. Its README lists every check. The **Supports validation** filter on the Datatypes page shows which datatypes have a validator.

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
