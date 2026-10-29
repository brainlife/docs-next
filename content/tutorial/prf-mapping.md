# Population Receptive Field (pRF) Mapping

This tutorial demonstrates common steps used to map population receptive field (pRF) measures to the occipital cortex on **Brainlife Connects** ([connects.brainlife.io](https://connects.brainlife.io/){target=_blank}).

The goal of this tutorial is to map visual retinotopic properties—including **eccentricity** (distance from the fovea) and **polar angle** (angular position in the visual field)—onto the cortical surface using automated atlas-based fitting:
* **[pRFs / Benson14-Retinotopy](https://brainlife.io/app/6115c829a5a04c2a80f9e7f7){target=_blank}**: Fits Bayesian retinotopic templates (Benson et al., 2014) to reconstructed anatomical surfaces.
* **[FreeSurfer 7.3.2](https://brainlife.io/app/5fe1056057aacd480f2f8e48){target=_blank}**: Reconstructs the underlying cortical surfaces required for retinotopic mapping.

This tutorial builds on concepts from the [Introduction to Brainlife Connects](/docs/tutorial/introduction-to-brainlife) and [Anatomical Preprocessing](/docs/tutorial/t1w-preprocessing) tutorials.

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

1. In your project on [Brainlife Connects](https://connects.brainlife.io/){target=_blank}, click on the **2. Data** tab.
2. Click **Add Project Data** and select **Copy from another Project**.
3. Select the *Tutorial Data* project (`5e7638f6de643b02832a8246`) and copy the anatomical `anat/t1w` dataset for subject `test001`.
4. Confirm to copy the data into your project's **Data** table.

---

## Step 2: Preprocess and ACPC-Align Anatomical T1w (FSL Anat)

1. In the **2. Data** tab, select your `anat/t1w` dataset and click **Stage to process**.
2. Name the process `pRF Mapping Pipeline` and confirm.
3. Switch to the **3. Processing** tab and select the **Processes** view.
4. Select your process and click **Submit App**.
5. Search for **FSL Anat (T1)**:
    * **t1**: Staged raw `anat/t1w` dataset.
    * Check **crop** and **reorient**.
6. Click **Submit**.

---

## Step 3: Reconstruct Cortical Surfaces (FreeSurfer 7.3.2)

1. In the **Processes** view, click **Submit App**.
2. Search for **FreeSurfer 7.3.2**.
3. Configure the inputs:
    * **t1**: ACPC-aligned T1w output from FSL Anat (`acpc_aligned` tag).
    * Check **hippocampal** and **hires**.
4. Click **Submit**.

---

## Step 4: Atlas-Based Retinotopic Mapping (Benson14)

1. In the **Processes** view, click **Submit App**.
2. Search for **pRFs / Benson14-Retinotopy** ([App Link](https://brainlife.io/app/6115c829a5a04c2a80f9e7f7){target=_blank}).
3. Configure:
    * **freesurfer**: Select the completed FreeSurfer output from Step 3.
4. Click **Submit**.

This App aligns the anatomical surfaces to the fsaverage template and fits the visual field map model across visual areas V1, V2, V3, and hV4.

---

## Step 5: Visualizing Retinotopic Maps

Once the task finishes:
1. Locate the output card tagged with `prf`.
2. Click the **Eye (View)** icon and select the **Brainlife Surface Visualizer**.
3. In the viewer, select:
    * **Eccentricity**: Visualizes distance from the center of gaze (degrees of visual angle).
    * **Polar Angle**: Visualizes angular representation (upper vs. lower visual field, horizontal vs. vertical meridians).
    * **Visual Area Labels**: Displays segmented contours for primary visual areas V1, V2, and V3.

---

## Next Steps

* **[Cortex Tissue Mapping](/docs/tutorial/cortex-tissue-mapping)**: Sample diffusion microstructural parameters along visual cortex boundaries.
* **[Interactive Group Analysis](/docs/user/groupanalysis)**: Collate visual area cortical thickness, surface area, and retinotopic statistics across subjects in cloud Jupyter Notebooks.
