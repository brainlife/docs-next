# Datatypes & Visualizations

In Brainlife, Apps do not exchange arbitrary files; they communicate through strictly structured **Datatypes**. A datatype defines a standardized contract specifying exactly which files, directories, extensions, and metadata structures an App produces or accepts as input.

By decoupling data formats from individual software tools, datatypes allow neuroimaging Apps from different software packages (such as FSL, FreeSurfer, AFNI, MRtrix, and ANTs) to be composed together seamlessly into automated pipelines.

---

## Anatomy of a Datatype

Every datatype on Brainlife consists of a unique name, a description, and an explicit file definition. For example, the `neuro/life` datatype specifies:

```json
{
    "name": "neuro/life",
    "desc": "Linear Fascicle Evaluation (LiFE) output structure",
    "files": [
        {
            "id": "fe",
            "filename": "output_fe.mat",
            "desc": "FE structure matrix",
            "ext": ".mat",
            "required": true
        },
        {
            "id": "life_results",
            "filename": "life_results.json",
            "desc": "Summary statistical metrics",
            "required": true
        },
        {
            "id": "tracts",
            "dirname": "tracts",
            "desc": "Evaluated tractography fiber streamlines",
            "required": true
        }
    ]
}
```

### Datatypes vs. BIDS
While Datatypes and the [Brain Imaging Data Structure (BIDS)](https://bids-specification.readthedocs.io/en/stable/){target=_blank} both standardize neuroimaging data:
- **BIDS** focuses on organizing raw dataset directories, subject hierarchies, and clinical metadata on disk.
- **Brainlife Datatypes** focus on data interchange for both raw inputs and specific derivatives produced by processing Apps. They guarantee that an App receiving a datatype receives the exact filenames and structures it expects, regardless of who ran the upstream App.

---

## The Datatypes Catalog

You can explore all registered datatypes on Brainlife by navigating to the **Datatypes** page (`/datatypes`):

### 1. Scopes: Public vs. My Datatypes
- **Public**: Browse all standardized, platform-supported datatypes available for analysis and App development.
- **My Datatypes**: View and manage custom datatypes that you have created or maintain.

### 2. Search & Filtering
- **Keyword Search**: Filter datatypes in real time by name, modality, or description.
- **Supports Validation**: Filter for datatypes that have integrated automated validator scripts. When datasets of these types are uploaded or staged, Brainlife automatically checks their internal format and integrity before running jobs.
- **Supports Jupyter Notebooks**: Filter for datatypes equipped with group analysis templates. Datasets with this capability can be loaded directly into interactive Jupyter notebooks for cross-subject statistical analysis.

### 3. Visual Identity & Color Hashing
Brainlife assigns consistent, color-coded badge chips to datatypes across the platform. Short names (such as `anat/t1w` for `neuro/anat/t1w` or `dwi` for `neuro/dwi`) make it easy to identify data types at a glance in dataset tables, process cards, and pipeline diagrams.

---

## Datatype Tags vs. Annotations (Object Tags)

Brainlife provides two distinct tagging mechanisms to manage and disambiguate data:

| Feature | Datatype Tags | Annotations (Data Object Tags) |
| :--- | :--- | :--- |
| **Purpose** | Describe **intrinsic physical or algorithmic properties** of the data that determine compatibility with Apps. | User-defined labels for **cohort organization, searching, and project management**. |
| **Examples** | `acpc_aligned`, `single-shell`, `multi-shell`, `defaced`, `freesurfer7`. | `control`, `patient`, `baseline`, `followup`, `motion_outlier`. |
| **Mutability** | **Immutable**: Set by the App that generated the derivative or specified during data staging. | **Flexible**: Can be added, modified, or removed at any time by project members. |
| **Impact on Apps** | **Direct**: Apps can require specific datatype tags on their inputs (e.g., an App may require `neuro/dwi` with the `single-shell` tag). | **Selective**: Used in pipeline rules to target specific subject subsets or resolve ambiguous datasets. |

!!! tip "Datatype Tag Inheritance"
    When an App processes an input and generates derivatives, it can pass along input datatype tags (e.g., `+input datatype tags`). This preserves critical metadata provenance—such as knowing that an anatomical parcellation came from a scan that was ACPC-aligned.

---

## Visualizing Datatypes & Datasets

Brainlife features an integrated, multi-modal visualization system. Clicking the **Visualize** button on any dataset opens the visualizer menu:

### 1. Native WebGL Viewer (NiiVue)
For NIfTI anatomical scans (`neuro/anat/t1w`, `neuro/anat/t2w`), functional volumes, and 3D surface meshes, Brainlife embeds the high-performance **NiiVue WebGL viewer**:
- Render orthogonal cross-sectional slices (axial, sagittal, coronal) with real-time zooming and panning.
- Adjust intensity windows, contrast, and color colormaps directly in the browser.
- Overlay 3D surface meshes on volumetric scans with zero installation required.

### 2. In-Browser Web Visualizers (:fa-desktop: Monitor Icon)
Lightweight web applications that launch instantly in your browser:
- **Tractography Visualizers**: Inspect fiber streamlines, bundles, and tract volumes in 3D.
- **Connectome & Matrix Viewers**: Explore structural and functional connectivity matrices with interactive parcellation chord diagrams.
- **Population Receptive Field (pRF) Viewers**: Inspect visual field mapping and cortical polar angle overlays.

### 3. Containerized Desktop Tools (:fa-server: Server Icon)
For advanced analysis, Brainlife can launch full desktop neuroimaging suites (such as **FSLeyes**, **Freeview**, or **MRView**) running inside secure Docker/Singularity containers on cloud or HPC compute resources:
- Streams the interactive desktop interface directly to your browser window.
- Provides access to native desktop tools without requiring local installation or multi-gigabyte data downloads.

### 4. Side-by-Side Multi-Dataset Comparison
When evaluating preprocessing results (such as before-and-after skull stripping or cross-modal coregistration), Brainlife allows you to select multiple datasets and launch them into synchronized, side-by-side comparison frames.

