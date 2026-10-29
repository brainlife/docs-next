# CLI Installation

With the Brainlife CLI (`bl`), you can:

* Upload and download data objects directly to and from your computer or HPC storage.
* Upload and download complete datasets formatted according to the **BIDS standard** (`bl bids`).
* Query projects, datatypes, resources, and publications.
* Submit and monitor Brainlife Apps to fully script and automate processing pipelines.
* Access and download raw project files stored in Brainlife's S3 storage.

---

## Prerequisites: Node.js & npm

Brainlife CLI is distributed as an npm package via [npmjs.com/package/brainlife](https://www.npmjs.com/package/brainlife){target=_blank}. You must have Node.js and npm installed on your machine.

### Ubuntu / Debian (Node.js LTS)

Run the following commands to install Node.js (Node 20 LTS):

```bash
sudo apt update
sudo apt upgrade
sudo apt install -y ca-certificates curl gnupg
sudo mkdir -p /etc/apt/keyrings
curl -fsSL https://deb.nodesource.com/gpgkey/nodesource-repo.gpg.key | sudo gpg --dearmor -o /etc/apt/keyrings/nodesource.gpg
NODE_MAJOR=20
echo "deb [signed-by=/etc/apt/keyrings/nodesource.gpg] https://deb.nodesource.com/node_$NODE_MAJOR.x nodistro main" | sudo tee /etc/apt/sources.list.d/nodesource.list
sudo apt update
sudo apt-get install -y nodejs
```

!!! info "macOS Users"
    If you have [Homebrew](https://brew.sh/){target=_blank} installed, run:
    ```bash
    brew install node
    ```

!!! info "Windows Users"
    To use the Brainlife CLI on Windows, install [WSL (Windows Subsystem for Linux)](https://learn.microsoft.com/en-us/windows/wsl/install){target=_blank} and run the installation inside the Ubuntu terminal.

    Useful companion tools on Windows:
    * [7-Zip](https://www.7-zip.org/){target=_blank} for uncompressing `.tar.gz` downloads.
    * [MRIcron](https://www.nitrc.org/projects/mricron){target=_blank} or [Freeview](https://surfer.nmr.mgh.harvard.edu/fswiki/FreeviewGuide){target=_blank} for local neuroimaging visualization.

!!! note "HPC & Cluster Environments"
    On shared academic computing clusters (e.g. IU Karst, Carbonate, Big Red, or TACC Stampede), Node.js is often available as a module:
    ```bash
    module load nodejs
    ```

---

## Installing the CLI

Once Node.js and npm are installed, install the Brainlife CLI globally:

```bash
sudo npm install -g brainlife
```

*(If you have configured npm to install packages in your user home directory without root, you can omit `sudo`.)*

### Verifying Installation

Verify that the CLI is installed correctly:

```bash
$ bl --version
1.8.2

$ bl -h
Usage: bl [options] [command]

Options:
  -V, --version  output the version number
  -h, --help     output usage information

Commands:
  version        print brainlife CLI version number
  login          login to brainlife and generate a temporary access token
  refresh        refresh authentication token
  profile        query the available list of profiles
  resource       query the available list of resources
  datatype       query the available list of datatypes
  project        create and view brainlife projects
  pub            query brainlife publications
  data           view, query, and download stored data objects (datasets and S3 project files)
  bids           bids upload / download
  app            query and run brainlife apps
  help [cmd]     display help for [cmd]
```

!!! tip "Command Aliases"
    `bl dataset` is a recognized alias for `bl data`. You can use either command interchangeably.

### Updating the CLI

To ensure you have the latest bug fixes, features, and API compatibility, update regularly:

```bash
sudo npm update -g brainlife
```

---

## Authentication & Login

Before running CLI commands that interact with your private data or projects, log in to Brainlife to issue an access token:

```bash
$ bl login --ttl 30
username: hayashis
password: 
Successfully logged in for 29 days, 23 hours, 59 minutes, 59 seconds
```

### Options:
* `--ttl <days>`: Set how many days your access token remains valid (default is `7`).
* `--username <user>`: Pass your username directly.
* `--password <password>`: Pass your password directly (e.g. for non-interactive scripts).
* `--ldap`: Log in using university LDAP credentials if your institution is configured.

### Token Storage & Signout

`bl login` securely stores your JWT access token on your machine at:

```bash
~/.config/brainlife.io/.jwt
```

File permissions are automatically set to `600` (readable only by your user account). To sign out, simply remove this file:

```bash
rm ~/.config/brainlife.io/.jwt
```

### Refreshing Tokens

You can refresh an existing, unexpired token without re-entering your credentials:

```bash
bl refresh --ttl 30
```

!!! note "Accounts using Third-Party OAuth (Google, GitHub, ORCID)"
    If you created your Brainlife account via Google, GitHub, or ORCID and do not have a local password, you can set a password in your Brainlife Account Settings on [brainlife.io](https://brainlife.io), or issue a long-lived CLI token via the Brainlife profile settings.

---

## Alternative Environments

### Singularity / Docker Container

You can run the Brainlife CLI hosted inside a Singularity/Docker container on HPC clusters without installing local npm packages:

```bash
singularity run docker://brainlife/cli login
```

To make `bl` available as a shortcut command in your shell, add an alias or function to your `~/.bashrc`:

```bash
function bl {
    singularity run docker://brainlife/cli "$@"
}
```

### Google Colab

To use the Brainlife CLI inside Google Colab:

1. Install the CLI in a notebook cell:
   ```bash
   !npm install -g brainlife
   ```

2. Because Google Colab does not support an interactive TTY password prompt for `bl login`, authenticate by generating your token with this Python snippet:

```python
import getpass
import requests
import os

username = input("Enter brainlife username: ")
password = getpass.getpass("Enter brainlife password: ")

# Authenticate against Brainlife auth service
res = requests.post(
    'https://brainlife.io/api/auth/local/auth', 
    json={'username': username, 'password': password, 'ttl': 1000 * 60 * 60 * 24 * 30}
)

if res.status_code == 200:
    jwt_token = res.json()["jwt"]
    config_dir = os.path.expanduser('~/.config/brainlife.io')
    os.makedirs(config_dir, exist_ok=True)
    with open(os.path.join(config_dir, '.jwt'), 'w') as f:
        f.write(jwt_token)
    print("Authentication successful. JWT token saved to ~/.config/brainlife.io/.jwt")
else:
    print(f"Login failed: {res.status_code} - {res.text}")
```
