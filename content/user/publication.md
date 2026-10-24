# Publications & Data Releases

Once you finish processing your datasets and producing your data derivatives, you can publish them directly from Brainlife. Publishing creates a permanent, citable public record of your datasets and group analyses, assigned with a unique Digital Object Identifier (DOI).

Publication records are preserved for at least ten years and backed by long-term storage, including the Indiana University [Scholarly Data Archive](https://kb.iu.edu/d/aiyi){target=_blank} tape archive. Brainlife automatically generates [schema.org](https://schema.org){target=_blank} metadata to maximize discovery, search indexing, and adherence to [FAIR data principles](https://www.go-fair.org/fair-principles/){target=_blank} (Findable, Accessible, Interoperable, and Reusable).

---

## Key Features of Brainlife Publications

Every publication created on Brainlife includes:

- **Permanent URL & Unique DOI**: Issued via DataCite, redirecting permanently to your publication page (`https://brainlife.io/pubs/<slug-or-id>`).
- **Versioned Releases**: A publication can contain multiple sequential releases (e.g., `Release 1`, `Release 2`), allowing you to publish new datasets, additional subjects, or updated derivative pipelines over time without losing historical provenance.
- **One-Click Citation**: A pre-formatted citation box with instant BibTeX and text export to make citing your dataset seamless for other researchers.
- **Interactive Data Explorer & Visualizers**: Visitors can browse the dataset hierarchy, inspect file trees, and view 2D/3D visualizations directly in the browser before downloading.
- **Open Access with Agreement Protection**: Public datasets can be browsed and downloaded by anyone without requiring a login, unless your project specifies a Data Access Agreement (in which case users must register and agree to your terms prior to downloading).

!!! danger "Publication Permanence"
    To maintain scientific reproducibility and uphold DOI registration guarantees with DataCite, **publications and releases cannot be deleted directly from the user interface**. If you need to retract or remove a publication due to an error, you must contact Brainlife support at `brlife@iu.edu`. Always review your included datasets and metadata carefully before publishing.

---

## Creating a Publication

To create a new publication from your project:

1. Open your project on Brainlife.
2. Select the **`Publications`** tab from the project navigation bar.
3. Click the **`New Publication`** button at the top of the page.

### The New Publication Form

Fill in the core metadata for your publication:

| Field | Description | Required |
| :--- | :--- | :--- |
| **Name** | A clear, informative title for the publication or dataset. | **Yes** |
| **Description** | An abstract summarizing the study, participant demographics, imaging modalities, and intended use cases. | **Yes** |
| **License** | The data access and re-use license (defaults to `CC-BY 4.0`). | **Yes** |
| **Authors** | Ordered list of primary authors with institutional affiliations. Select registered Brainlife users or add names. | **Yes** (at least one) |
| **Contributors** | Additional team members, curators, or contributors who assisted with the data collection or processing. | No |
| **Funding Sources** | Grant awards and funding agencies (provide Funder name and Award/Grant ID). | No |
| **Tags** | Keywords indicating imaging modalities, disorders, or study techniques (e.g., `fMRI`, `Diffusion`, `Connectome`). | No |
| **Ontology Topics** | Standardized scientific topics from biomedical ontologies to optimize discoverability. | No |
| **ReadMe** | Detailed study documentation written in Markdown (e.g., scan parameters, cohort exclusion criteria, code references). | No |

### Confirmation & DOI Generation

When you submit the form, a confirmation modal will outline the creation details:
- A new DOI is requested and registered with DataCite.
- Your publication record is created, and you are automatically redirected to the publication editor where you can associate specific datasets into **Releases**.

---

## Managing Publications: The Editor

Once created, project administrators and members can edit the publication by clicking **Edit Publication**. The editor is organized into four main sections:

### 1. Publication (Details & Credits)
Update any of your initial metadata fields at any time, including title, abstract, authors, contributors, grant numbers, license, tags, and the ReadMe documentation.

### 2. Appearance
Customize the public presentation of your publication:
- **Custom URL Slug**: Define a clean, memorable URL slug (e.g., `https://brainlife.io/pubs/my-study-2026`).
- **Banner Image**: Upload or select a custom hero banner image for the publication header.

### 3. Groups (People, Data & Media)
For large-scale, multi-institutional, or multi-modal publications, you can organize your study into **Groups**. Each group can have dedicated sub-panels for:
- **Overview**: Group-specific descriptions and focus areas.
- **People**: Sub-teams or working groups responsible for specific components.
- **Data**: Modality-specific datasets associated with the group.
- **Media**: Showcase figures, screenshots, and visual assets.

### 4. Releases (Published Data Snapshots)
The **Releases** tab is where you link actual project data to your publication:

1. Click **Add new release** to create a version (e.g., `Release 1`).
2. Provide a **Release Name** and **Description** detailing what data is included in this snapshot.
3. Under **Data Objects**, click **Add Data Object** to select which archived datasets and datatypes from your project should be included in this release.
4. Under **Group Analyses**, attach any multi-subject group analysis archives (`gaarchives`) produced in your project.
5. As your study progresses, you can add subsequent releases (`Release 2`, `Release 3`) to share newly acquired sessions or updated derivative pipelines.

---

## The Public Publication Page

Visitors accessing your publication via its direct URL or DOI will see a comprehensive, modern study portal:

- **Header & DOI**: Displays study title, authors, custom banner, and a persistent badge linking directly to the DataCite DOI.
- **Citations Card**: Formats the publication citation automatically and provides quick buttons to copy the plain text citation or BibTeX snippet.
- **ReadMe Card**: Renders your full Markdown documentation, protocols, and references.
- **Releases Explorer**:
  - Displays each release in an expandable accordion.
  - Lists included datatypes, subjects, and sessions.
  - Features an interactive **File Tree Browser** allowing visitors to inspect file hierarchies within archived data objects.
  - Includes integrated **Visualizations**, enabling users to open 2D/3D interactive visualizers directly from the browser before downloading.
- **Download Data**: Visitors can download individual files or entire datasets. If the project requires data access agreements, visitors will be prompted to log in and sign the required agreement before files can be retrieved.

---

## Discoverability: Global Research Hub

All published datasets on Brainlife are indexed on the global **Research / Publications** directory (`https://brainlife.io/pubs`). Researchers worldwide can discover your work by searching:
- Study names and author names
- Specific imaging modalities and datatypes (e.g., T1w, DWI, MEG, fMRI)
- Keywords, diseases, and ontology topics
- Associated project licenses

