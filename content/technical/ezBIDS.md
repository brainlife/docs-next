# ezBIDS technical documentation

This page is for researchers and developers who want to contribute to [ezBIDS](https://github.com/brainlife/ezbids){target=_blank}, the web tool that converts DICOM (and MEG) data to BIDS in the browser. ezBIDS reads the uploaded data, finds the information BIDS needs, and writes it to a file that the ezBIDS web interface reads and displays. This file is `ezBIDS_core.json`. To add support for something new (for example a new MRI or PET sequence), you need to understand what `ezBIDS_core.json` contains so that you can produce the same structure for the web interface. To use ezBIDS, see the [ezBIDS user guide](/using_ezBIDS).

## ezBIDS and aimport

ezBIDS covers neuroscience data: neurophysiology, neuroimaging and microscopy. The web app converts MRI, PET and MEG through `ezBIDS_core.json` (below). EEG, iEEG, NIRS, EMG and microscopy are handled by **aimport**, a local engine in the same repository ([`aimport/`](https://github.com/brainlife/ezbids/tree/master/aimport)) that reuses ezBIDS's mapping, conversion and defacing, adds an AI agent and a plan a person approves, de-identifies on the user's computer and validates against BIDS v1.11.2. It is driven by `bl aimport` (the brainlife.io Python CLI, [pybrainlife](https://github.com/brainlife/pybrainlife/tree/enh/cli#bl-aimport), branch `enh/cli`) or, in the future, ezBIDS desktop. aimport is not released yet. User guide: [aimport](/docs/using_aimport/); engine API and internals: [aimport/README.md](https://github.com/brainlife/ezbids/blob/master/aimport/README.md).

## The ezBIDS Core

The block below describes the contents of `ezBIDS_core.json`. Top-level keys are not indented; the type and description of each key are indented on the lines below it. If a key is a dictionary, a _fields_ key lists the keys it contains.

```yaml
# See https://bids-specification.readthedocs.io/en/stable/glossary.html#readme-files
"readme":
   "type": str
   "description": Details how the data(set) was converted. Default is "This data was converted using ezBIDS (https://brainlife.io/ezbids). Additional information regarding this dataset can be entered in this file."
# See https://bids-specification.readthedocs.io/en/stable/03-modality-agnostic-files.html#dataset-description
"datasetDescription":
   "type": dict
   "description": Specific information detailing the dataset
   "fields":
      "Name":
         "type": str
         "description": Name of the dataset, default is “Untitled"
      "BIDSVersion":
         "type": str
         "description": BIDS standard used for conversion, default is "1.9.0"
      "DatasetType":
         "type": str
         "description": Interpretation of the dataset, default is "raw"
      "License":
         "type": str
         "description": License of the dataset, default is empty string
      "Authors":
         "type": list
         "description": List of authors who contributed to the dataset, default is empty list
      "Acknowledgements":
         "type": str
         "description": Text of contributors not in authors list, default is empty string
      "HowToAcknowledge":
         "type": str
         "description": How to acknowledge the authors, default is empty string
      "Funding":
         "type": list
         "description": Funding sources, default is empty list
      "EthicsApprovals":
         "type": list
         "description": Ethics committee approvals, default is empty list
      "ReferencesAndLinks":
         "type": list
         "description": References detailing dataset, default is empty list
      "DatasetDOI":
         "type": str
         "description": Digital object identifier (DOI) of dataset, default is empty string
      # See https://bids-specification.readthedocs.io/en/stable/glossary.html#objects.metadata.GeneratedBy
      "GeneratedBy": 
         "type": dict
         "description": Specifies provenance of dataset
         "fields":
            "Name":
               "type": str
               "description": Name of the BIDS conversion tool, default is "ezBIDS"
            "Version":
               "type": str
               "description": BIDS converter tool version, default is 1.0.0
            "Description":
               "type": str
               "description": Description of the tool, default is "ezBIDS is a web-based tool for converting neuroscience datasets to BIDS, requiring neither coding nor knowledge of the BIDS specification"
            "CodeURL":
               "type": str
               "description": BIDS converter tool URL, default is "https://brainlife.io/ezbids/"
            "Container":
               "type": dict
               "description": Specifies information regarding the conversion Container
               "fields":
                  "Type":
                     "type": str
                     "description": Container type, default is "docker"
                  "Tag":
                     "type": str
                     "description": Container tag, default is "brainlife/ezbids-handler"
      # See https://bids-specification.readthedocs.io/en/stable/glossary.html#sourcedatasets-metadata
      "SourceDatasets":
         "type": dict
         "description": Specifies the locations and relevant attributes of all source datasets
         "fields":
            "DOI": 
               "type": str
               "description": Digital object identifier (DOI), default is empty string
            # See https://bids-specification.readthedocs.io/en/stable/02-common-principles.html#bids-uri
            "URL":
               "type": str
               "description": Uniform Resource Identifier (URI)-formatted string, default is empty string
            "Version":
               "type": string
               "description": Version of the source dataset, default is empty string
# Subjects-specific information
"subjects":
   "type": list
   "description": List of dictionaries containing information pertaining to subjects
   "fields":
      "subject":
         "type": str 
         "description": subject ID for the BIDS dataset, minus the sub- portion (e.g., “01”)
      "PatientInfo":
         "type": list
         "description": List of dictionary with DICOM header information
         "fields":
            "PatientName":
               "type": str
               "description": Corresponds to DICOM field (0010,0010)
            "PatientID":
               "type": str
               "description": Corresponds to DICOM field (0010,0020)
            "PatientBirthDate":
               "type": str
               "description": Corresponds to DICOM field (0010,0030)
      "phenotype":
         "type": dict
         "description": Phenotype information
         "fields":
            "sex":
               "type": str
               "description": Sex of the patient, should be “n/a” if information unavailable
            "age":
               "type": int
               "description": Age of the patient, should be "n/a" if information unavailable
      "exclude":
         "type": boolean
         "description": Whether or not subject should be excluded from BIDS conversion
      "sessions":
         "type": list
         "description": list of dictionary (or dictionaries) pertaining to session information of specific subject
         "fields":
            "session":
               "type": str
               "description": Session ID, if applicable. Should be empty string if not
            "AcquisitionDate":
               "type": str
               "description": Information from the json sidecar generated by dcm2niix
            "exclude":
               "type": boolean
               "description": Whether or not session should be excluded from conversion
      "validationErrors":
         "type": list
         "description": List of any validation errors, default is empty list 


# Participants (subjects) Column information, see https://bids-specification.readthedocs.io/en/stable/glossary.html#participant_id-columns
"participantsColumn":
   "type": dict
   "description": Describes properties of participants such as age, sex, handedness, etc
   "fields":
      "sex":
         "type": dict
         "description": Long-form information pertaining to participant's sex
         "fields":
            "Description":
               "type": str
               "description": Default value is "Sex of the participant(s)"
            "Levels":
               "type": dict
               "description": Levels of the sex (e.g. M or F)
               "fields":
                  "M":
                     "type": str
                     "description": Default is "male"
                  "F":
                     "type": str
                     "description": Default is "female"
      "age":
         "type": dict
         "description": Long-form information pertaining to participant's age
         "fields":
            "Description":
               "type": str
               "description": Default is "Age of the participant(s)"
            "Units":
               "type": str
               "description": Default is "year"
# Participants (subjects) information
"participantsInfo":
   "type": dict
   "description": Some participants information
   "fields":
      "<index_value>":
         "type": dict
         "description": Index-value (beginning with 0) in string form
         "fields":
            "sex":
               "type": str
               "description": Sex of participant, should be "n/a" if unknown
            "age":
               "type": int
               "description": Age of participant, should be "n/a" if unknown
            "PatientName":
               "type": str
               "description": ParticipantName DICOM value, should be "n/a" if unknown
            "PatientID":
               "type": str
               "description": ParticipantID DICOM value, should be "n/a" if unknown
# Series-level information
"series":
   "type": list
   "description": List of dictionaries pertaining to information of data with unique series ID. Data having the four identical values in the (SeriesDescription, ImageType, EchoTime, RepetitionTime) DICOM fields are given the same series ID (numeric value beginning at 0)
   "fields":
      "SeriesDescription":
         "type": str
         "description": Corresponds to DICOM field (0008,103E)
      "EchoTime":
         "type": float
         "description": Corresponds to DICOM field (0018,0081)
      "ImageType":
         "type": list
         "description": Corresponds to DICOM field (0008,0008)
      "RepetitionTime":
         "type": float
         "description": Corresponds to DICOM field (0018,0080)
      "NumVolumes":
         "type": int
         "description": Number of volumes for the first instance data with the specific unique series ID
      "IntendedFor":
         "type": null
         "description": Null value placeholder for IntendedFor
      "B0FieldIdentifier":
         "type": null
         "description": Null value placeholder for B0FieldIdentifier
      "B0FieldSource":
         "type": null
         "description": Null value placeholder for B0FieldSource
      "nifti_path":
         "type": str
         "description": Absolute file path and name to the first instance data with the specific unique series ID
      "series_idx":
         "type": int
         "description": Unique series ID index value (begins at 0)
      "AcquisitionDateTime":
         "type": str
         "description": Corresponds to DICOM field (0008,002A). Should be "0000-00-00T00:00:00.000000" if unknown
      "entities":
         "type": dict
         "description": Key values from here (https://github.com/bids-standard/bids-specification/blob/master/src/schema/rules/entities.yaml) with empty string values
      "type":
         "type": str
         "description": BIDS DataType and Suffix pairing, separated by backslash character (e.g. "anat/T1w")
      "error":
         "type": str or None
         "description": Issue(s) caused by data conversion
      "message":
         "type": str
         "description": Description of how the type (datatype/suffix pairing) was identified, or how it couldn't be identified.
      "object_indices":
         "type": list
# Objects-level (i.e. all individual data) information 
"objects":
   "type": list
   "description": List of dictionaries, with each dictionary containing information from each individual data sequence
   "fields":
      "subject_idx":
         "type": int
         "description": Subject ID index numeric value
      "session_idx":
         "type": int
         "description": Session ID index numeric value
      "series_idx":
         "type": int
         "description": Unique Session ID index numeric value
      "AcquisitionDate":
         "type": str
         "description": Corresponds to DICOM field (0008,0022), YYYY-MM-DD format. Should be "0000-00-00" if unknown
      "AcquisitionTime":
         "type": str
         "description": Corresponds to DICOM field (0008,0032), formatted in hh-mm-ss. Should be "00:00:00.000000" if unknown
      "SeriesNumber":
         "type": int
         "description": Corresponds to DICOM field (0020,0011)
      "ModifiedSeriesNumber":
         "type": str
         "description": Modified SeriersNumber, with values <10 zero padded (e.g. 01, 02, etc)
      "IntendedFor":
         "type": null
         "description": Null value placeholder for IntendedFor
      "B0FieldIdentifier":
         "type": null
         "description": Null value placeholder for B0FieldIdentifier
      "B0FieldSource":
         "type": null
         "description": Null value placeholder for B0FieldSource
      "entities":
         "type": dict
         "description": Key values from here (https://github.com/bids-standard/bids-specification/blob/master/src/schema/rules/entities.yaml) with empty string values
      "items":
         "type": list
         "description": List of dictionaries pertaining to metadata and file paths of the individual data
         "fields":
            "path":
               "type": str
               "description": Absolute file path & name of the data json file
            "name":
               "type": str
               "description": Default is "json"
            "sidecar":
               "type": dict
               "description": The data's json metadata sidecar (see dcm2niix json output as example)
         "fields":
            "path":
               "type": str
               "description": Absolute file path and name of the data NIfTI file
            "name":
               "type": str
               "description": Default is "nii.gz"
            "pngPaths":
               "type": list
               "description": List of absolute paths and names of the screenshot png files created by createThumbnailsMovies.py
            "headers":
               "type": list
               "description": NIfTI header information from the nibabel command, str(nibabel.load(<nifti_path>.header)).splitlines()[1:]
      "PED":
         "type": str
         "description": The phase encoding value (e.g., AP, PA, RL, LR, IS, SI)
      "analysisResults":
         "type": dict
         "description": "More specific information regarding the individual data file"
         "fields":
            "NumVolumes":
               "type": int
               "description": Number of volumes for the data NIfTI file
            "errors":
               "type": list
               "description": Default is empty list of errors
            "warnings":
               "type": list
               "description": Default is empty list of warnings
            "filesize":
               "type": int
               "description": Size of the NIfTI file
            "orientation":
               "type": str
               "description": Orientation of the NIfTI file data (e.g. RAS)
            "section_id":
               "type": int
               "description": Which section the individual data is in, starts at 1 and progresses up when new localizers are detected
```

## Backend Workflow

### 1. Uploading Data
When a user starts uploading data, ezBIDS creates a new session with the (post)/session API. A session holds one ezBIDS upload and conversion. For each session, ezBIDS creates a record in the session collection of the database (its MongoDB ID is the session ID) and a working directory named after the session ID on the backend server, where all uploaded data is stored. When all files are uploaded, the client calls (patch)/session/uploaded/:session_id, which sets the session state to "uploaded" so that the ezBIDS handler knows the session is ready for preprocessing.

### 2. Preprocessing Data
The backend server polls for uploaded sessions. When it finds one, it sets the session state to "preprocessing" and runs the preprocessing script. The script uncompresses all compressed folders and files, runs *dcm2niix*, and writes a list of all the NIfTI and JSON sidecar files. *ezBIDS_core.py* analyzes these files and writes *ezBIDS_core.json*. When preprocessing is complete, the session state is set to "analyzed". The preprocessing step then loads *ezBIDS_core.json* and copies its contents to the ezBIDS collection of the database (not the session collection) under the `original` key.

### 3. The user works with the session in the web interface
The web interface polls the session state, sees that preprocessing is complete, and loads *ezBIDS_core.json* with the (get)/download/:session_id/ezBIDS_core.json API. The user then reviews and corrects its contents.

### 4. The user asks for defacing (optional)
Before finalizing, the user can deface the anatomical images. The web interface then calls (post)/session/:session_id/deface with the list of images to deface. The backend stores the list as *deface.json* in the working directory (workdir) and sets the session state to "deface". The defacing handler finds sessions in the "deface" state, sets them to "defacing" and runs the *deface.sh* script. When defacing is complete, it sets the session state to "defaced".

*deface.sh* creates these files in the workdir:

1. *deface.finished* (the anatomical files that were defaced)
2. *deface.failed* (the anatomical files that could not be defaced)

The web interface polls these files to see which images were defaced. The user then chooses whether to use each defaced image: each object has a field `defaceSelection` set to "original" or "defaced".

### 5. Finalize
When the user selects **Finalize**, the web interface calls (post)/session/:session_id/finalize with this content from memory ($root):
```
{
    datasetDescription: this.datasetDescription,
    readme: this.readme,
    participantsColumn: this.participantsColumn,
    subjects: this.subjects, //for phenotype
    objects: this.objects,
    entityMappings,
}
```

The API stores this as *finalized.json* in the workdir and copies it to the ezBIDS collection under the `updated` key (next to `original`). The session state becomes "finalized". This starts the finalize handler on the server, which sets the state to "bidsing" and runs *bids.sh* to build the BIDS structure from the information in each object. When it is done, the session state is set to "finished".

### 6. Get the BIDS data
When the session state is "finished", the user can download the BIDS folder with the download API, or send it to other services (such as a brainlife.io project or OpenNeuro).


## This repo was bootstrapped by

```
npm init vite@latest ui2 -- --template vue-ts
```

## Code Styling/Formatting Guide

This repo has a few guardrails in it to ensure that only clean, standardized, and uniform code is committed into the ezBIDS repository. It is suggested that VSCode be used when contributing to ezBIDS to make use of the Prettier VSCode extension for convenience.

There are a few safeguards active:

1. We use husky to run a git precommit hook and lint staged files using esLint
2. We use husky to run a git precommit hook and run a prettier style check on staged files
3. A `.vscode/settings.json` file is attached to this repository, which configures VSCode to allow formatting of files on save and on paste.

Make sure that you run npm install to install husky if you have not already.
You must run *npm run prepare-husky* the first time you touch the project in order to initialize git hooks.

You can run `npm run lint-staged` at any time in order to run a style check on the staged files.
`lint-staged` makes a call to prettier and eslint to check if there are any files that do not adhere to the code standard.
It does NOT overwrite any files.

NOTE: If you want to skip the hook for whatever reason, you can run `git commit --no-verify ...` 

VS Code Recommendations:

1. Install the Prettier VS Code extension `esbenp.prettier-vscode`. This will allow you to format files based on prettier rules.
2. Install the eslint VS Code extension `dbaeumer.vscode-eslint`. This will allow you to see lint errors as you're writing code.
3. Install the Volar extension `vue.volar`. This provides Vue language features.

NOTE: The recommended extensions to install for this project should appear as a notification in the bottom right corner of the VSCode screen the very first time you open the project. You can also open the command palette and go to "Show Recommended Extensions." Alternatively, you can directly navigate to `.vscode/extensions.json` and install the listed extensions.