# Diffusion Tractography and White Matter Tractometry

This tutorial demonstrates the standard pipeline used to perform whole-brain diffusion tractography, major white matter tract segmentation, and tractometry analysis on **Brainlife Connects** ([connects.brainlife.io](https://connects.brainlife.io/){target=_blank}).

The goal of this tutorial is to process anatomical and diffusion MRI data to:
* **Generate whole-brain tractograms** using Constrained Spherical Deconvolution (CSD) and Anatomically-Constrained Tractography (ACT).
* **Segment major white matter tracts** (such as the Arcuate Fasciculus, Corticospinal Tract, and Corpus Callosum) with automated anatomical segmentation.
* **Remove outlier streamlines** to isolate biologically plausible tract cores.
* **Map microstructural profiles (tractometry)** along each tract's length for group statistical comparisons.

This tutorial builds on concepts from the [Introduction to Brainlife Connects](/docs/tutorial/introduction-to-brainlife), [Anatomical Preprocessing](/docs/tutorial/t1w-preprocessing), and [Diffusion MRI Preprocessing](/docs/tutorial/diffusion-preprocessing) tutorials.

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
6. Group Analysis (Notebooks) ───► Statistical testing and visualization in cloud JupyterLab
```

### 1. Constrained Spherical Deconvolution (CSD) & ACT
Unlike simple tensor models that assume only a single fiber orientation per voxel, **Constrained Spherical Deconvolution (CSD)** estimates the continuous fiber orientation distribution function (fODF). This allows tractography algorithms to track through complex regions of crossing, kissing, and branching fibers. **Anatomically-Constrained Tractography (ACT)** utilizes FreeSurfer tissue boundaries (5TT segmentation) to ensure streamlines begin and terminate only in gray matter and do not traverse cerebrospinal fluid.

### 2. Automated White Matter Segmentation
Once millions of whole-brain streamlines are generated, the **[White Matter Anatomy Segmentation](https://brainlife.io/app/5cc73ef44ed9df00317f6288){target=_blank}** App uses digital anatomical waypoint ROIs and cortical parcellations to segment the whole-brain tractogram into 61 reproducible major white matter tracts.

### 3. Tract Profiles (Tractometry)
Rather than averaging diffusion values across an entire tract volume, **tract profiles** sample microstructural metrics (FA, MD, RD, AD, or NODDI parameters) at 100 equidistant nodes along the central trajectory of each tract. This reveals localized focal differences between clinical cohorts.

---

## Step 1: Copy Tutorial Data

1. In your project on [Brainlife Connects](https://connects.brainlife.io/){target=_blank}, click on the **2. Data** tab.
2. Click **Add Project Data** and choose **Copy from another Project**.
3. Select the *Tutorial Data* project (`5ae916e7f446980028b15eb3`) and copy for subject `10217`:
    * `dwi` (Preprocessed diffusion dataset)
    * `anat/t1w` (Raw or ACPC-aligned T1w image)
4. Confirm to copy the data into your project.

---

## Step 2: Anatomical Alignment & FreeSurfer Parcellation

1. In the **2. Data** tab, select your `anat/t1w` dataset and click **Stage to process**.
2. Title the process `Tractography Pipeline` and confirm.
3. In **3. Processing** > **Processes**, click **Submit App**:
    * Run **[FSL Anat (T1)](https://brainlife.io/app/5e3c87ae9362b7166cf9c7f4){target=_blank}** to generate an ACPC-aligned anatomical image (`anat/t1w` with `acpc_aligned` tag).
4. Next, submit **[FreeSurfer 7.3.2](https://brainlife.io/app/5fe1056057aacd480f2f8e48){target=_blank}** using the ACPC-aligned T1w output to reconstruct the cortical surfaces and tissue segmentations.

---

## Step 3: Whole-Brain Anatomically-Constrained Tractography

1. In the **Processes** view, click **Submit App**.
2. Search for **MRtrix3 Anatomically-Constrained Tractography (ACT)** ([App Link](https://brainlife.io/app/5e9dced9f1745d6994f692c0){target=_blank}).
3. Configure the inputs:
    * **dwi**: Preprocessed, ACPC-aligned `dwi` dataset.
    * **anat**: ACPC-aligned `anat/t1w` dataset.
    * **freesurfer**: Completed FreeSurfer output directory (used to generate the 5-tissue-type mask).
    * **num_fibers**: Set to `1000000` (or `100000` for rapid testing).
4. Click **Submit**.

When complete, click the **Eye (View)** icon on the `track/tck` output and select the **3D Tract Viewer** to inspect the reconstructed whole-brain streamlines directly in your browser.

---

## Step 4: Segment Major White Matter Tracts

1. In the **Processes** view, click **Submit App**.
2. Search for **White Matter Anatomy Segmentation** ([App Link](https://brainlife.io/app/5cc73ef44ed9df00317f6288){target=_blank}).
3. Configure:
    * **freesurfer**: FreeSurfer output.
    * **track/tck**: Whole-brain tractogram from Step 3.
4. Click **Submit**.

This App classifies streamlines into major association, projection, and commissural bundles (e.g. IFOF, ILF, SLF, Arcuate, CST).

---

## Step 5: Clean Outlier Streamlines

1. In the **Processes** view, click **Submit App**.
2. Search for **Remove Tract Outliers** ([App Link](https://brainlife.io/app/5cc9eca04b5e4502275edba6){target=_blank}).
3. Select the segmented tract output from Step 4.
4. Click **Submit**.

The cleaned tract classification output (`wmc`) retains only coherent bundle cores.

---

## Step 6: Extract Along-Tract Microstructural Profiles

1. In the **Processes** view, click **Submit App**.
2. Search for **Tract Analysis Profiles** ([App Link](https://brainlife.io/app/5ed02b780a8ed88a57482c92){target=_blank}).
3. Configure:
    * **wmc**: Cleaned tract classification output.
    * **track/tck**: Whole-brain tractogram.
    * **tensor**: DTI tensor maps (e.g. from FSL DTIFit).
4. Click **Submit**.

This produces a `neuro/tractprofile` data object containing 100-node profiles of Fractional Anisotropy, Mean Diffusivity, and Radial Diffusivity for each bundle.

---

## Step 7: Macrostructural Tract Statistics

1. In the **Processes** view, click **Submit App**.
2. Search for **Tractography Quality Check / Macrostructural Statistics** ([App Link](https://brainlife.io/app/5cc9c6b44b5e4502275edb4b){target=_blank}).
3. Supply the cleaned `wmc` and `track/tck` outputs.
4. Click **Submit**.

This extracts summary volumetric and geometric metrics (mean tract length, volume, streamline count, endpoint spread) into tidy `.csv` tables.

---

## Next Steps

* **[Interactive Group Analysis](/docs/user/groupanalysis)**: Load your generated `tractprofile` and macrostructural summary tables into Brainlife's cloud JupyterLab notebooks to perform ANOVA, regression models, and publication-ready tractometry plotting.
* **[Structural Network Neuroscience](/docs/tutorial/networkneuroscience-structural)**: Combine tractography streamlines with multi-atlas parcellations to build whole-brain structural connectomes.
