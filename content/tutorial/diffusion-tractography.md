# Diffusion Tractography and White Matter Tractometry

This tutorial demonstrates the standard pipeline used to perform whole-brain diffusion tractography, major white matter tract segmentation, and tractometry analysis on **brainlife.io** ([connects.brainlife.io](https://connects.brainlife.io/){target=_blank}).

The goal of this tutorial is to process anatomical and diffusion MRI data to:
* **Generate whole-brain tractograms** using Constrained Spherical Deconvolution (CSD) and Anatomically-Constrained Tractography (ACT).
* **Segment major white matter tracts** (such as the Arcuate Fasciculus, Corticospinal Tract, and Corpus Callosum) with automated anatomical segmentation.
* **Remove outlier streamlines** to isolate biologically plausible tract cores.
* **Map microstructural profiles (tractometry)** along each tract's length for group statistical comparisons.

This tutorial builds on concepts from the [Introduction to brainlife.io](/docs/tutorial/introduction-to-brainlife), [Anatomical Preprocessing](/docs/tutorial/t1w-preprocessing), and [Diffusion MRI Preprocessing](/docs/tutorial/diffusion-preprocessing) tutorials.

---

## Tractography & Tractometry Overview

```
[ACPC T1w & Preprocessed dMRI]
              │
              ▼
1. FreeSurfer 7.3.2 ─────────────► Cortical & subcortical parcellations, 5-tissue-type (5TT) mask
              │
              ▼
2. MRtrix3 ACT / CSD ────────────► Constrained Spherical Deconvolution & Whole-Brain Tractogram
              │
              ▼
3. White Matter Segmentation ────► Classifies streamlines into 61 major white matter tracts
              │
              ▼
4. Tract Outlier Removal ────────► Prunes anatomically aberrant or divergent streamlines
              │
              ▼
5. Tract Profile Extraction ─────► Samples DTI/NODDI metrics at 100 equidistant nodes along each tract
              │
              ▼
6. Group Analysis (Notebooks) ───► Statistical testing and visualization in Jupyter notebooks
```

### 1. Constrained Spherical Deconvolution (CSD) & ACT
Unlike simple tensor models that assume only a single fiber orientation per voxel, **Constrained Spherical Deconvolution (CSD)** estimates the continuous fiber orientation distribution function (fODF). This allows tractography algorithms to track through complex regions of crossing, kissing, and branching fibers. **Anatomically-Constrained Tractography (ACT)** utilizes FreeSurfer tissue boundaries (5TT segmentation) to ensure streamlines begin and terminate only in gray matter and do not traverse cerebrospinal fluid.

### 2. Automated White Matter Segmentation
Once millions of whole-brain streamlines are generated, the **[White Matter Anatomy Segmentation](https://brainlife.io/app/5cc73ef44ed9df00317f6288){target=_blank}** App uses digital anatomical waypoint ROIs and cortical parcellations to segment the whole-brain tractogram into 61 reproducible major white matter tracts.

### 3. Tract Profiles (Tractometry)
Rather than averaging diffusion values across an entire tract volume, **tract profiles** sample microstructural metrics (FA, MD, RD, AD, or NODDI parameters) at 100 equidistant nodes along the central trajectory of each tract. This reveals localized focal differences between clinical cohorts.

---

## Step 1: Copy Tutorial Data

1. In your project on [brainlife.io](https://connects.brainlife.io/){target=_blank}, open the **2. Data** tab.
2. Open the **Project Data** menu and choose "Copy Data From another Project".
3. Open the *Tutorial Data* project (`5ae916e7f446980028b15eb3`) and copy these datasets for subject `10217` to your project:
    * `dwi` (Preprocessed diffusion dataset)
    * `anat/t1w` (Raw or ACPC-aligned T1w image)
4. Confirm. The datasets appear in your project's **Project Data** table.

---

## Step 2: Anatomical Alignment & FreeSurfer Parcellation

1. On **2. Data**, select your `anat/t1w` and `dwi` datasets and select **Stage to process**.
2. In **Add to process**, choose "Create a new process", name it `Tractography Pipeline`, and select **Add and open editor**.
3. In the process editor, select **Add App**:
    * Run **[FSL Anat (T1)](https://brainlife.io/app/5e3c87ae9362b7166cf9c7f4){target=_blank}** to generate an ACPC-aligned anatomical image (`anat/t1w` with the datatype tag `acpc_aligned`).
4. Next, add **[FreeSurfer 7.3.2](https://brainlife.io/app/5fe1056057aacd480f2f8e48){target=_blank}** using the ACPC-aligned T1w output to reconstruct the cortical surfaces and tissue segmentations.

---

## Step 3: Whole-Brain Anatomically-Constrained Tractography

1. In the process editor, select **Add App**.
2. **Select App**: search for **MRtrix3 Anatomically-Constrained Tractography (ACT)** ([App Link](https://brainlife.io/app/5e9dced9f1745d6994f692c0){target=_blank}) and select it.
3. Set the parameters (**Configure App Settings**) and inputs (**Select Inputs**):
    * **dwi**: Preprocessed, ACPC-aligned `dwi` dataset.
    * **anat**: ACPC-aligned `anat/t1w` dataset.
    * **freesurfer**: Completed FreeSurfer output directory (used to generate the 5-tissue-type mask).
    * **num_fibers**: Set to `1000000` (or `100000` for rapid testing).
4. On **Configure Outputs**, keep **Archive Output** on, then select **Add App**.

When the job finishes, select **Visualize** on the `track/tck` output and choose the **3D Tract Viewer** to inspect the whole-brain streamlines in your browser.

---

## Step 4: Segment Major White Matter Tracts

1. In the process editor, select **Add App**.
2. **Select App**: search for **White Matter Anatomy Segmentation** ([App Link](https://brainlife.io/app/5cc73ef44ed9df00317f6288){target=_blank}) and select it.
3. Set the parameters (**Configure App Settings**) and inputs (**Select Inputs**):
    * **freesurfer**: FreeSurfer output.
    * **track/tck**: Whole-brain tractogram from Step 3.
4. On **Configure Outputs**, keep **Archive Output** on, then select **Add App**.

This App classifies streamlines into major association, projection, and commissural bundles (e.g. IFOF, ILF, SLF, Arcuate, CST).

---

## Step 5: Clean Outlier Streamlines

1. In the process editor, select **Add App**.
2. **Select App**: search for **Remove Tract Outliers** ([App Link](https://brainlife.io/app/5cc9eca04b5e4502275edba6){target=_blank}) and select it.
3. **Select Inputs**: choose the segmented tract output from Step 4.
4. On **Configure Outputs**, keep **Archive Output** on, then select **Add App**.

The cleaned tract classification output (`wmc`) retains only coherent bundle cores.

---

## Step 6: Extract Along-Tract Microstructural Profiles

1. In the process editor, select **Add App**.
2. **Select App**: search for **Tract Analysis Profiles** ([App Link](https://brainlife.io/app/5ed02b780a8ed88a57482c92){target=_blank}) and select it.
3. Set the parameters (**Configure App Settings**) and inputs (**Select Inputs**):
    * **wmc**: Cleaned tract classification output.
    * **track/tck**: Whole-brain tractogram.
    * **tensor**: DTI tensor maps (e.g. from FSL DTIFit).
4. On **Configure Outputs**, keep **Archive Output** on, then select **Add App**.

This produces a `neuro/tractprofile` dataset containing 100-node profiles of Fractional Anisotropy, Mean Diffusivity, and Radial Diffusivity for each bundle.

---

## Step 7: Macrostructural Tract Statistics

1. In the process editor, select **Add App**.
2. **Select App**: search for **Tractography Quality Check / Macrostructural Statistics** ([App Link](https://brainlife.io/app/5cc9c6b44b5e4502275edb4b){target=_blank}) and select it.
3. **Select Inputs**: choose the cleaned `wmc` and the `track/tck` outputs.
4. On **Configure Outputs**, keep **Archive Output** on, then select **Add App**.

This extracts summary volumetric and geometric metrics (mean tract length, volume, streamline count, endpoint spread) into tidy `.csv` tables.

---

## Next Steps

* **[Group Analysis](/docs/user/groupanalysis)**: load your `tractprofile` and macrostructural summary tables into a Jupyter notebook (**4. Analysis**) for ANOVA, regression models and tractometry plots.
* **[Structural Network Neuroscience](/docs/tutorial/networkneuroscience-structural)**: Combine tractography streamlines with multi-atlas parcellations to build whole-brain structural connectomes.
