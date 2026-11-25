# Skill pihak ketiga

Tidak disalin ke repo ini karena lisensi tiap skill milik pembuatnya. Pemasang mengunduhnya dari sumber asli.

- `pasang.ps1` / `pasang.sh`: yang dipakai tim saja.
- `pasang.ps1 -Lengkap` / `sh pasang.sh lengkap`: semua dari tiga sumber.

Manual, semua skill:

```sh
npx skills add anthropics/skills --skill '*' --agent claude-code --yes
```
```sh
npx skills add thedotmack/claude-mem --skill '*' --agent claude-code --yes
```
```sh
npx skills add obra/superpowers --skill '*' --agent claude-code --yes
```

Lemo-Opuscar (99 gaya film): https://github.com/lemomo-ai/lemo-opuscar, diunduh otomatis oleh pemasang.

## Dipakai agent
verification-before-completion (semua), systematic-debugging (Mandala, Ilham, Uly), canvas-design (Ricky, Gina), brainstorming (Ivo).

claude-mem: skill memorinya baru berfungsi bila mesin claude-mem juga dipasang; lihat panduan di repo aslinya.

## Daftar lengkap

### anthropics/skills (20)
academy-guide, algorithmic-art, brand-guidelines, canvas-design, claude-api, discernment-nudge, doc-coauthoring, docx, frontend-design, internal-comms, mcp-builder, pdf, pptx, skill-creator, slack-gif-creator, template-skill, theme-factory, web-artifacts-builder, webapp-testing, xlsx

### thedotmack/claude-mem (32)
agent-cost-report, babysit, backup-setup, build, build-and-release, ccs-align, childhood, cloud-sync, community-sweep, design-is, do, handoff, how-it-works, knowledge-agent, learn-codebase, make-plan, mem-search, mem-setup, mode-creator, oh-my-issues, owner-goals, pathfinder, release, request-progress, screenpipe, smart-explore, standup, timeline-report, version-bump, weekly-digests, what-the, wowerpoint

### obra/superpowers (15)
brainstorming, diagnosing-superpowers, dispatching-parallel-agents, executing-plans, finishing-a-development-branch, receiving-code-review, requesting-code-review, subagent-driven-development, systematic-debugging, test-driven-development, using-git-worktrees, using-superpowers, verification-before-completion, writing-plans, writing-skills
