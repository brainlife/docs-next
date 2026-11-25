# Diffusion-Weighted MRI Preprocessing

This tutorial demonstrates the standard steps used to preprocess diffusion magnetic resonance imaging (dMRI) data on **brainlife.io** ([connects.brainlife.io](https://connects.brainlife.io/){target=_blank}).

The goal of this tutorial is to process raw diffusion MRI scans and anatomical images into high-quality, analysis-ready outputs for:
* **Microstructural modeling** (Diffusion Tensor Imaging: FA, MD, RD, AD; and advanced NODDI models)
* **Whole-brain diffusion tractography** (streamline reconstruction)
* **Structural network neuroscience** (connectomics and white matter mapping)

This pipeline primarily uses **[MRtrix3 Preproc](https://brainlife.io/app/5a813e52dc4031003b8b36f9){target=_blank}** for comprehensive diffusion artifact correction and **[FSL DTIFit](https://brainlife.io/app/5c1d67383e9c170177733d3f){target=_blank}** for microstructural tensor modeling.

This tutorial builds on skills developed in the [Introduction to brainlife.io](/docs/tutorial/introduction-to-brainlife) and [Anatomical Preprocessing](/docs/tutorial/t1w-preprocessing) tutorials.

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

1. In your project on [brainlife.io](https://connects.brainlife.io/){target=_blank}, open the **2. Data** tab.
2. Open the **Project Data** menu.
3. Choose "Copy Data From another Project", open the *Tutorial Data* project (`5e7638f6de643b02832a8246`), and copy these datasets for subject `test001` to your project:
    * `dwi` (Both AP and PA phase-encoded scans)
    * `anat/t1w` (Raw T1-weighted image)
4. Confirm. The datasets appear in your project's **Project Data** table.

---

## Step 2: ACPC-Align Anatomical T1w Image (FSL Anat)

1. On **2. Data**, select the checkboxes next to your `anat/t1w` and `dwi` datasets and select **Stage to process**.
2. In **Add to process**, choose "Create a new process", name it `dMRI Preprocessing Pipeline`, and select **Add and open editor**.
3. In the process editor, select **Add App**.
4. **Select App**: search for **FSL Anat (T1)** and select it.
5. **Configure App Settings**:
    * Turn on **crop** and **reorient**.
    * **template**: `MNI152_1MM`.
6. **Select Inputs**: for **t1**, choose the raw `anat/t1w` dataset.
7. **Configure Outputs**: keep **Archive Output** on, then select **Add App**.

---

## Step 3: Preprocess Diffusion MRI (MRtrix3 Preproc)

1. In the process editor, select **Add App**.
2. **Select App**: search for **MRtrix3 Preproc** ([App Link](https://brainlife.io/app/5a813e52dc4031003b8b36f9){target=_blank}) and select it.
3. **Configure App Settings**:
    * **acqd**: `posterior -> anterior (y) (PA)`.
    * Leave the other parameters at their defaults.
4. **Select Inputs**:
    * **anat/t1w**: the ACPC-aligned T1w output from Step 2 (datatype tag `acpc_aligned`).
    * **dwi**: the primary DWI dataset (tagged `PA`).
    * **dwi (reverse)**: the reverse phase-encoded DWI dataset (tagged `AP`).
5. **Configure Outputs**: keep **Archive Output** on, then select **Add App**.

When the job finishes, select **Visualize** next to the `dwi` output and choose the NiiVue volume viewer.

---

## Step 4: Fit the DTI Model (FSL DTIFit)

1. In the process editor, select **Add App**.
2. **Select App**: search for **FSL DTIFit** ([App Link](https://brainlife.io/app/5c1d67383e9c170177733d3f){target=_blank}) and select it.
3. **Configure App Settings**: **shell**: `1000` (fits the tensor model to the $b=1000\text{ s/mm}^2$ shell).
4. **Select Inputs**: for **dwi**, choose the preprocessed, ACPC-aligned `dwi` output from Step 3.
5. **Configure Outputs**: keep **Archive Output** on, then select **Add App**.

When the job finishes, your project contains tensor maps: Fractional Anisotropy (`fa.nii.gz`), Mean Diffusivity (`md.nii.gz`), and directional color vectors (`v1.nii.gz`).

---

## Step 5: Visual Quality Assurance (QA)

Run these QA Apps (with **Add App**, as above) to make standard summary figures for a quick review:

1. **Anatomical Alignment QA**: Run **[Generate images of T1](https://brainlife.io/app/5a907b22f0b5260027e248b6){target=_blank}** to generate orthogonal slices of the ACPC-aligned brain.
2. **DWI-T1 Coregistration QA**: Run **[Generate images of DWI overlaid on T1](https://brainlife.io/app/5a907bd3f0b5260027e248b9){target=_blank}** to confirm that the preprocessed diffusion mask accurately matches the anatomical skull-stripped surface.
3. **Tensor Color Map QA**: Run **[Generate images of tensor](https://brainlife.io/app/5a907c1af0b5260027e248ba){target=_blank}** to inspect the directionally-encoded color FA map (red = left-right corpus callosum; green = anterior-posterior; blue = superior-inferior corticospinal tract).

---

## Next Steps

With preprocessed, coregistered diffusion data and DTI maps ready, you can continue with tractography and connectomics:

* **[Diffusion Tractography & Tractometry](/docs/tutorial/diffusion-tractography)**: Perform anatomically-constrained whole-brain tractography (ACT), segment major white matter tracts, and extract along-tract microstructural profiles.
* **[Structural Network Neuroscience](/docs/tutorial/networkneuroscience-structural)**: Generate cortical parcellation connectivity matrices using streamline counts and diffusion weights.
* **[Cortex Tissue Mapping](/docs/tutorial/cortex-tissue-mapping)**: Sample diffusion measures along the gray-matter / white-matter cortical boundary.
