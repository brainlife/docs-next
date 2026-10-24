# Task Orchestration Engine (Amaretti)

**Amaretti** is Brainlife's lightweight, cross-resource, multi-user computational task orchestration engine. Written in Node.js, Amaretti operates as a **meta-scheduling system**: rather than replacing cluster job schedulers, it sits directly on top of heterogeneous computing infrastructures (such as SLURM, PBS/Torque, HTCondor, OpenNebula, and cloud VMs) to coordinate high-throughput scientific computing across distributed institutional boundaries.

Its primary mission is to eliminate the manual burden of distributed data engineering—automating compute resource selection, input data staging, containerized execution, real-time log monitoring, inter-cluster data synchronization, and scratch space lifecycle management.

---

## 1. System Architecture & Topology

Amaretti decouples high-level scientific workflow logic from low-level cluster execution. It connects to registered computing clusters via secure OpenSSH channels, manages job execution states in MongoDB, and broadcasts real-time status transitions over RabbitMQ.

```
                              ┌──────────────────────────────────────────────┐
                              │           Brainlife Web Portal / CLI         │
                              └──────────────────────┬───────────────────────┘
                                                     │ REST API & WebSockets
                                                     ▼
                              ┌──────────────────────────────────────────────┐
                              │             Nginx Reverse Proxy              │
                              └───────┬──────────────┬───────────────┬───────┘
                                      │              │               │
                                      ▼              ▼               ▼
                              ┌──────────────┐ ┌───────────┐ ┌───────────────┐
                              │ Auth Service │ │ Warehouse │ │ Event Service │
                              │ (JWT Tokens) │ │(Data/Pub) │ │  (WebSockets) │
                              └──────────────┘ └─────┬─────┘ └───────▲───────┘
                                                     │               │
                                                     │ REST Requests │ AMQP Events
                                                     ▼               │
                              ┌──────────────────────────────────────┴───────┐
                              │             AMARETTI ORCHESTRATOR            │
                              │  ┌─────────────────┐   ┌──────────────────┐  │
                              │  │ Resource Scorer │   │ Task State Mach. │  │
                              │  ├─────────────────┤   ├──────────────────┤  │
                              │  │ SSH Multiplexer │   │ Rsync Controller │  │
                              │  └─────────────────┘   └──────────────────┘  │
                              └──────────┬─────────────────────┬─────────────┘
                                         │                     │
                     ┌───────────────────┴──────────┐          │
                     │ OpenSSH Multi-Channel Tunnel │          │ OpenSSH Multi-Channel Tunnel
                     ▼                              ▼          ▼
         ┌───────────────────────┐              ┌────────────────────────┐
         │  HPC Cluster Alpha    │              │   Cloud Grid Beta      │
         │  (Slurm / PBS)        │              │   (HTCondor / VMs)     │
         │  - Singularity Engine │              │   - Docker Engine      │
         │  - Scratch Storage    │              │   - Scratch Storage    │
         └───────────┬───────────┘              └───────────▲────────────┘
                     │                                      │
                     └──────── Direct Inter-Cluster ────────┘
                                rsync via SSH-Agent
```

---

## 2. Core Capabilities

### A. Dynamic Resource Scoring & Optimal Dispatch
When a task is submitted, Amaretti does not arbitrarily dispatch it to a cluster. Instead, the **Resource Selection Algorithm** queries all registered computing resources and calculates an execution suitability score based on:
1. **Application Whitelist**: Whether the resource administrator has approved and enabled this specific App.
2. **Cluster Health & Reachability**: Real-time SSH ping status and cluster load.
3. **Execution History & Latency**: Prior success rates, average queue wait times, and execution duration for similar tasks.
4. **User & Project Allocations**: User billing accounts, project resource bindings, and administrator priority overrides.

If the highest-scoring resource is temporarily unavailable or offline, Amaretti queues the task safely in `requested` status until connectivity is restored or falls back to an eligible alternative cluster.

---

### B. Task Lifecycle & State Transitions

Compute tasks transition through a strictly enforced state machine:

```
[ requested ] ──> ( Resource Assigned ) ──> [ running ] ──> ( Exit Code 0 ) ──> [ finished ]
      │                                           │                                  │
      │ (Resource Failure)                        │ (Job Error / Segfault)           │ (25 Days Elapsed)
      ▼                                           ▼                                  ▼
 [ waiting ]                                  [ failed ]                         [ removed ]
                                                  │
                                                  │ (User Rerun)
                                                  ▼
                                            [ requested ]
```

* **`requested`**: The task is validated and registered in MongoDB. It is evaluated by the resource selector and awaits dispatch.
* **`running`**: Input data is synchronized to the remote cluster's scratch directory, container images are cached, and the job is queued in the cluster scheduler (e.g., via `sbatch`).
* **`finished`**: The job completed with exit code `0`. Standard output and error files are finalized, and output datasets are registered for archiving.
* **`failed`**: The task exited with a non-zero exit code or was terminated by the cluster scheduler (e.g., walltime limit exceeded or out-of-memory).
* **`removed`**: The temporary work directory on remote scratch storage was purged according to data retention policies.

---

### C. Direct Inter-Cluster Data Synchronization

A major bottleneck in multi-cloud and distributed HPC computing is data transfer between independent clusters. If Task 1 runs on **Cluster A** (e.g., Indiana University Karst) and child Task 2 must run on **Cluster B** (e.g., TACC Stampede), naive orchestrators proxy multi-gigabyte files through their central API server.

Amaretti solves this by establishing **direct peer-to-peer inter-resource synchronization**:

