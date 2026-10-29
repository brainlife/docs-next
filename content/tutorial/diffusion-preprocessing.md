# Diffusion-Weighted MRI Preprocessing

This tutorial demonstrates the standard steps used to preprocess diffusion magnetic resonance imaging (dMRI) data on **Brainlife Connects** ([connects.brainlife.io](https://connects.brainlife.io/){target=_blank}).

The goal of this tutorial is to process raw diffusion MRI scans and anatomical images into high-quality, analysis-ready outputs for:
* **Microstructural modeling** (Diffusion Tensor Imaging: FA, MD, RD, AD; and advanced NODDI models)
* **Whole-brain diffusion tractography** (streamline reconstruction)
* **Structural network neuroscience** (connectomics and white matter mapping)

This pipeline primarily uses **[MRtrix3 Preproc](https://brainlife.io/app/5a813e52dc4031003b8b36f9){target=_blank}** for comprehensive diffusion artifact correction and **[FSL DTIFit](https://brainlife.io/app/5c1d67383e9c170177733d3f){target=_blank}** for microstructural tensor modeling.

This tutorial builds on skills developed in the [Introduction to Brainlife Connects](/docs/tutorial/introduction-to-brainlife) and [Anatomical Preprocessing](/docs/tutorial/t1w-preprocessing) tutorials.

---

## Preprocessing Overview

```
[Raw Anatomical T1w]                   [Raw dMRI (AP & PA Phase Encodes)]
         │                                            │
         ▼                                            ▼
1. FSL Anat (T1w)                      2. MRtrix3 Preprocessing
   - ACPC alignment                       - PCA denoising (MP-PCA)
   - Bias correction & skull strip        - Gibbs ringing removal
         │                                - Eddy current & motion correction
         │                                - B0 susceptibility distortion unwarping
         │                                - Bias field correction (N4)
         └───────────────────────────────►- Rigid registration to ACPC T1w
                                                      │
                                                      ▼
                                       3. FSL DTIFit (Tensor Modeling)
                                          - Fractional Anisotropy (FA)
                                          - Mean Diffusivity (MD)
                                          - Axial / Radial Diffusivity (AD, RD)
                                          - Primary eigenvector maps (V1)
```

### 1. Anatomical ACPC Alignment
To ensure that all downstream diffusion measures and tractography streamlines are biologically and anatomically anchored, the high-resolution T1-weighted image must be linearly aligned to the **Anterior Commissure - Posterior Commissure (ACPC)** plane. This is accomplished using **[FSL Anat (T1)](https://brainlife.io/app/5e3c87ae9362b7166cf9c7f4){target=_blank}**.

### 2. Correcting Diffusion Artifacts (MRtrix3 Preprocessing)
Diffusion MRI data has a relatively low signal-to-noise ratio (SNR) and is sensitive to several physical artifacts during rapid echo-planar imaging (EPI):
* **Thermal Noise**: Thermal fluctuations create high-frequency noise. MRtrix3 uses Marchenko-Pastur Principal Component Analysis (MP-PCA) and Rician estimation to suppress noise while preserving spatial resolution.
* **Gibbs Ringing**: Truncation in k-space acquisition causes oscillatory "ringing" artifacts near sharp tissue borders. Sub-voxel shifts remove these artifacts.
* **Susceptibility Distortions & Eddy Currents**: Rapid gradient switching induces electrical currents in the scanner bore (**eddy currents**), while air-tissue boundaries warp magnetic fields. Using reverse phase-encoded pairs (e.g. Posterior-to-Anterior `PA` and Anterior-to-Posterior `AP`), FSL `topup` and `eddy` model and correct these geometric distortions.
* **Coregistration**: Finally, the preprocessed dMRI volume is rigidly aligned to the ACPC-aligned T1w image.

### 3. Diffusion Tensor Modeling (FSL DTIFit)
Once cleaned and aligned, the Diffusion Tensor (DTI) model is fit to the data:
* **Fractional Anisotropy (FA)**: Measures the degree of directional organization of water diffusion (from `0` for isotropic fluid like CSF to `1` for highly aligned white matter tracts).
* **Mean Diffusivity (MD)**: Total average diffusion across all directions.
* **Axial Diffusivity (AD) & Radial Diffusivity (RD)**: Diffusion along the primary fiber orientation vs. perpendicular to it.

---

## Step 1: Copy Tutorial Data

1. In your project on [Brainlife Connects](https://connects.brainlife.io/){target=_blank}, click on the **2. Data** tab.
2. Click the **Add Project Data** button in the upper-right corner.
3. Select **Copy from another Project**, locate the *Tutorial Data* project (`5e7638f6de643b02832a8246`), and import the following for subject `test001`:
    * `dwi` (Both AP and PA phase-encoded scans)
    * `anat/t1w` (Raw T1-weighted image)
4. Confirm to copy the data into your project's **Data** inventory.

---

## Step 2: ACPC-Align Anatomical T1w Image (FSL Anat)

1. In the **2. Data** tab, select the checkbox next to your `anat/t1w` dataset and click **Stage to process**.
2. Name the process `dMRI Preprocessing Pipeline` and click **Submit**.
3. Go to the **3. Processing** tab and select the **Processes** view.
4. Select your process and click **Submit App**.
5. Search for **FSL Anat (T1)**:
    * **t1**: Staged raw `anat/t1w` image.
    * Check **crop** and **reorient**.
    * **template**: `MNI152_1MM`.
6. Click **Submit**.

---

## Step 3: Preprocess Diffusion MRI (MRtrix3 Preproc)

1. In the **Processes** view, click **Submit App**.
2. Search for **MRtrix3 Preproc** ([App Link](https://brainlife.io/app/5a813e52dc4031003b8b36f9){target=_blank}).
3. Configure the inputs:
    * **anat/t1w**: The ACPC-aligned anatomical T1w output from Step 2 (`acpc_aligned` tag).
    * **dwi**: Select the primary DWI dataset (tagged `PA`).
    * **dwi (reverse)**: Select the reverse phase-encoded DWI dataset (tagged `AP`).
    * **acqd**: `posterior -> anterior (y) (PA)`.
    * Leave remaining parameters at defaults.
4. Click **Submit**.

When complete, click the **Eye (View)** icon next to the generated `dwi` output to inspect the volume using the **NiiVue Volume Viewer**.

---

## Step 4: Fit the DTI Model (FSL DTIFit)

1. In the **Processes** view, click **Submit App**.
2. Search for **FSL DTIFit** ([App Link](https://brainlife.io/app/5c1d67383e9c170177733d3f){target=_blank}).
3. Configure:
    * **dwi**: The preprocessed, ACPC-aligned `dwi` output generated in Step 3.
    * **shell**: `1000` (fits the tensor model to the $b=1000\text{ s/mm}^2$ shell).
4. Click **Submit**.

When finished, your project will contain tensor maps: Fractional Anisotropy (`fa.nii.gz`), Mean Diffusivity (`md.nii.gz`), and directional color vectors (`v1.nii.gz`).

---

## Step 5: Visual Quality Assurance (QA)

Brainlife provides automated QA Apps to generate standardized summary figures for rapid review:

1. **Anatomical Alignment QA**: Run **[Generate images of T1](https://brainlife.io/app/5a907b22f0b5260027e248b6){target=_blank}** to generate orthogonal slices of the ACPC-aligned brain.
2. **DWI-T1 Coregistration QA**: Run **[Generate images of DWI overlaid on T1](https://brainlife.io/app/5a907bd3f0b5260027e248b9){target=_blank}** to confirm that the preprocessed diffusion mask accurately matches the anatomical skull-stripped surface.
3. **Tensor Color Map QA**: Run **[Generate images of tensor](https://brainlife.io/app/5a907c1af0b5260027e248ba){target=_blank}** to inspect the directionally-encoded color FA map (red = left-right corpus callosum; green = anterior-posterior; blue = superior-inferior corticospinal tract).

---

## Next Steps

With preprocessed, coregistered diffusion data and DTI maps ready, you can proceed to tractography and connectomics:

* **[Diffusion Tractography & Tractometry](/docs/tutorial/diffusion-tractography)**: Perform anatomically-constrained whole-brain tractography (ACT), segment major white matter tracts, and extract along-tract microstructural profiles.
* **[Structural Network Neuroscience](/docs/tutorial/networkneuroscience-structural)**: Generate cortical parcellation connectivity matrices using streamline counts and diffusion weights.
* **[Cortex Tissue Mapping](/docs/tutorial/cortex-tissue-mapping)**: Sample diffusion measures along the gray-matter / white-matter cortical boundary.
