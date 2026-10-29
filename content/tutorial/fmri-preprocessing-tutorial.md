# Functional MRI (fMRI) Preprocessing

This tutorial demonstrates standard steps used to preprocess functional magnetic resonance imaging (fMRI) data on **Brainlife Connects** ([connects.brainlife.io](https://connects.brainlife.io/){target=_blank}).

The goal of this tutorial is to process raw BOLD fMRI scans and structural data into analysis-ready outputs for:
* **Functional activation & region-of-interest (ROI) analysis**
* **Functional connectivity network matrices** (measuring synchronous BOLD signal correlations across brain networks)

We will use the gold-standard pipeline **[fMRIPrep](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC6319393/){target=_blank}** ([fMRIPrep - Volume Output](https://brainlife.io/app/5c61c69f14027a01b14adcb3){target=_blank}) on Brainlife.

This tutorial builds on concepts from the [Introduction to Brainlife Connects](/docs/tutorial/introduction-to-brainlife) and [Anatomical Preprocessing](/docs/tutorial/t1w-preprocessing) tutorials.

---

## Preprocessing Overview

Processing functional MRI involves three core stages:

```
[Raw Anatomical T1w/T2w]              [Raw BOLD fMRI & Fieldmaps]
          │                                        │
          ▼                                        ▼
1. FSL Anat (T1w & T2w)               2. fMRIPrep Functional Engine
   - ACPC alignment                       - Motion estimation & correction
   - Bias correction & skull strip        - B0 susceptibility distortion correction (Fieldmaps)
          │                               - Slice-timing correction
          ▼                               - Coregistration to T1w
2. FreeSurfer 7.3.2                                │
   - Cortical surface reconstruction               ▼
   - Subcortical parcellation         3. Preprocessed Functional Volumes
          │                              - BOLD timeseries in T1w / MNI space
          └─────────────────────────────►- Quality control reports (HTML)
```

### 1. Anatomical Preprocessing
Before functional images can be properly interpreted, they must be registered to high-resolution structural images. Standardizing orientation and centering the brain to the **Anterior Commissure - Posterior Commissure (ACPC)** plane is accomplished with the **[FSL Anat (T1)](https://brainlife.io/app/5e3c87ae9362b7166cf9c7f4){target=_blank}** and **[FSL Anat (T2)](https://brainlife.io/app/5e3c88089362b724fcf9c7f9){target=_blank}** Apps. Cortical surfaces are subsequently reconstructed with **[FreeSurfer 7.3.2](https://brainlife.io/app/5fe1056057aacd480f2f8e48){target=_blank}**.

### 2. Functional Preprocessing Artifacts
Functional BOLD scans suffer from several common acquisition artifacts:
* **Head Motion**: Participant motion during scan acquisition shifts voxels across volumes. fMRIPrep estimates head movement (translations and rotations) across all frames and realigns the volumes.
* **B0 Susceptibility Distortions**: Differences in magnetic susceptibility between brain tissue and air cavities cause geometric distortions ("stretching" or "compression" in frontal/temporal lobes). fMRIPrep uses phase-encoding fieldmaps (`fmap`) to unwarp distortions.
* **Slice-Timing Differences**: 2D multislice sequences acquire brain slices sequentially rather than instantaneously. Slice-timing correction interpolates the temporal signal so all slices reflect the same effective timepoint.
* **Coregistration**: Functional volumes are rigidly registered to the subject's high-resolution T1w anatomical surface and transformed into standardized space (e.g. MNI152).

---

## Step 1: Copy Tutorial Data

We will use open tutorial data from the [Brainlife Tutorial Data Project](https://brainlife.io/project/5e7638f6de643b02832a8246/detail){target=_blank}:

1. Go to your project on [Brainlife Connects](https://connects.brainlife.io/){target=_blank}.
2. Navigate to the **2. Data** tab and click **Add Project Data**.
3. Select **Copy from another Project**, locate the *Tutorial Data* project (`5e7638f6de643b02832a8246`), and copy the following modalities for subject `test002`:
    * `func/task rest` (BOLD fMRI)
    * `anat/t1w` (T1w anatomical)
    * `anat/t2w` (T2w anatomical)
    * `fmap` (Spin-echo fieldmaps)
4. Confirm to stage the data into your project's **Data** inventory.

---

## Step 2: Preprocess Anatomical Data (FSL Anat)

### T1w Preprocessing
1. In the **2. Data** tab, select your `anat/t1w` dataset and click **Stage to process**.
2. Name the process `fMRI Prep Pipeline` and confirm.
3. Switch to the **3. Processing** tab and select the **Processes** view.
4. Select your process and click **Submit App**.
5. Search for **FSL Anat (T1)** and configure:
    * **t1**: Select your staged raw T1w dataset.
    * Check **crop** and **reorient**.
6. Click **Submit**.

### T2w Preprocessing
1. In the **Processes** view, click **Submit App** again.
2. Search for **FSL Anat (T2)**:
    * **t2**: Select your staged raw T2w dataset.
    * Check **crop** and **reorient**.
3. Click **Submit**.

Once complete, verify both anatomical outputs using the built-in **NiiVue Volume Viewer** (Eye icon).

---

## Step 3: Reconstruct Cortical Surfaces (FreeSurfer 7.3.2)

1. In the **Processes** view of your project, click **Submit App**.
2. Search for **FreeSurfer 7.3.2**.
3. Configure the inputs:
    * **t1**: Select your ACPC-aligned T1w output from FSL Anat (`acpc_aligned` tag).
    * **t2**: Select your ACPC-aligned T2w output from FSL Anat (`acpc_aligned` tag).
    * Check **hippocampal** and **thalamicnuclei** (optional subfield segmentations).
4. Click **Submit**.

When FreeSurfer finishes (marked by a green card), inspect the cortical surfaces and subcortical parcellations using Brainlife's in-browser surface viewer.

---

## Step 4: Run fMRIPrep (Volume Output)

Now you are ready to execute the full functional preprocessing pipeline:

1. In the **Processes** view, click **Submit App**.
2. Search for **fMRIPrep - Volume Output** ([App Link](https://brainlife.io/app/5c61c69f14027a01b14adcb3){target=_blank}).
3. Configure the inputs:
    * **t1**: Your ACPC-aligned T1w output (`anat/t1w`).
    * **t2**: Your ACPC-aligned T2w output (`anat/t2w`).
    * **freesurfer**: The completed FreeSurfer 7.3.2 output directory.
    * **bold**: Your functional scan (`func/task rest`).
    * **fmap**: Your fieldmap dataset (`fmap`).
    * **space**: Select `T1w` (or `MNI152NLin2009cAsym` for standardized group space).
4. Click **Submit**.

### Reviewing Quality Control (QC) Reports

When fMRIPrep completes:
1. Locate the output task card tagged with `html`.
2. Click the **Eye (View)** icon and select the **HTML Report Viewer**.
3. Review fMRIPrep's comprehensive visual report:
    * **B0 fieldmap unwarping carpet plots**
    * **Framewise displacement (FD) and DVARS motion metrics**
    * **Coregistration alignment between BOLD volumes and anatomical boundaries**

---

## Next Steps

Now that your fMRI data is preprocessed, you can proceed to network neuroscience and functional connectivity:

* **[Functional Network Neuroscience](/docs/tutorial/networkneuroscience-functional)**: Extract region-of-interest timeseries using cortical parcellations (e.g. Glasser HCP-MMP) and compute functional connectivity correlation matrices.
* **[Interactive Group Analysis](/docs/user/groupanalysis)**: Load preprocessed timeseries and motion metrics into cloud Jupyter Notebooks for statistical modeling.
