# Handling Job and Task Failure

In high-throughput scientific computing, compute jobs and pipeline tasks can occasionally fail. Tasks may fail due to incorrect configuration options, incompatible input data, application-level bugs, or temporary High-Performance Computing (HPC) cluster glitches.

On Brainlife Connects, all compute tasks are tracked in real time. When a task fails, the platform flags the process, isolates the error logs, and provides tools to inspect, diagnose, and rerun the workflow.

---

## 1. Locating Failed Processes

To find failed tasks in your project:

1. Open your project and navigate to the **3. Processing** tab.
2. Click on the **Processes** sub-tab (`/processing/processes`).
3. In the processes table, locate processes displaying the red **Failed** badge.
4. You can use the **Status** filter dropdown in the table header to isolate all failed processes across your project, or search by subject ID.

---

## 2. Inspecting the Process Side Panel

Clicking on any process row in the table opens the sliding **Process Side Panel**:

- **Process Header**: Displays the process title, execution instance ID, and overall status.
- **Task Stepper**: Shows the execution stages of the process (e.g., input staging, data preparation, App execution, and output archiving).
- **Process Actions**:
  - **Quick add app**: Append a new App task directly to this process.
  - **Quick add data**: Stage additional datasets into this process.
  - **Editor**: Jump directly to the visual **Process DAG Editor** (`/processing/processes/:instanceId/editor`).
  - **Delete**: Permanently remove the failed process instance.

---

## 3. Viewing Error Logs

When an App task fails, Brainlife captures standard error (`stderr`), standard output (`stdout`), and job scheduler output from the remote computing resource.

To view the error:

1. In the sliding side panel, locate the failed App step in the **Task Stepper**.
2. Expand the **Run** section and click on the **Logs** accordion.
3. **Automatic Error Log Detection**:
   Brainlife automatically detects the primary HPC error log (such as `slurm-*.err`) and streams it directly in the inline log viewer.
4. **Advanced File Browser**:
   Toggle the **Advanced** switch in the Logs header to reveal the full **Task Files** browser:
   - `slurm-*.out`: Full standard output from the cluster node.
   - `config.json`: The exact input configurations, parameter values, and data paths provided to the container.
   - `_app.sh` / wrapper script: The container invocation command executed on the compute node.
   - Intermediate files and scratch directories generated before the failure occurred.

---

## 4. Common Failure Causes & Solutions

### A. Missing or Incompatible Input Data
* **Symptom**: The log indicates missing files or unexpected input formats (e.g., `FileNotFoundError: dwi.bvals not found`).
* **Cause**: The input dataset was incomplete, lacked required datatype tags, or the App expected a specific preprocessing stage (such as skull-stripped or ACPC-aligned data).
* **Fix**: Check the App's required inputs in the **Apps** catalog (`/apps/:appId`). Ensure your input data-objects match the required datatype and datatype tags.

### B. High-Performance Computing (HPC) Resource Glitches
* **Symptom**: Errors such as `Disk quota exceeded`, `Out of Memory (OOM)`, `Bus error`, or SLURM walltime cancellation (`CANCELLED AT ... DUE TO TIME LIMIT`).
* **Cause**: Large datasets (such as multi-shell DWI or high-resolution 7T fMRI) may exceed default RAM limits or cluster scratch allocations.
* **Fix**:
  1. Open the process in the **Process DAG Editor**.
  2. Click on the task node and adjust compute resource parameters (request more memory or longer execution time).
  3. Alternatively, choose a different registered compute resource under your project's **Settings > Resources**.

### C. Application or Container Bugs
* **Symptom**: Python/C++ stack traces, segmentation faults inside the container, or tool-specific exit codes.
* **Cause**: An unhandled edge case or software defect within the App itself.
* **Fix**:
  1. Click the App name in the side panel or navigate to `/apps/:appId`.
  2. Review the App documentation and maintainer list.
  3. Click the **GitHub Repository** link to check existing issues or open a new bug report with the maintainer.
  4. Reach out to the community on the Brainlife Slack `#issues` channel with the task ID and error snippet.

---

## 5. Rerunning or Editing Failed Tasks

Once you have identified the cause of the failure:

1. **Rerun the Task**:
   If the failure was due to a temporary network blip or cluster timeout, click the **Rerun** button directly on the task in the side panel. Brainlife will resubmit the job to the cluster.
2. **Modify in the Process DAG Editor**:
   Click the **Editor** button in the side panel to open the interactive node graph:
   - Adjust task configuration parameters.
   - Rewire input data connections to alternative data-objects.
   - Click **Run** to execute the updated graph.
3. **Clean Up Failed Processes**:
   If a task is permanently invalid or superseded by a newer pipeline run, click the **Delete** button in the side panel to delete the process instance and free up cluster scratch space.
