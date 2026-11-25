# Cortex Tissue Mapping: Diffusion Measures on the Cortical Boundary

This tutorial demonstrates a recommended pipeline for mapping diffusion-weighted MRI measures (Diffusion Tensor Imaging and NODDI) to the gray-matter / white-matter cortical boundary following methodologies introduced by [Fukutomi et al. (2018, *NeuroImage*)](https://pubmed.ncbi.nlm.nih.gov/29448073/){target=_blank} on **brainlife.io** ([connects.brainlife.io](https://connects.brainlife.io/){target=_blank}).

The goal of this tutorial is to process anatomical and diffusion data to:
* Generate **ACPC alignment and non-linear warp fields** to the MNI152 template.
* Reconstruct cortical surfaces with **FreeSurfer 7.3.2**.
* Preprocess diffusion MRI and fit both **DTI** (Fractional Anisotropy, Mean Diffusivity) and **NODDI** (Neurite Density Index, Orientation Dispersion Index) models.
* Map these microstructural metrics directly onto the 2D gray/white cortical interface.
* Extract regional summary statistics across cortical parcellations (Destrieux Atlas `aparc.a2009s`).

This tutorial builds on skills developed in the [Introduction to brainlife.io](/docs/tutorial/introduction-to-brainlife), [Anatomical Preprocessing](/docs/tutorial/t1w-preprocessing), and [Diffusion MRI Preprocessing](/docs/tutorial/diffusion-preprocessing) tutorials.

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

1. In your project on [brainlife.io](https://connects.brainlife.io/){target=_blank}, open the **2. Data** tab.
2. Open the **Project Data** menu and choose "Copy Data From another Project".
3. Open the *Tutorial Data* project (`5e7638f6de643b02832a8246`) and copy these datasets to your project for subject `test001`:
    * `dwi` (Both AP and PA phase-encoded scans)
    * `anat/t1w` (T1w image)
    * `anat/t2w` (T2w image, optional for surface refinement)
4. Confirm. The datasets appear in your project's **Project Data** table.

---

## Step 2: Anatomical Alignment and Template Warping (FSL Anat)

1. On **2. Data**, select your `anat/t1w` and `dwi` datasets and select **Stage to process**.
2. In **Add to process**, choose "Create a new process", name it `Cortex Tissue Mapping Pipeline`, and select **Add and open editor**.
3. In the process editor, select **Add App**.
4. **Select App**: search for **FSL Anat (T1)** and select it. Then set the parameters (**Configure App Settings**) and inputs (**Select Inputs**):
    * **t1**: the raw `anat/t1w` dataset.
    * Turn on **crop** and **reorient**.
    * **template**: Select `MNI152_1MM` (this generates the non-linear warp and inverse warp fields required for template normalization).
5. On **Configure Outputs**, keep **Archive Output** on, then select **Add App**.

---

## Step 3: Reconstruct Cortical Surfaces (FreeSurfer 7.3.2)

1. In the process editor, select **Add App**.
2. **Select App**: search for **FreeSurfer 7.3.2** and select it.
3. Set the parameters (**Configure App Settings**) and inputs (**Select Inputs**):
    * **t1**: ACPC-aligned T1w output from Step 2.
    * Turn on **hippocampal** and **thalamicnuclei**.
4. On **Configure Outputs**, keep **Archive Output** on, then select **Add App**.

---

## Step 4: Preprocess Diffusion MRI (MRtrix3 Preproc)

1. In the process editor, select **Add App**.
2. **Select App**: search for **MRtrix3 Preproc** ([App Link](https://brainlife.io/app/5a813e52dc4031003b8b36f9){target=_blank}) and select it.
3. Set the parameters (**Configure App Settings**) and inputs (**Select Inputs**):
    * **anat/t1w**: ACPC-aligned T1w image.
    * **dwi**: Primary DWI scan (tagged `PA`).
    * **dwi (reverse)**: Reverse phase-encoded scan (tagged `AP`).
    * **acqd**: `posterior -> anterior (y) (PA)`.
4. On **Configure Outputs**, keep **Archive Output** on, then select **Add App**.

---

## Step 5: Fit DTI and NODDI Microstructural Models

### 1. DTI Modeling (FSL DTIFit)
1. In the process editor, select **Add App** and choose **FSL DTIFit** (**Select App**).
2. **Select Inputs**: choose the preprocessed `dwi` output from Step 4.
3. Set **shell** to `1000`.
4. Check **kurtosis**, **sse**, and **multishell** if multi-shell data is present.
5. On **Configure Outputs**, keep **Archive Output** on, then select **Add App**.

### 2. NODDI Modeling (NODDI AMICO)
1. Select **Add App** and choose **NODDI AMICO** ([App Link](https://brainlife.io/app/5ed02c520a8ed8e7bb483031){target=_blank}) (**Select App**).
2. **Select Inputs**: choose the preprocessed `dwi` output from Step 4.
3. Set **dPar** (parallel intrinsic diffusivity) to `0.0011` $\text{mm}^2/\text{s}$ (recommended rate for cortical gray/white boundary modeling).
4. On **Configure Outputs**, keep **Archive Output** on, then select **Add App**.

---

## Step 6: Map Measures to the Cortical Boundary

1. In the process editor, select **Add App**.
2. **Select App**: search for **Cortex Tissue Mapping** ([App Link](https://brainlife.io/app/5eea8548d39ceb4a30a090eb){target=_blank}) and select it.
3. Set the parameters (**Configure App Settings**) and inputs (**Select Inputs**):
    * **dwi**: Preprocessed diffusion dataset from Step 4.
    * **freesurfer**: Completed FreeSurfer output from Step 3.
    * **tensor**: DTI tensor output from Step 5.
    * **noddi**: NODDI output from Step 5.
    * **warp**: Non-linear warp fields from FSL Anat (`neuro/t1w`).
    * **parcellation**: Select `aparc.a2009s` (Destrieux Atlas).
4. On **Configure Outputs**, keep **Archive Output** on, then select **Add App**.

When the job finishes, select **Visualize** on the output to open the **Surface Visualizer** in your browser, or download the metric gifti (`.shape.gii`) files.

---

## Step 7: Regional Summary Statistics

1. In the process editor, select **Add App**.
2. **Select App**: search for **Compute summary statistics of diffusion measures mapped to cortical surface** ([App Link](https://brainlife.io/app/5eea8548d39ceb4a30a090eb){target=_blank}) and select it.
3. **Select Inputs**: choose the `cortexmap` output from Step 6.
4. On **Configure Outputs**, keep **Archive Output** on, then select **Add App**.

This extracts mean, standard deviation, and median values of Fractional Anisotropy, Mean Diffusivity, Neurite Density Index (NDI), and Orientation Dispersion Index (ODI) across each cortical region into standardized `.csv` spreadsheets.

---

## Next Steps

* **[Group Analysis](/docs/user/groupanalysis)**: Load your cortical summary spreadsheets into a Jupyter notebook (**4. Analysis**) to perform regional ANOVA and plot cortical microstructural distributions.
