## Functional Connectivity

Functional Magnetic Resonance Imaging (fMRI) measures the Blood Oxygen Level-Dependent (BOLD) signal across the whole brain over time. **Functional connectivity** characterizes how synchronized the spontaneous or task-evoked BOLD activity is between distinct brain regions. Brain regions whose BOLD timeseries exhibit strong temporal correlation are inferred to form functionally integrated networks.

These correlations are typically represented in an $N \times N$ **functional connectivity matrix** (correlation matrix), where each entry $(i, j)$ contains the Pearson correlation coefficient between the mean timeseries of region $i$ and region $j$, defined by a cortical or subcortical atlas.

From these matrices, neuroscientists can characterize topological properties of the functional connectome (such as resting-state subnetworks, modularity, hub architecture, and dynamic flexibility) across tasks, age groups, and clinical populations.

This tutorial demonstrates how to generate functional connectivity matrices on **Brainlife Connects** ([connects.brainlife.io](https://connects.brainlife.io)). You will learn how to:
1. Align anatomical T1w images to ACPC space using [FSL Anat](https://brainlife.io/app/5e3c87ae9362b7166cf9c7f4).
2. Reconstruct cortical surfaces and parcellations using [FreeSurfer 7.3.2](https://brainlife.io/app/5fe1056057aacd480f2f8e48).
3. Map the HCP-MMP (Glasser 180-node) cortical atlas onto native surfaces with the [Multi-atlas Transfer Tool (MaTT)](https://brainlife.io/app/6016dcdc321a4aafce6decd5).
4. Preprocess resting-state BOLD images using [fMRIPrep (Volume Output)](https://brainlife.io/app/5c61c69f14027a01b14adcb3).
5. Extract regional BOLD timeseries using [fMRI Timeseries Extraction](https://brainlife.io/app/5ed05fe8e3f4538080268585).
6. Compute correlation matrices using [Time series to network](https://brainlife.io/app/60b961b10ad40d58e1ca7fe7).
7. Apply network thresholding and calculate graph-theoretical measures using [Network Preprocess](https://brainlife.io/app/5e76ea90de643b5e7c2a9404) and [Network Measurements](https://brainlife.io/app/5ea70853f1745db7d9f7b0dc).
8. Export connectivity matrices and network metrics to tidy CSV dataframes.

> [!NOTE] Prerequisites
> Before starting, review the [Introduction to Brainlife](/docs/tutorial/introduction-to-brainlife/) and [fMRI Preprocessing Tutorial](/docs/tutorial/fmri-preprocessing-tutorial/).

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

1. Open the [Tutorial Functional Data Project](https://brainlife.io/project/5ae916e7f446980028b15eb3) on Brainlife.
2. Click the **2. Data** tab.
3. Locate subject **10217** and check the boxes for:
   - `func/task rest`
   - `anat/t1w`
4. Click **Stage to process** in the action bar:
   - **Project**: Select your target project.
   - **Process**: Select **Create New Process** and name it `Functional Network Neuroscience`.
   - Click **Submit** to copy and stage the datasets into your project.

---

### Step 2: Preprocess Anatomical Data (FSL Anat)

1. In your project, navigate to the **3. Processing** tab and select your `Functional Network Neuroscience` process in the **Processes** view.
2. Click **Execute / Submit App** and search for **FSL Anat (T1w)** (`5e3c87ae9362b7166cf9c7f4`).
3. Select your staged `anat/t1w` dataset as the input.
4. Enable **crop** and **reorient** (leave other settings at default).
5. Enable **Archive all output datasets when finished** and add the tag `fsl_anat`.
6. Click **Submit**.
7. Once finished, inspect the preprocessed volume using the in-browser **3D volume viewer (NiiVue)** to confirm ACPC centering and brain extraction.

---

### Step 3: Cortical Reconstruction (FreeSurfer 7.3.2)

1. Click **Execute / Submit App** and search for **Freesurfer 7.3.2** (`5fe1056057aacd480f2f8e48`).
2. Select your ACPC-aligned T1w output from FSL Anat (`fsl_anat` tag) as the input.
3. Enable `hippocampal` and `thalamicnuclei` subsegmentations.
4. Enable **Archive all output datasets when finished** and tag with `freesurfer`.
5. Click **Submit**.
6. When completed, view the surfaces and subcortical labels using the in-browser **Surface Viewer**.

---

### Step 4: Map Cortical Atlas with MaTT

1. Click **Execute / Submit App** and search for **Multi-Atlas Transfer Tool (MaTT)** (`6016dcdc321a4aafce6decd5`).
2. Select your `freesurfer` output dataset as the input.
3. Set **atlas** to `hcp-mmp-b`.
4. Enable **Archive all output datasets when finished** and tag with `hcp-mmp-b`.
5. Click **Submit**.

---

### Step 5: Preprocess BOLD Data with fMRIPrep

1. Click **Execute / Submit App** and search for **fmriPrep - Volume Output** (`5c61c69f14027a01b14adcb3`).
2. Configure inputs:
   - **anat/t1w**: Select your ACPC-aligned T1w dataset.
   - **freesurfer**: Select the FreeSurfer output dataset.
   - **func**: Select the raw functional dataset (`func/task rest`).
   - **space**: Select `T1w`.
3. Enable **Archive all output datasets when finished** and tag with `fmriprep`.
4. Click **Submit**.
5. When complete, click the eye icon on the `html` output to open the interactive **fMRIPrep visual QA report** in your browser to inspect alignment, motion profiles, and brain masks.

---

### Step 6: Extract Functional Timeseries

1. Click **Execute / Submit App** and search for **fMRI Timeseries Extraction** (`5ed05fe8e3f4538080268585`).
2. Configure inputs:
   - Select the preprocessed functional BOLD data, brain mask, confound regressors (all generated by fMRIPrep), and the `hcp-mmp-b` parcellation volume from MaTT.
3. Enable **Archive all output datasets when finished** and tag with `hcp-mmp-b`.
4. Click **Submit**.

---

### Step 7: Construct Functional Connectivity Matrices

1. Click **Execute / Submit App** and search for **Time series to network** (`60b961b10ad40d58e1ca7fe7`).
2. Configure inputs:
   - Select the extracted timeseries dataset from Step 6.
   - Set **method** to `correlation`.
3. Enable **Archive all output datasets when finished** and tag with `hcp-mmp-b`.
4. Click **Submit**.

---

### Step 8: Network Preprocessing & Measurements

1. **Network Preprocess**:
   - Search and select **Network Preprocess** (`5e76ea90de643b5e7c2a9404`).
   - Select the network dataset from Step 7.
   - Set **transform** to `absolute` (or retain positive weights) and set a threshold (e.g., `0.1`).
   - Tag output with `abs_thr_0p1` and click **Submit**.
2. **Network Measurements**:
   - Search and select **Network Measurements** (`5ea70853f1745db7d9f7b0dc`).
   - Select the preprocessed network dataset.
   - Tag output with `abs_thr_0p1` and click **Submit**.
3. **Export to CSV**:
   - Search and select **Extract network statistics and connectivity matrices from network datatype** (`649f24c53a63cf17374a4595`).
   - Select the measured network dataset to produce clean tabular CSV files containing the adjacency matrix and local/global graph metrics.

---

## Next Steps

Your functional connectome and graph metrics are now ready:
- Open the **4. Analysis** tab in your project to launch a JupyterLab notebook for statistical comparisons and dynamic connectivity analysis.
- Use the **5. Publications** tab to preserve and publish your pipeline and data with a citable DOI.