```
                       ┌───────────────────────────────┐
                       │     Amaretti Orchestrator     │
                       └──────┬─────────────────┬──────┘
       1. Installs Temporary  │                 │ 2. Forwards Agent
          SSH Key for R1      ▼                 ▼    to R2
                        ┌──────────┐       ┌──────────┐
                        │ Resource │       │ Resource │
                        │  R1 (A)  │       │  R2 (B)  │
                        └────┬─────┘       └────▲─────┘
                             │                  │
                             └──── 3. rsync ────┘
                                   Direct Pull
                       (Temporary SSH key purged immediately)
```

1. Amaretti starts an in-memory `ssh-agent` and generates a temporary, single-use SSH key pair authorizing access to Resource 1.
2. Amaretti establishes an SSH connection to Resource 2 with **SSH-Agent Forwarding** enabled.
3. From Resource 2, Amaretti executes `rsync` to pull the parent task directory directly from Resource 1 over an encrypted channel.
4. The temporary SSH key is revoked and purged from memory immediately upon connection establishment, ensuring zero credential persistence.

---

### D. Task Dependencies & Cascading Workflows

Tasks can be linked together into Directed Acyclic Graphs (DAGs) through explicit task dependencies:
- **Prerequisite Validation**: A child task will not enter `running` status until all parent tasks have reached `finished` status with valid output files.
- **Cascading Failure**: If an upstream task fails, Amaretti automatically halts downstream child tasks, marking them as blocked to avoid wasting compute cycles.
- **Cascading Rerun**: If a researcher adjusts parameters and reruns a failed parent task, upon its successful completion Amaretti automatically re-triggers all dependent downstream child tasks.
- **Instance Scoping**: Related tasks are grouped under an **Instance**. Instances provide a shared filesystem namespace on remote compute nodes, allowing downstream tasks on the same cluster to read parent outputs locally without network transfers.

---

### E. Scratch Space Lifecycle & 25-Day Purging Policy

To prevent multi-terabyte datasets from overflowing high-speed scratch storage on partner HPC clusters:
1. **Multi-Location Tracking**: Amaretti continuously tracks which compute clusters currently maintain a local copy of a task's working directory.
2. **25-Day Retention**: By default, working scratch directories on HPC resources are scheduled for automatic deletion 25 days after task completion.
3. **Automatic Status Transition**: When all physical remote working directories for a task have been purged, Amaretti transitions the task status to `removed`.
4. **Permanent Preservation**: Datasets archived into Brainlife's **`2. Data`** tab or published in **Publications** are permanently preserved in secondary storage (IU Scholarly Data Archive tape and AWS S3) and are completely immune to scratch purging.

---

### F. OpenSSH Multi-Channel Multiplexing

Connecting to remote HPC clusters over standard SSH can incur significant latency (200–800ms per handshake) and trigger connection throttling from institutional firewall bastions.

Amaretti implements an intelligent **OpenSSH Multi-Channel Connection Cache**:
- Maintains persistent master SSH daemon sockets to active compute clusters.
- Multiplexes multiple task commands, file transfers, and log queries over shared OpenSSH channels.
- Employs request throttling and connection backoff to respect institutional security policies while minimizing execution latency.

---

## 3. ABCD Container Specification

Amaretti executes applications following the **ABCD (Action-Based Computational Derivative) Specification**:
- **GitHub Hosted**: Apps are maintained in public or private Git repositories. Users can specify exact branch names, release tags, or commit SHAs to guarantee scientific reproducibility.
- **Containerized**: App workloads execute inside Singularity (on HPC clusters) or Docker (on cloud nodes) containers.
- **Standardized Working Directory**:
  - `config.json`: Amaretti injects all user configuration options, parameters, and paths to input data-objects.
  - `_app.sh` / wrapper script: The containerized command executed on the cluster.
  - Output files: The application writes all derivatives directly into the working directory, where Amaretti catalogs and validates them against the registered Brainlife Datatype.

---

## 4. Standalone Installation & Self-Hosting

While Amaretti is hosted and managed in production by the Brainlife team at Indiana University, it can be deployed independently by research institutions as a private compute orchestrator.

### Prerequisites

| Component | Recommended Version | Purpose |
| :--- | :--- | :--- |
| **Node.js** | `>= 18.x LTS` | Amaretti core runtime |
| **MongoDB** | `>= 6.0` | Task state, instance definitions, and resource configs |
| **Redis** | `>= 7.0` | High-speed cache for cluster health metrics |
| **RabbitMQ** | `>= 3.11` | Event message bus (`wf.task`, `wf.instance`) |
| **Nginx** | `>= 1.22` | SSL termination, reverse proxy, and WebSocket streaming |

---

### Docker Deployment

To launch Amaretti using Docker:

```bash
# 1. Pull the official Amaretti container image
docker pull soichih/workflow

# 2. Create local configuration directory
mkdir -p /opt/amaretti/config

# 3. Launch the container
docker run -d \
    --name amaretti-orchestrator \
    --restart always \
    --network host \
    -v /opt/amaretti/config:/app/config \
    -v ~/.ssh:/root/.ssh:ro \
    soichih/workflow
```

---

### Nginx Reverse Proxy Configuration

To expose Amaretti securely over HTTPS with WebSocket event streaming:

```nginx
server {
    listen 443 ssl http2;
    server_name orchestrator.example.org;

    ssl_certificate /etc/letsencrypt/live/orchestrator.example.org/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/orchestrator.example.org/privkey.pem;

    proxy_redirect off;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto https;

    # Amaretti REST API
    location /api/amaretti/ {
        proxy_pass http://127.0.0.1:8080/;
        proxy_read_timeout 300s;
        proxy_send_timeout 300s;
    }

    # WebSocket Real-Time Event Stream
    location /api/amaretti/events {
        proxy_pass http://127.0.0.1:8080/events;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_read_timeout 86400s;
    }
}
```
