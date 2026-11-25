## Functional Connectivity

Functional Magnetic Resonance Imaging (fMRI) measures the Blood Oxygen Level-Dependent (BOLD) signal across the whole brain over time. **Functional connectivity** characterizes how synchronized the spontaneous or task-evoked BOLD activity is between distinct brain regions. Brain regions whose BOLD timeseries exhibit strong temporal correlation are inferred to form functionally integrated networks.

These correlations are typically represented in an $N \times N$ **functional connectivity matrix** (correlation matrix), where each entry $(i, j)$ contains the Pearson correlation coefficient between the mean timeseries of region $i$ and region $j$, defined by a cortical or subcortical atlas.

From these matrices, neuroscientists can characterize topological properties of the functional connectome (such as resting-state subnetworks, modularity, hub architecture, and dynamic flexibility) across tasks, age groups, and clinical populations.

This tutorial demonstrates how to generate functional connectivity matrices on **brainlife.io** ([connects.brainlife.io](https://connects.brainlife.io)). You will learn how to:
1. Align anatomical T1w images to ACPC space using [FSL Anat](https://brainlife.io/app/5e3c87ae9362b7166cf9c7f4).
2. Reconstruct cortical surfaces and parcellations using [FreeSurfer 7.3.2](https://brainlife.io/app/5fe1056057aacd480f2f8e48).
3. Map the HCP-MMP (Glasser 180-node) cortical atlas onto native surfaces with the [Multi-atlas Transfer Tool (MaTT)](https://brainlife.io/app/6016dcdc321a4aafce6decd5).
4. Preprocess resting-state BOLD images using [fMRIPrep (Volume Output)](https://brainlife.io/app/5c61c69f14027a01b14adcb3).
5. Extract regional BOLD timeseries using [fMRI Timeseries Extraction](https://brainlife.io/app/5ed05fe8e3f4538080268585).
6. Compute correlation matrices using [Time series to network](https://brainlife.io/app/60b961b10ad40d58e1ca7fe7).
7. Apply network thresholding and calculate graph-theoretical measures using [Network Preprocess](https://brainlife.io/app/5e76ea90de643b5e7c2a9404) and [Network Measurements](https://brainlife.io/app/5ea70853f1745db7d9f7b0dc).
8. Export connectivity matrices and network metrics to tidy CSV dataframes.

> [!NOTE] Prerequisites
> Before starting, review the [Introduction to brainlife.io](/docs/tutorial/introduction-to-brainlife/) and [fMRI Preprocessing Tutorial](/docs/tutorial/fmri-preprocessing-tutorial/).

---

### 1. Anatomical & Surface Preprocessing

Anatomical alignment to the Anterior Commissure - Posterior Commissure (ACPC) plane is performed first via [FSL Anat (T1w)](https://brainlife.io/app/5e3c87ae9362b7166cf9c7f4). This provides a centered, robust anatomical reference for surface reconstruction in [FreeSurfer 7.3.2](https://brainlife.io/app/5fe1056057aacd480f2f8e48) and boundary-based registration in fMRIPrep.

The Glasser multi-modal cortical parcellation (`hcp-mmp-b`) is mapped to the subject's native anatomy using the [Multi-atlas Transfer Tool (MaTT)](https://brainlife.io/app/6016dcdc321a4aafce6decd5), producing the region-of-interest (ROI) volume used for timeseries extraction.

### 2. Functional Preprocessing (fMRIPrep)

Raw fMRI data is prone to head motion artifacts, slice acquisition delays, and magnetic susceptibility distortions. [fMRIPrep](https://brainlife.io/app/5c61c69f14027a01b14adcb3) performs:
- Head-motion estimation and slice-timing correction.
- Susceptibility distortion correction (fieldmaps or phase-difference images).
- Boundary-Based Registration (BBR) aligning the BOLD volumes to the anatomical T1w space.
- Extraction of confound regressors (FD, DVARS, CSF/WM physiological signals, anatomical CompCor).

### 3. Timeseries Extraction & Connectivity Matrix Construction

Following fMRIPrep:
- The [fMRI Timeseries Extraction](https://brainlife.io/app/5ed05fe8e3f4538080268585) App applies the cortical atlas mask to the preprocessed BOLD data, averages the timeseries across voxels within each parcel, and regresses out motion confounds.
- The [Time series to network](https://brainlife.io/app/60b961b10ad40d58e1ca7fe7) App computes the pairwise Pearson correlation matrix across all parcel timeseries.
- Network preprocessing and graph measurements quantify community structure, clustering, path lengths, and node centralities.

---

## Step-by-Step Walkthrough

### Step 1: Copy Tutorial Data

1. Open the [Tutorial Functional Data Project](https://brainlife.io/project/5ae916e7f446980028b15eb3) on brainlife.io.
2. Open the **2. Data** tab.
3. Find subject **10217** and select the checkboxes for:
   - `func/task rest`
   - `anat/t1w`
4. Select **Copy** above the table and choose your project.
5. In your project, open **2. Data**, select the same datasets and select **Stage to process**.
6. In **Add to process**, choose "Create a new process", name it `Functional Network Neuroscience`, and select **Add and open editor**.

---

### Step 2: Preprocess Anatomical Data (FSL Anat)

1. In the process editor of your `Functional Network Neuroscience` process, select **Add App**. On **Select App**, search for **FSL Anat (T1w)** (`5e3c87ae9362b7166cf9c7f4`) and select it.
2. **Configure App Settings**: turn on **crop** and **reorient** (leave other settings at default).
3. **Select Inputs**: choose your `anat/t1w` dataset.
4. **Configure Outputs**: keep **Archive Output** on and add the annotation `fsl_anat`. Select **Add App**.
5. When the job finishes, select **Visualize** and inspect the preprocessed volume in the **3D volume viewer (NiiVue)** to confirm ACPC centering and brain extraction.

---

### Step 3: Cortical Reconstruction (FreeSurfer 7.3.2)

1. In the process editor, select **Add App**. On **Select App**, search for **Freesurfer 7.3.2** (`5fe1056057aacd480f2f8e48`) and select it.
2. **Configure App Settings**: turn on `hippocampal` and `thalamicnuclei` subsegmentations.
3. **Select Inputs**: choose your ACPC-aligned T1w output from FSL Anat (annotation `fsl_anat`).
4. **Configure Outputs**: keep **Archive Output** on and add the annotation `freesurfer`. Select **Add App**.
5. When the job finishes, select **Visualize** and view the surfaces and subcortical labels in the **Surface Viewer**.

---

### Step 4: Map Cortical Atlas with MaTT

1. In the process editor, select **Add App**. On **Select App**, search for **Multi-Atlas Transfer Tool (MaTT)** (`6016dcdc321a4aafce6decd5`) and select it.
2. **Configure App Settings**: set **atlas** to `hcp-mmp-b`.
3. **Select Inputs**: choose your `freesurfer` output dataset.
4. **Configure Outputs**: keep **Archive Output** on and add the annotation `hcp-mmp-b`. Select **Add App**.

---

### Step 5: Preprocess BOLD Data with fMRIPrep

1. In the process editor, select **Add App**. On **Select App**, search for **fmriPrep - Volume Output** (`5c61c69f14027a01b14adcb3`) and select it.
2. Set the parameters (**Configure App Settings**) and inputs (**Select Inputs**):
   - **anat/t1w**: Select your ACPC-aligned T1w dataset.
   - **freesurfer**: Select the FreeSurfer output dataset.
   - **func**: Select the raw functional dataset (`func/task rest`).
   - **space**: Select `T1w`.
3. **Configure Outputs**: keep **Archive Output** on and add the annotation `fmriprep`. Select **Add App**.
4. When the job finishes, select **Visualize** on the `html` output to open the **fMRIPrep visual QA report** in your browser to inspect alignment, motion profiles, and brain masks.

---

### Step 6: Extract Functional Timeseries

1. In the process editor, select **Add App**. On **Select App**, search for **fMRI Timeseries Extraction** (`5ed05fe8e3f4538080268585`) and select it.
2. **Select Inputs**:
   - Select the preprocessed functional BOLD data, brain mask, confound regressors (all generated by fMRIPrep), and the `hcp-mmp-b` parcellation volume from MaTT.
3. **Configure Outputs**: keep **Archive Output** on and add the annotation `hcp-mmp-b`. Select **Add App**.

---

### Step 7: Construct Functional Connectivity Matrices

1. In the process editor, select **Add App**. On **Select App**, search for **Time series to network** (`60b961b10ad40d58e1ca7fe7`) and select it.
2. Set the inputs (**Select Inputs**) and parameters (**Configure App Settings**):
   - Select the extracted timeseries dataset from Step 6.
   - Set **method** to `correlation`.
3. **Configure Outputs**: keep **Archive Output** on and add the annotation `hcp-mmp-b`. Select **Add App**.

---

### Step 8: Network Preprocessing & Measurements

1. **Network Preprocess**:
   - Select **Add App**, then search for and select **Network Preprocess** (`5e76ea90de643b5e7c2a9404`).
   - Set **transform** to `absolute` (or keep positive weights) and set a threshold (for example `0.1`).
   - **Select Inputs**: choose the network dataset from Step 7.
   - On **Configure Outputs**, add the annotation `abs_thr_0p1` and select **Add App**.
2. **Network Measurements**:
   - Select **Add App**, then search for and select **Network Measurements** (`5ea70853f1745db7d9f7b0dc`).
   - **Select Inputs**: choose the preprocessed network dataset.
   - On **Configure Outputs**, add the annotation `abs_thr_0p1` and select **Add App**.
3. **Export to CSV**:
   - Select **Add App**, then search for and select **Extract network statistics and connectivity matrices from network datatype** (`649f24c53a63cf17374a4595`).
   - **Select Inputs**: choose the measured network dataset. The App produces clean tabular CSV files containing the adjacency matrix and local/global graph metrics.

---

## Next Steps

Your functional connectome and graph metrics are now ready:
- Open the **4. Analysis** tab of your project and select **New analysis** to launch a Jupyter notebook for statistical comparisons and dynamic connectivity analysis.
- Use the **5. Publications** tab to preserve and publish your pipeline and data with a citable DOI.
