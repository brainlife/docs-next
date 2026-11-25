# Functional MRI (fMRI) Preprocessing

This tutorial demonstrates standard steps used to preprocess functional magnetic resonance imaging (fMRI) data on **brainlife.io** ([connects.brainlife.io](https://connects.brainlife.io/){target=_blank}).

The goal of this tutorial is to process raw BOLD fMRI scans and structural data into analysis-ready outputs for:
* **Functional activation & region-of-interest (ROI) analysis**
* **Functional connectivity network matrices** (measuring synchronous BOLD signal correlations across brain networks)

You will use **[fMRIPrep](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC6319393/){target=_blank}** ([fMRIPrep - Volume Output](https://brainlife.io/app/5c61c69f14027a01b14adcb3){target=_blank}) on brainlife.io.

This tutorial builds on concepts from the [Introduction to brainlife.io](/docs/tutorial/introduction-to-brainlife) and [Anatomical Preprocessing](/docs/tutorial/t1w-preprocessing) tutorials.

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

You will use open tutorial data from the [brainlife.io Tutorial Data project](https://brainlife.io/project/5e7638f6de643b02832a8246/detail){target=_blank}:

1. Open your project on [brainlife.io](https://connects.brainlife.io/){target=_blank}.
2. Go to the **2. Data** tab and open the **Project Data** menu.
3. Choose "Copy Data From another Project", open the *Tutorial Data* project (`5e7638f6de643b02832a8246`), and copy these datasets for subject `test002` to your project:
    * `func/task rest` (BOLD fMRI)
    * `anat/t1w` (T1w anatomical)
    * `anat/t2w` (T2w anatomical)
    * `fmap` (Spin-echo fieldmaps)
4. Confirm. The datasets appear in your project's **Project Data** table.

---

## Step 2: Preprocess Anatomical Data (FSL Anat)

### T1w Preprocessing
1. On **2. Data**, select your `anat/t1w` and `anat/t2w` datasets and select **Stage to process**.
2. In **Add to process**, choose "Create a new process", name it `fMRI Prep Pipeline`, and select **Add and open editor**.
3. In the process editor, select **Add App**.
4. **Select App**: search for **FSL Anat (T1)** and select it.
5. **Configure App Settings**: turn on **crop** and **reorient**.
6. **Select Inputs**: for **t1**, choose your raw T1w dataset.
7. **Configure Outputs**: keep **Archive Output** on, then select **Add App**.

### T2w Preprocessing
1. In the process editor, select **Add App** again.
2. **Select App**: search for **FSL Anat (T2)** and select it.
3. **Configure App Settings**: turn on **crop** and **reorient**.
4. **Select Inputs**: for **t2**, choose your raw T2w dataset.
5. **Configure Outputs**: keep **Archive Output** on, then select **Add App**.

When both jobs finish, check the anatomical outputs: select **Visualize** and choose the NiiVue volume viewer.

---

## Step 3: Reconstruct Cortical Surfaces (FreeSurfer 7.3.2)

1. In the process editor, select **Add App**.
2. **Select App**: search for **FreeSurfer 7.3.2** and select it.
3. **Configure App Settings**: turn on **hippocampal** and **thalamicnuclei** (optional subfield segmentations).
4. **Select Inputs**:
    * **t1**: your ACPC-aligned T1w output from FSL Anat (datatype tag `acpc_aligned`).
    * **t2**: your ACPC-aligned T2w output from FSL Anat (datatype tag `acpc_aligned`).
5. **Configure Outputs**: keep **Archive Output** on, then select **Add App**.

When FreeSurfer finishes, select **Visualize** on its output to inspect the cortical surfaces and subcortical parcellations in a browser surface viewer.

---

## Step 4: Run fMRIPrep (Volume Output)

Now run the functional preprocessing:

1. In the process editor, select **Add Data** and add your `func/task rest` and `fmap` datasets. Then select **Add App**.
2. **Select App**: search for **fMRIPrep - Volume Output** ([App Link](https://brainlife.io/app/5c61c69f14027a01b14adcb3){target=_blank}) and select it.
3. **Configure App Settings**: for **space**, select `T1w` (or `MNI152NLin2009cAsym` for a standard group space).
4. **Select Inputs**:
    * **t1**: your ACPC-aligned T1w output (`anat/t1w`).
    * **t2**: your ACPC-aligned T2w output (`anat/t2w`).
    * **freesurfer**: the FreeSurfer 7.3.2 output.
    * **bold**: your functional scan (`func/task rest`).
    * **fmap**: your fieldmap dataset (`fmap`).
5. **Configure Outputs**: keep **Archive Output** on, then select **Add App**.

### Reviewing Quality Control (QC) Reports

When fMRIPrep completes:
1. Find the `html` output (in the process side panel under **Results**, or on **2. Data**).
2. Select **Visualize** and choose the **HTML Report Viewer**.
3. Review fMRIPrep's visual report:
    * **B0 fieldmap unwarping carpet plots**
    * **Framewise displacement (FD) and DVARS motion metrics**
    * **Coregistration alignment between BOLD volumes and anatomical boundaries**

---

## Next Steps

With your fMRI data preprocessed, you can continue with network neuroscience and functional connectivity:

* **[Functional Network Neuroscience](/docs/tutorial/networkneuroscience-functional)**: extract region-of-interest timeseries with cortical parcellations (for example Glasser HCP-MMP) and compute functional connectivity matrices.
* **[Group Analysis](/docs/user/groupanalysis)**: load preprocessed timeseries and motion metrics into Jupyter notebooks (**4. Analysis**) for statistical modeling.
