## Structural Connectivity

Let's start by learning a little bit about **structural connectivity**. Diffusion MRI measures how **anisotropic** the movement of water is, with the basic principle that myelinated axon bundles restrict water displacement preferentially along the direction of the fibers. **Structural connectivity** describes the structural organization of white matter pathways across the entire brain. This analysis characterizes how connected different brain regions are by computing the density and number of **diffusion tractography streamlines** that connect or terminate into pairs of regions.

These connectivity values are stored in a **connectivity matrix** (or adjacency matrix), where each cell $(i, j)$ represents the structural connection weight between region $i$ and region $j$ defined by an anatomical atlas.

From these matrices, neuroscientists can apply graph theory to examine network-level topological properties such as global efficiency, modularity, node degree, and clustering coefficient, revealing inter-individual differences in development, aging, and clinical disorders.

This tutorial demonstrates how to generate structural connectivity matrices on **brainlife.io** ([connects.brainlife.io](https://connects.brainlife.io)). You will learn how to:
1. Align anatomical images to ACPC space using [FSL Anat](https://brainlife.io/app/5e3c87ae9362b7166cf9c7f4).
2. Reconstruct cortical surfaces and parcellations using [FreeSurfer 7.3.2](https://brainlife.io/app/5fe1056057aacd480f2f8e48).
3. Map the Glasser 180-node multi-modal cortical parcellation (HCP-MMP 1.0) using [Multi-atlas Transfer Tool (MaTT)](https://brainlife.io/app/6016dcdc321a4aafce6decd5).
4. Preprocess raw diffusion MRI data with [MRtrix3 Preprocessing (DESIGNER)](https://brainlife.io/app/5a813e52dc4031003b8b36f9).
5. Fit CSD models and generate whole-brain tractograms using [MRtrix3 Anatomically-Constrained Tractography (ACT)](https://brainlife.io/app/5e9dced9f1745d6994f692c0).
6. Construct the structural connectivity matrix using [Structural Connectome MRtrix3 (SCMRT)](https://brainlife.io/app/626840bbf3858674a29fe791).
7. Standardize the matrix to the `network` datatype for graph-theoretic analyses.

> [!NOTE] Prerequisites
> This tutorial builds upon concepts covered in the [Introduction to brainlife.io](/docs/tutorial/introduction-to-brainlife/), [dMRI Preprocessing](/docs/tutorial/diffusion-preprocessing/), and [Diffusion Tractography](/docs/tutorial/diffusion-tractography/) tutorials.

---

### 1. Anatomical Preprocessing

Anatomical images (T1w and T2w) serve as the spatial reference frame for diffusion tractography. To ensure that streamline endpoints match biological cortical boundaries, our anatomical volumes must be rigidly aligned to the **Anterior Commissure - Posterior Commissure (ACPC)** plane. This centering and standard orientation step is executed using [FSL Anat](https://brainlife.io/app/5e3c87ae9362b7166cf9c7f4).

Next, cortical surfaces and subcortical segmentations are reconstructed using [FreeSurfer 7.3.2](https://brainlife.io/app/5fe1056057aacd480f2f8e48). The resulting surfaces allow us to project high-resolution parcellation schemes (such as Glasser HCP-MMP) onto each subject's native anatomy using the [Multi-atlas Transfer Tool (MaTT)](https://brainlife.io/app/6016dcdc321a4aafce6decd5).

### 2. Diffusion Preprocessing

Diffusion MRI datasets inherently suffer from several scanner artifacts:
- **Susceptibility distortions**: Geometric stretching and compression caused by $B_0$ field inhomogeneities at air-tissue interfaces.
- **Eddy currents and subject motion**: Phase distortions and misalignment induced by fast gradient switching and inevitable head movements.
- **Low Signal-to-Noise Ratio (SNR)** and Rician noise floor.
- **Gibbs ringing**: Spurious oscillations adjacent to sharp tissue boundaries.
- **$B_1$ field bias inhomogeneities**: Low-frequency intensity variations across the image volume.

The [MRtrix3 Preproc (DESIGNER)](https://brainlife.io/app/5a813e52dc4031003b8b36f9) App performs MP-PCA denoising, Gibbs deringing, FSL `topup` susceptibility distortion correction, FSL `eddy` motion/eddy current correction, and $B_1$ bias field correction, followed by rigid registration of the dMRI volume to the ACPC-aligned T1w image.

### 3. Diffusion Modeling & Anatomically-Constrained Tractography (ACT)

Once dMRI data is cleaned and aligned to the T1w space, we model white matter fiber orientation distributions using **Constrained Spherical Deconvolution (CSD)**. Unlike single-tensor models, CSD resolves complex fiber architectures including crossing, kissing, and diverging axon fascicles within a single voxel.

Using the CSD fiber orientation distributions and a 5-tissue-type (5TT) anatomical segmentation derived from FreeSurfer, the [MRtrix3 ACT](https://brainlife.io/app/5e9dced9f1745d6994f692c0) algorithm generates millions of anatomically valid streamlines. ACT dynamically terminates streamlines that cross into cerebrospinal fluid or exit through gray matter boundaries, eliminating biologically implausible connections.

### 4. Generating Structural Connectivity Matrices

With our whole-brain tractogram and the Glasser 180-node cortical parcellation volume aligned in native space, the [Structural Connectome MRtrix3 (SCMRT)](https://brainlife.io/app/626840bbf3858674a29fe791) App maps streamline endpoints to pairs of atlas regions. It computes:
- **Streamline count (density)**: The raw and length-normalized number of streamlines connecting region $i$ to region $j$.
- **Microstructural weighting**: Connecting matrices weighted by mean fractional anisotropy (FA), mean diffusivity (MD), or tract length.

---

## Step-by-Step Walkthrough

### Step 1: Copy Tutorial Data

1. Open the [Tutorial Data Project](https://brainlife.io/project/5e7638f6de643b02832a8246/detail) on brainlife.io.
2. Open the **2. Data** tab to see its datasets.
3. Filter or find subject **test001** and select the checkboxes for:
   - `dwi` (both AP and PA phase-encoded acquisitions)
   - `anat/t1w`
   - `anat/t2w`
4. Select **Copy** above the table and choose your project.
5. In your project, open **2. Data**, select the same datasets and select **Stage to process**.
6. In **Add to process**, choose "Create a new process", name it `Structural Network Neuroscience`, and select **Add and open editor**.

---

### Step 2: Preprocess Anatomical Data (FSL Anat)

#### 1. T1w ACPC Alignment
1. In the process editor of your `Structural Network Neuroscience` process, select **Add App**. On **Select App**, search for **FSL Anat (T1w)** (`5e3c87ae9362b7166cf9c7f4`) and select it.
2. **Configure App Settings**: turn on **crop** and **reorient** (leave other settings at default).
3. **Select Inputs**: choose your `anat/t1w` dataset.
4. **Configure Outputs**: keep **Archive Output** on and add the annotation `fsl_anat`. Select **Add App**.
5. When the job finishes, select **Visualize** next to the output and choose the **3D volume viewer (NiiVue)** to confirm that the T1w image is properly oriented and centered at the anterior commissure.

#### 2. T2w ACPC Alignment
1. In the process editor, select **Add App**. On **Select App**, search for **FSL Anat (T2w)** (`5e3c88089362b75a6ef9c7f6`) and select it.
2. **Configure App Settings**: turn on **crop** and **reorient**.
3. **Select Inputs**: choose your `anat/t2w` dataset.
4. **Configure Outputs**: keep **Archive Output** on and add the annotation `fsl_anat`. Select **Add App**.

---

### Step 3: Cortical Reconstruction (FreeSurfer 7.3.2)

1. In the process editor, select **Add App**. On **Select App**, search for **Freesurfer 7.3.2** (`5fe1056057aacd480f2f8e48`) and select it.
2. Set the parameters (**Configure App Settings**) and inputs (**Select Inputs**):
   - **anat/t1w**: Select your ACPC-aligned T1w output from FSL Anat (annotation `fsl_anat`).
   - **anat/t2w**: (Optional) Select your ACPC-aligned T2w output to improve pial surface placement.
   - Turn on `hippocampal` and `thalamicnuclei` subsegmentation if you want them.
3. **Configure Outputs**: keep **Archive Output** on and add the annotation `freesurfer`. Select **Add App**.
4. When the job finishes, select **Visualize** and inspect the results in the **Surface Viewer** and the **3D volume viewer (NiiVue)** to verify brain extraction (`brainmask.nii.gz`) and cortical boundary segmentations (`aseg.nii.gz`, pial and white surfaces).

---

### Step 4: Map Cortical Atlas with MaTT

1. In the process editor, select **Add App**. On **Select App**, search for **Multi-Atlas Transfer Tool (MaTT)** (`6016dcdc321a4aafce6decd5`) and select it.
2. **Configure App Settings**: set **space / atlas** to `hcp-mmp-b` (Glasser 180-node cortical parcellation).
3. **Select Inputs**: choose your `freesurfer` output dataset.
4. **Configure Outputs**: keep **Archive Output** on and add the annotation `Glasser`. Select **Add App**.

---

### Step 5: Preprocess Diffusion MRI Data (MRtrix3 DESIGNER)

1. In the process editor, select **Add App**. On **Select App**, search for **MRTrix3 Preprocess (DESIGNER)** (`5a813e52dc4031003b8b36f9`) and select it.
2. Set the parameters (**Configure App Settings**) and inputs (**Select Inputs**):
   - **anat/t1w**: Select your ACPC-aligned T1w image.
   - **dwi**: Select the primary DWI dataset (e.g., tag `PA`).
   - **dwi (reverse phase)**: Select the opposite phase-encoded DWI dataset (e.g., tag `AP`).
   - **acqd**: Select `posterior -> anterior (y) (PA)`.
3. **Configure Outputs**: keep **Archive Output** on and add the annotation `acpc_aligned`. Select **Add App**.
4. When the job finishes, select **Visualize** on the preprocessed `dwi` output and use the **3D volume viewer (NiiVue)** to confirm clean geometry and alignment with the anatomical scan.

---

### Step 6: Whole-Brain Anatomically-Constrained Tractography (ACT)

1. In the process editor, select **Add App**. On **Select App**, search for **MRTrix3 - WMC Anatomically Constrained Tractography (ACT)** (`5e9dced9f1745d6994f692c0`) and select it.
2. Set the parameters (**Configure App Settings**) and inputs (**Select Inputs**):
   - **dwi**: Select your preprocessed DWI dataset (datatype tag `acpc_aligned`).
   - **anat**: Select your ACPC-aligned T1w dataset.
   - Set desired streamline count (e.g., `500000` to `1000000` streamlines).
3. **Configure Outputs**: keep **Archive Output** on and add the annotation `whole_brain_tractography`. Select **Add App**.
4. When the job finishes, select **Visualize** and open the output in the **Tractography 3D Viewer** to verify streamline distribution across cortical and subcortical structures.

---

### Step 7: Construct Structural Connectivity Matrices (SCMRT)

1. In the process editor, select **Add App**. On **Select App**, search for **Structural Connectome MRTrix3 (SCMRT)** (`626840bbf3858674a29fe791`) and select it.
2. **Select Inputs**:
   - **parcellation/volume**: Select the Glasser volume parcellation from MaTT (annotation `Glasser`).
   - **track/tck**: Select your whole-brain tractogram from ACT (annotation `whole_brain_tractography`).
   - **tensor**: Select the DTI tensor output generated during preprocessing.
3. **Configure Outputs**: keep **Archive Output** on and add the annotation `structural_matrix`. Select **Add App**.

---

### Step 8: Convert Matrix to Network Datatype

1. In the process editor, select **Add App**. On **Select App**, search for **Conmat to network** (`60b961b10ad40d58e1ca7fe7`) and select it.
2. **Select Inputs**:
   - **conmat**: Select the generated `neuro/conmat` (datatype tag: `density`) dataset.
3. **Configure Outputs**: keep **Archive Output** on and add the annotation `structural_network`. Select **Add App**.

---

## Next Steps

Your structural connectome is now generated and standardized in the `network` datatype. You can proceed with:
- **Network Metrics**: Run the [Network Measurements](https://brainlife.io/app/5ea70853f1745db7d9f7b0dc) App to compute graph-theoretical metrics (node degree, path length, clustering, modularity).
- **Notebook analysis**: open the **4. Analysis** tab of your project and select **New analysis** to launch a Jupyter notebook and analyze your connectivity matrices using Python (`networkx`, `scipy`, `bctpy`) or MATLAB (Brain Connectivity Toolbox).
- **Group Studies**: Aggregate multiple subjects across your cohort using the [Group Analysis](/docs/user/groupanalysis/) notebooks.
