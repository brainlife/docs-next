# Clairvoy Tutorial: Clinical Concussion Risk Prediction

## Welcome to Clairvoy

**Clairvoy** is an automated clinical research application hosted on [brainlife.io](https://brainlife.io). The Clairvoy App utilizes a machine learning classifier to predict whether an individual who has sustained a concussion is at high risk for prolonged symptoms or slow recovery (defined as the lack of clinical clearance for full return to sports/daily activity at >28 days). 

The underlying machine learning model evaluates diffusion-weighted (dMRI) and T1-weighted structural MRI acquired within 24–48 hours post-injury. This experimental tool is based on peer-reviewed research by [Bertó et al. 2024 (*NeuroImage: Clinical*, 43, 103646)](https://doi.org/10.1016/j.nicl.2024.103646). 

> [!IMPORTANT] Investigational Use Only
> Clairvoy was developed with support from the U.S. Department of Defense (award W81XWH-20-1-0717, PI: Nicholas L. Port) and the NCAA/DOD CARE Consortium (award W81XWH-14-2-0151, PI: Thomas W. McAllister). Clairvoy is an open-science research tool and has **not yet received FDA clearance or validation as a standalone diagnostic medical device**. We welcome clinical researchers and neuroscientists to evaluate Clairvoy and provide feedback.

---

## Workflow Overview

Clairvoy couples the browser-based **ezBIDS** conversion service with automated pipelines on brainlife.io:
1. **ezBIDS**: Ingests raw DICOM or NIfTI series, automatically identifies imaging sequences, defaces anatomical images for participant privacy, and generates a valid BIDS-compliant dataset.
2. **DWI Pipeline**: Automated preprocessing, fiber orientation modeling, tractography, white matter anatomy segmentation, and tract profiling (microstructural metrics along major white matter tracts).
3. **Clairvoy ML Classifier**: Reads white matter tract profiles (`tractmeasures`) and classifies the subject's injury profile.

```mermaid
flowchart LR
    A["Raw Clinical DICOMs<br/>(T1w + DWI)"] -->|ezBIDS| B["BIDS Dataset"]
    B -->|brainlife.io DWI Pipeline| C["Tract Profiles<br/>(tractmeasures)"]
    C -->|Clairvoy App| D["Risk Prediction<br/>(Normal vs. High Risk)"]
```

---

## Step-by-Step Instructions

### Step 1: Ingest and BIDSify Data with ezBIDS

1. Navigate to [ezBIDS](https://brainlife.io/ezbids) and sign in with your free brainlife.io account. (If you don't have an account, see [Getting Started](/docs/user/started/)).
2. Under the **Upload Imaging Data** panel, drag and drop your DICOM folder or `.zip` archive.
3. Review the extracted metadata in `Dataset Description`:
   - Enter a descriptive `Dataset Name` (e.g., `Concussion_Evaluation_01`).
   - Check and adjust participant IDs to ensure de-identification.
4. **Defacing (Privacy Protection)**:
   - Run the automated `QuickShear` defacing step to remove facial features while preserving full intracranial volume.
   - Visually verify defacing and select **Use Defaced**.
5. Select **Finalize** to generate the BIDS directory structure.
6. Select **Send to brainlife.io** and choose "Send to brainlife and run DWI Pipeline". ezBIDS creates a private project on brainlife.io and starts the preprocessing pipeline.

---

### Step 2: Monitor the DWI Pipeline on brainlife.io

1. Open **brainlife.io** ([connects.brainlife.io](https://connects.brainlife.io)), select **My Projects**, and open your new project.
2. Go to **3. Processing** → **Pipeline** or **Summary**.
3. Check that the automations are **Active**. The pipeline runs:
   - T1w ACPC alignment and brain masking.
   - Diffusion denoising, eddy current, and motion correction.
   - Whole-brain probabilistic tractography and tract segmentation.
   - Tract profile measurement extraction (`tractmeasures`).

> [!NOTE] Processing Time
> The pipeline usually takes from one to several hours, depending on the compute resources available.

---

### Step 3: Run the Clairvoy App

Once the DWI pipeline has completed and produced the `tractmeasures` dataset:

1. In your project, open the **2. Data** tab.
2. Select the checkbox next to the **`tractmeasures`** dataset.
3. Select **Stage to process** above the table.
4. In **Add to process**, choose "Create a new process", name it `Clairvoy Prediction`, and select **Add and open editor**.
5. In the process editor, select **Add App**.
6. **Select App**: type **Clairvoy** and select the official **Clairvoy** App.
7. **Select Inputs**: check that your `tractmeasures` dataset is the input. On **Configure Outputs**, select **Add App**.
8. The job takes less than 2 minutes.

---

### Step 4: Interpreting Results

When the job finishes, select **Visualize** next to the output dataset to open it:

- <span style="color: #22c55e; font-weight: 700;">Normal Recovery Trajectory</span>: The injury is predicted to recover in under 28 days.
- <span style="color: #ef4444; font-weight: 700;">High Risk (PPCS)</span>: The injury is flagged as high risk for developing Persistent Post-Concussive Symptoms (PPCS), indicating potential benefit from proactive clinical follow-up.

---

## Video Walkthrough

Watch a complete demonstration of the Clairvoy workflow:

<div style="display: flex; justify-content: center; margin: 1.5rem 0;">
<iframe width="560" height="315" src="https://www.youtube.com/embed/TvVmsXITP_0?si=HBNc2dlK7mipZJY-" title="Clairvoy Walkthrough Video" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen style="border-radius: 8px;"></iframe>
</div>

---

## References & Funding

- **Bertó et al. (2024)**: *Machine learning predicts prolonged recovery following sport-related concussion from acute diffusion MRI.* NeuroImage: Clinical, 43, 103646. [DOI: 10.1016/j.nicl.2024.103646](https://doi.org/10.1016/j.nicl.2024.103646).
- **Nencka et al. (2018)**: *The NCAA-DoD CARE Consortium: dMRI protocol and harmonization.* Brain Imaging and Behavior, 12:1121–1140. [DOI: 10.1007/s11682-017-9775-y](https://doi.org/10.1007/s11682-017-9775-y).
- **Principal Investigators**: Nicholas L. Port (Indiana University, [nport@iu.edu](mailto:nport@iu.edu)) and Franco Pestilli (The University of Texas at Austin, [pestilli@utexas.edu](mailto:pestilli@utexas.edu)).
