# Cortex Tissue Mapping: Diffusion Measures on the Cortical Boundary

This tutorial demonstrates a recommended pipeline for mapping diffusion-weighted MRI measures (Diffusion Tensor Imaging and NODDI) to the gray-matter / white-matter cortical boundary following methodologies introduced by [Fukutomi et al. (2018, *NeuroImage*)](https://pubmed.ncbi.nlm.nih.gov/29448073/){target=_blank} on **Brainlife Connects** ([connects.brainlife.io](https://connects.brainlife.io/){target=_blank}).

The goal of this tutorial is to process anatomical and diffusion data to:
* Generate **ACPC alignment and non-linear warp fields** to the MNI152 template.
* Reconstruct cortical surfaces with **FreeSurfer 7.3.2**.
* Preprocess diffusion MRI and fit both **DTI** (Fractional Anisotropy, Mean Diffusivity) and **NODDI** (Neurite Density Index, Orientation Dispersion Index) models.
* Map these microstructural metrics directly onto the 2D gray/white cortical interface.
* Extract regional summary statistics across cortical parcellations (Destrieux Atlas `aparc.a2009s`).

This tutorial builds on skills developed in the [Introduction to Brainlife Connects](/docs/tutorial/introduction-to-brainlife), [Anatomical Preprocessing](/docs/tutorial/t1w-preprocessing), and [Diffusion MRI Preprocessing](/docs/tutorial/diffusion-preprocessing) tutorials.

![Cortex Tissue Mapping Preview](https://github.com/brainlife/app-cortex-tissue-mapping/blob/v1.1/cropped_glasser_ndi.png?raw=true)

---

## Processing Overview

```
[Raw T1w Anatomical]                                [Raw Diffusion MRI]
        │                                                    │
        ▼                                                    ▼
1. FSL Anat (T1)                                    3. MRtrix3 Preprocessing
   - ACPC alignment                                    - Denoising & Gibbs removal
   - MNI152 non-linear warp fields                     - Topup/Eddy distortion correction
        │                                              - Coregistration to ACPC T1w
        ▼                                                    │
2. FreeSurfer 7.3.2                                          ▼
   - Pial and white surface meshes                  4. Microstructural Modeling
   - Destrieux (aparc.a2009s) parcellation             - FSL DTIFit (FA, MD, RD, AD)
        │                                              - NODDI AMICO (NDI, ODI, ISOVF)
        │                                                    │
        └───────────────────────┬────────────────────────────┘
                                │
                                ▼
5. Cortex Tissue Mapping (Fukutomi et al.)
   - Generates intermediate gray/white boundary surface
   - Samples DTI & NODDI values along cortical mesh vertices
                                │
                                ▼
6. Regional Summary Statistics (CSV Tables)
```

---

## Step 1: Copy Tutorial Data

1. In your project on [Brainlife Connects](https://connects.brainlife.io/){target=_blank}, click on the **2. Data** tab.
2. Click **Add Project Data** and choose **Copy from another Project**.
3. Select the *Tutorial Data* project (`5e7638f6de643b02832a8246`) and copy for subject `test001`:
    * `dwi` (Both AP and PA phase-encoded scans)
    * `anat/t1w` (T1w image)
    * `anat/t2w` (T2w image, optional for surface refinement)
4. Confirm to copy the datasets into your project's **Data** inventory.

---

## Step 2: Anatomical Alignment and Template Warping (FSL Anat)

1. In the **2. Data** tab, select your `anat/t1w` dataset and click **Stage to process**.
2. Name the process `Cortex Tissue Mapping Pipeline` and click **Submit**.
3. Go to the **3. Processing** tab and select the **Processes** view.
4. Click **Submit App** and search for **FSL Anat (T1)**:
    * **t1**: Staged raw `anat/t1w` image.
    * Check **crop** and **reorient**.
    * **template**: Select `MNI152_1MM` (this generates the non-linear warp and inverse warp fields required for template normalization).
5. Click **Submit**.

---

## Step 3: Reconstruct Cortical Surfaces (FreeSurfer 7.3.2)

1. In the **Processes** view, click **Submit App**.
2. Search for **FreeSurfer 7.3.2**.
3. Configure:
    * **t1**: ACPC-aligned T1w output from Step 2.
    * Check **hippocampal** and **thalamicnuclei**.
4. Click **Submit**.

---

## Step 4: Preprocess Diffusion MRI (MRtrix3 Preproc)

1. In the **Processes** view, click **Submit App**.
2. Search for **MRtrix3 Preproc** ([App Link](https://brainlife.io/app/5a813e52dc4031003b8b36f9){target=_blank}).
3. Configure:
    * **anat/t1w**: ACPC-aligned T1w image.
    * **dwi**: Primary DWI scan (tagged `PA`).
    * **dwi (reverse)**: Reverse phase-encoded scan (tagged `AP`).
    * **acqd**: `posterior -> anterior (y) (PA)`.
4. Click **Submit**.

---

## Step 5: Fit DTI and NODDI Microstructural Models

### 1. DTI Modeling (FSL DTIFit)
1. Click **Submit App** in the **Processes** view and search for **FSL DTIFit**.
2. Select the preprocessed `dwi` output from Step 4.
3. Set **shell** to `1000`.
4. Check **kurtosis**, **sse**, and **multishell** if multi-shell data is present.
5. Click **Submit**.

### 2. NODDI Modeling (NODDI AMICO)
1. Click **Submit App** and search for **NODDI AMICO** ([App Link](https://brainlife.io/app/5ed02c520a8ed8e7bb483031){target=_blank}).
2. Select the preprocessed `dwi` output from Step 4.
3. Set **dPar** (parallel intrinsic diffusivity) to `0.0011` $\text{mm}^2/\text{s}$ (recommended rate for cortical gray/white boundary modeling).
4. Click **Submit**.

---

## Step 6: Map Measures to the Cortical Boundary

1. In the **Processes** view, click **Submit App**.
2. Search for **Cortex Tissue Mapping** ([App Link](https://brainlife.io/app/5eea8548d39ceb4a30a090eb){target=_blank}).
3. Configure the inputs:
    * **dwi**: Preprocessed diffusion dataset from Step 4.
    * **freesurfer**: Completed FreeSurfer output from Step 3.
    * **tensor**: DTI tensor output from Step 5.
    * **noddi**: NODDI output from Step 5.
    * **warp**: Non-linear warp fields from FSL Anat (`neuro/t1w`).
    * **parcellation**: Select `aparc.a2009s` (Destrieux Atlas).
4. Click **Submit**.

When complete, click the **Eye (View)** icon on the output to open the in-browser **Surface Visualizer** or download the metric gifti (`.shape.gii`) files.

---

## Step 7: Regional Summary Statistics

1. In the **Processes** view, click **Submit App**.
2. Search for **Compute summary statistics of diffusion measures mapped to cortical surface** ([App Link](https://brainlife.io/app/5eea8548d39ceb4a30a090eb){target=_blank}).
3. Select the `cortexmap` output from Step 6.
4. Click **Submit**.

This extracts mean, standard deviation, and median values of Fractional Anisotropy, Mean Diffusivity, Neurite Density Index (NDI), and Orientation Dispersion Index (ODI) across each cortical region into standardized `.csv` spreadsheets.

---

## Next Steps

* **[Interactive Group Analysis](/docs/user/groupanalysis)**: Load your cortical summary spreadsheets into Brainlife's cloud JupyterLab notebooks to perform regional ANOVA and plot cortical microstructural distributions.
