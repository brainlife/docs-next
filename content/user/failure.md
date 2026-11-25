# Troubleshooting failed jobs

A job (one run of one App) can fail because of a wrong setting, unsuitable input data, a bug in the App, or a problem on the resource that ran it. This page shows how to find failed jobs, read their logs, and run them again.

---

## 1. Find failed jobs

1. Open your project and select **3. Processing**.
2. **Summary** lists failures under **Failed**, and automation problems under **Needs Action**.
3. For the full list, select **Processes**. Set the **Status** filter to failed, or search with the **Process** filter.

---

## 2. Open the process side panel

Select a process in the **Processes** table. The side panel opens:

- At the top: the process name and these actions:
  - **Quick add app**: add another App to this process.
  - **Quick add data**: add datasets to this process.
  - **Editor**: open the process editor.
  - **Delete**: delete the process.
- For each App in the process, three steps: **Setup** (its inputs), **Run & logs** and **Results**.

---

## 3. Read the logs

1. In the side panel, find the failed App and open **Run & logs**.
2. Under **Logs**, brainlife.io shows the error log from the resource (for example a `slurm-*.err` file) when it finds one. If a summary of the failure is available, select **Open logs** or **Open detailed log**.
3. Turn on **Advanced** to browse all the job's files, for example:
   - `slurm-*.out`: the full output from the resource.
   - `config.json`: the settings and input paths the App received.
   - Other files the App wrote before it failed.
4. **Configs** shows the configuration the job ran with; you can copy or download it as JSON.

---

## 4. Common causes

### Missing or unsuitable input

* **What you see**: the log reports a missing file or an unexpected format (for example `FileNotFoundError: dwi.bvals not found`).
* **Why**: the input dataset is incomplete, lacks a datatype tag the App needs, or has not had a step the App expects (for example skull stripping or ACPC alignment).
* **What to do**: open the App's page (**Apps** in the sidebar) and check its **Inputs**. Make sure your datasets have the required datatype and datatype tags.

### Resource limits

* **What you see**: errors such as `Disk quota exceeded`, out of memory, `Bus error`, or a job cancelled for its time limit.
* **Why**: large inputs (for example multi-shell DWI or high-resolution fMRI) can need more memory or time than the resource gives.
* **What to do**: check the App's **Computing Resources** section on its page. A project admin can enable other resources in the project settings (**Edit** → **Resources**). Contact the App's maintainers if the App needs different limits.

### A bug in the App

* **What you see**: a stack trace, a segmentation fault, or a tool-specific error code.
* **Why**: a problem in the App itself.
* **What to do**:
  1. Open the App's page and check its **About** text and **People**.
  2. Select **View on GitHub** to check the repository's issues, or open a new one for the maintainers.
  3. Ask the brainlife.io community on Slack (see [Contact](/docs/contact/)), with the process name and the error.

---

## 5. Run it again

Once you know the cause:

1. **Rerun**: if the failure was temporary (a network or resource problem), select **Rerun task** (the icon next to the job's status) in the side panel.
2. **Change and rerun**: select **Editor** to open the process editor. Change the App's settings or its inputs, and add it again.
3. **Clean up**: if the job is no longer needed, select **Delete task** next to its status, or **Delete** to remove the whole process.

For a job started by an automation, fix the automation instead (see [Pipelines](/docs/user/pipeline/#change-an-automation)); an active automation submits the App again where the output is still missing.
