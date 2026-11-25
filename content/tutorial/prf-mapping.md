# Population Receptive Field (pRF) Mapping

This tutorial demonstrates common steps used to map population receptive field (pRF) measures to the occipital cortex on **brainlife.io** ([connects.brainlife.io](https://connects.brainlife.io/){target=_blank}).

The goal of this tutorial is to map visual retinotopic properties—including **eccentricity** (distance from the fovea) and **polar angle** (angular position in the visual field)—onto the cortical surface using automated atlas-based fitting:
* **[pRFs / Benson14-Retinotopy](https://brainlife.io/app/6115c829a5a04c2a80f9e7f7){target=_blank}**: Fits Bayesian retinotopic templates (Benson et al., 2014) to reconstructed anatomical surfaces.
* **[FreeSurfer 7.3.2](https://brainlife.io/app/5fe1056057aacd480f2f8e48){target=_blank}**: Reconstructs the underlying cortical surfaces required for retinotopic mapping.

This tutorial builds on concepts from the [Introduction to brainlife.io](/docs/tutorial/introduction-to-brainlife) and [Anatomical Preprocessing](/docs/tutorial/t1w-preprocessing) tutorials.

---

## Retinotopic Mapping Overview

Retinotopy is the spatial preservation of the visual field from the retina through the lateral geniculate nucleus to the primary visual cortex (V1) and higher visual areas (V2, V3, hV4). 

```
[Raw Anatomical T1w]
        │
        ▼
1. FSL Anat (T1)                 ──► ACPC alignment, bias correction, skull stripping
        │
        ▼
2. FreeSurfer 7.3.2              ──► Cortical surface reconstruction (pial and white surfaces)
        │
        ▼
3. Benson14-Retinotopy           ──► Bayesian template fitting of visual field maps (V1, V2, V3)
        │
        ▼
[Interactive Surface Visualizer] ──► Inspect eccentricity and polar angle overlays on 3D meshes
```

### Why Atlas-Based Retinotopic Mapping?
Functional retinotopy experiments require specialized visual display setups and prolonged MRI scan sessions. Atlas-based Bayesian retinotopic mapping algorithms (Benson et al., 2014, *PLOS Computational Biology*) predict individual retinotopic maps with high biological fidelity solely from the subject's cortical anatomy and sulcal geometry.

---

## Step 1: Copy Tutorial Data

1. In your project on [brainlife.io](https://connects.brainlife.io/){target=_blank}, open the **2. Data** tab.
2. Open the **Project Data** menu and choose "Copy Data From another Project".
3. Open the *Tutorial Data* project (`5e7638f6de643b02832a8246`) and copy the anatomical `anat/t1w` dataset for subject `test001`.
4. Confirm. The datasets appear in your project's **Project Data** table.

---

## Step 2: Preprocess and ACPC-Align Anatomical T1w (FSL Anat)

1. On **2. Data**, select your `anat/t1w` dataset and select **Stage to process**.
2. In **Add to process**, choose "Create a new process", name it `pRF Mapping Pipeline`, and select **Add and open editor**.
3. In the process editor, select **Add App**.
4. **Select App**: search for **FSL Anat (T1)** and select it. Then set the parameters (**Configure App Settings**) and inputs (**Select Inputs**):
    * **t1**: the raw `anat/t1w` dataset.
    * Turn on **crop** and **reorient**.
5. On **Configure Outputs**, keep **Archive Output** on, then select **Add App**.

---

## Step 3: Reconstruct Cortical Surfaces (FreeSurfer 7.3.2)

1. In the process editor, select **Add App**.
2. **Select App**: search for **FreeSurfer 7.3.2** and select it.
3. Set the parameters (**Configure App Settings**) and inputs (**Select Inputs**):
    * **t1**: ACPC-aligned T1w output from FSL Anat (datatype tag `acpc_aligned`).
    * Turn on **hippocampal** and **hires**.
4. On **Configure Outputs**, keep **Archive Output** on, then select **Add App**.

---

## Step 4: Atlas-Based Retinotopic Mapping (Benson14)

1. In the process editor, select **Add App**.
2. **Select App**: search for **pRFs / Benson14-Retinotopy** ([App Link](https://brainlife.io/app/6115c829a5a04c2a80f9e7f7){target=_blank}) and select it.
3. Set the parameters (**Configure App Settings**) and inputs (**Select Inputs**):
    * **freesurfer**: Select the completed FreeSurfer output from Step 3.
4. On **Configure Outputs**, keep **Archive Output** on, then select **Add App**.

This App aligns the anatomical surfaces to the fsaverage template and fits the visual field map model across visual areas V1, V2, V3, and hV4.

---

## Step 5: Visualizing Retinotopic Maps

When the job finishes:
1. Find the `prf` output (in the process side panel under **Results**, or on **2. Data**).
2. Select **Visualize** and select the **Surface Visualizer**.
3. In the viewer, select:
    * **Eccentricity**: Visualizes distance from the center of gaze (degrees of visual angle).
    * **Polar Angle**: Visualizes angular representation (upper vs. lower visual field, horizontal vs. vertical meridians).
    * **Visual Area Labels**: Displays segmented contours for primary visual areas V1, V2, and V3.

---

## Next Steps

* **[Cortex Tissue Mapping](/docs/tutorial/cortex-tissue-mapping)**: Sample diffusion microstructural parameters along visual cortex boundaries.
* **[Group Analysis](/docs/user/groupanalysis)**: Collate visual area cortical thickness, surface area, and retinotopic statistics across subjects in Jupyter notebooks (**4. Analysis**).
