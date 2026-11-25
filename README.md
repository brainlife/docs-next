<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset=".github/brand/brainlife-mark-on-dark.svg">
    <img src=".github/brand/brainlife-mark-on-light.svg" alt="brainlife.io" width="140">
  </picture>
</p>

<h1 align="center">docs-next</h1>

<p align="center">
  The brainlife.io documentation, rebuilt with Next.js in the brainlife.io style.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Status-active-brightgreen.svg" alt="Status: active">
  <a href="https://brainlife.io"><img src="https://img.shields.io/badge/brainlife.io-site-3b9fd0.svg" alt="brainlife.io"></a>
  <a href="https://brainlife.io/docs"><img src="https://img.shields.io/badge/Docs-brainlife.io%2Fdocs-005981.svg" alt="Documentation"></a>
  <a href="https://doi.org/10.1038/s41592-024-02237-2"><img src="https://img.shields.io/badge/DOI-10.1038%2Fs41592--024--02237--2-e57536.svg" alt="Nature Methods paper"></a>
</p>

## 🧠 At a glance

| | |
|---|---|
| 🧭 **What** | Next.js site that renders the brainlife.io documentation (the same pages as [brainlife/docs](https://github.com/brainlife/docs), in [`content/`](content)) with the brainlife.io look and a generated search index |
| 🧱 **Stack** | Next.js · React · TypeScript · Chakra UI · Markdown content |
| 🌐 **Deploys to** | GitHub Pages at [brainlife.github.io/docs-next](https://brainlife.github.io/docs-next/) on every push to `main` ([`deploy.yml`](.github/workflows/deploy.yml)) |
| 📚 **Current docs** | [brainlife.io/docs](https://brainlife.io/docs) (built from [brainlife/docs](https://github.com/brainlife/docs)) |

## 🚀 Quick start

```bash
git clone https://github.com/brainlife/docs-next && cd docs-next
npm ci
npm run dev                # http://localhost:3000
npm run build              # builds the search index (scripts/generate-search-index.mjs), then the site
npm run lint
```

## ✍️ Editing a page

Pages are Markdown under [`content/`](content) (for example `content/using_ezBIDS.md`, `content/using_aimport.md`, `content/user/`, `content/apps/`); images live in `content/img/`. Until this site replaces brainlife.io/docs, make the same change in [brainlife/docs](https://github.com/brainlife/docs) so both stay in step.

## 🗂️ Layout

`app/` routes and page shells, `components/` navigation and Markdown rendering, `lib/` content loading, `content/` the documentation, `scripts/` the search-index builder. Agent notes: [AGENTS.md](AGENTS.md).

## 🔗 Related repositories

| Repository | Role |
|---|---|
| [docs](https://github.com/brainlife/docs) | Current MkDocs documentation (brainlife.io/docs) |
| [landing-next](https://github.com/brainlife/landing-next) | New landing site |
| [brainlife-lite](https://github.com/brainlife/brainlife-lite) | The brainlife.io web app |

## 📚 Citing

If you use brainlife.io in your work, please cite:

> Hayashi S, Caron BA, Heinsfeld AS, et al. brainlife.io: a decentralized and open-source cloud platform to support neuroscience research. *Nature Methods* 21:809–813 (2024). [doi:10.1038/s41592-024-02237-2](https://doi.org/10.1038/s41592-024-02237-2)

## 💰 Funding

brainlife.io is developed by the Pestilli Lab at The University of Texas at Austin and is publicly funded; acknowledging that support helps keep it running.

<details>
<summary>Grants (verified list, from <a href="https://github.com/brainlife/ezbids/blob/master/CREDITS.md#funding">ezbids CREDITS.md</a>)</summary>

| Funder | Award | Title |
|---|---|---|
| NIH NINDS | [U24NS140384](https://reporter.nih.gov/project-details/U24NS140384) | BRAIN CONNECTS: The Axonal Projectome EXchange (APEX) |
| NIH NIMH | [R01MH126699](https://reporter.nih.gov/project-details/R01MH126699) | Community-driven development of BIDS |
| NIH NIBIB | [R01EB030896](https://reporter.nih.gov/project-details/R01EB030896) | CRCNS US-France: open science and cloud computing of MEEG |
| NIH NIBIB | [R01EB029272](https://reporter.nih.gov/project-details/R01EB029272) | CRCNS US-France: lowering the barrier of entry to network neuroscience |
| NSF | [BCS-1636893](https://www.nsf.gov/awardsearch/showAward?AWD_ID=1636893), [2148729](https://www.nsf.gov/awardsearch/showAward?AWD_ID=2148729) | BD Spokes: Advanced Computational Neuroscience Network |
| NSF | [BCS-1734853](https://www.nsf.gov/awardsearch/showAward?AWD_ID=1734853), [2203524](https://www.nsf.gov/awardsearch/showAward?AWD_ID=2203524) | NCS-FO: Connectome mapping algorithms |
| NSF | [IIS-1912270](https://www.nsf.gov/awardsearch/showAward?AWD_ID=1912270), [2148700](https://www.nsf.gov/awardsearch/showAward?AWD_ID=2148700) | CRCNS US-German: DataLad |
| NSF | [ACI-1916518](https://www.nsf.gov/awardsearch/showAward?AWD_ID=1916518) | BD Hubs: Midwest Big Data Hub |
| Wellcome Trust | [226486](https://grantnav.threesixtygiving.org/grant/360G-Wellcome-226486_Z_22_Z) | Developing an international governance framework to advance global brain and mental health data equity and innovation |

</details>

## 🤝 Contributing

Issues and pull requests are welcome in this repository. For help using brainlife.io, see the [documentation](https://brainlife.io/docs).

## ⚖️ License

This repository does not include a license file yet.

<p align="center"><sub>brainlife.io · Brain data across scales. One place to analyze, share and publish it. · The University of Texas at Austin</sub></p>
