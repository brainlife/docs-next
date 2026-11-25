# Installing the CLI

!!! note "bl aimport"
    [aimport](/docs/using_aimport/) is not released yet, and the npm package on this page (version 1.8.2) does not include `bl aimport`. To try it, install the Python CLI from its development branch: `pip install "git+https://github.com/brainlife/pybrainlife@enh/cli"`.

The brainlife.io command-line interface (CLI), `bl`, lets you work with brainlife.io from a terminal. With it you can:

* Upload and download datasets between brainlife.io and your computer or HPC storage.
* Upload and download whole datasets organized as **BIDS** (`bl bids`).
* Query projects, datatypes, resources, publications and Apps.
* Run Apps and wait for them to finish, so you can script your processing.
* List and download the files of projects stored on S3.

---

## Prerequisites: Node.js and npm

The CLI is distributed as the npm package [brainlife](https://www.npmjs.com/package/brainlife){target=_blank}. You need Node.js and npm on your computer.

### Ubuntu / Debian (Node.js LTS)

Install Node.js 20 LTS:

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

!!! info "macOS users"
    If you have [Homebrew](https://brew.sh/){target=_blank} installed, run:
    ```bash
    brew install node
    ```

!!! info "Windows users"
    On Windows, install [WSL (Windows Subsystem for Linux)](https://learn.microsoft.com/en-us/windows/wsl/install){target=_blank} and run the installation inside the Ubuntu terminal.

    Useful tools on Windows:
    * [7-Zip](https://www.7-zip.org/){target=_blank} for uncompressing `.tar.gz` downloads.
    * [MRIcron](https://www.nitrc.org/projects/mricron){target=_blank} or [Freeview](https://surfer.nmr.mgh.harvard.edu/fswiki/FreeviewGuide){target=_blank} for local neuroimaging visualization.

!!! note "HPC clusters"
    On shared clusters, Node.js is often available as a module:
    ```bash
    module load nodejs
    ```

---

## Installing the CLI

Install the CLI globally:

```bash
sudo npm install -g brainlife
```

*(If npm installs global packages in your home directory, leave out `sudo`.)*

### Check the installation

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

!!! tip "Alias"
    `bl dataset` is an alias for `bl data`.

### Update the CLI

Update regularly to get the latest fixes:

```bash
sudo npm update -g brainlife
```

---

## Log in

Before you use commands that touch your projects or private data, log in. `bl login` asks for your brainlife.io username and password and saves an access token:

```bash
$ bl login --ttl 30
username: hayashis
password: 
Successfully logged in for 29 days, 23 hours, 59 minutes, 59 seconds
```

### Options
* `--ttl <days>`: how many days the token stays valid (default `7`).
* `--username <user>`: give your username on the command line.
* `--password <password>`: give your password on the command line (for example in scripts).

### Where the token is stored

`bl login` saves your access token (a JWT) at:

```bash
~/.config/brainlife.io/.jwt
```

The file is readable only by your user account (permissions `600`). To sign out, delete it:

```bash
rm ~/.config/brainlife.io/.jwt
```

### Refresh the token

To extend a token that has not expired yet, without typing your password again (`--ttl` defaults to `1` day here):

```bash
bl refresh --ttl 30
```

!!! note "Accounts that sign in with Google, GitHub or ORCID"
    `bl login` needs a username and password. If you sign in to brainlife.io with Google, GitHub or ORCID and have no password, set one on your account page in the brainlife.io sign-in service ([brainlife.io/auth](https://brainlife.io/auth/#!/settings/account){target=_blank}, **Change Password**).

---

## Other environments

### Singularity or Docker container

On HPC clusters you can run the CLI from a container, without installing npm packages. The `brainlife/cli` image on Docker Hub may be older than the npm package (its latest tag is 1.7.0).

```bash
singularity run docker://brainlife/cli login
```

To use it as `bl`, add a function to your `~/.bashrc`:

```bash
function bl {
    singularity run docker://brainlife/cli "$@"
}
```

### Google Colab

To use the CLI in Google Colab:

1. Install the CLI in a notebook cell:
   ```bash
   !npm install -g brainlife
   ```

2. Colab cannot show the interactive password prompt of `bl login`. Get a token with this Python snippet instead:

```python
import getpass
import requests
import os

username = input("Enter brainlife username: ")
password = getpass.getpass("Enter brainlife password: ")

# Authenticate against the brainlife.io auth service
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
