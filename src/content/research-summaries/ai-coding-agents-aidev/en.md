## Overview

Software engineering researchers have long predicted that AI would move from autocomplete to real teammates that take on whole tasks. In this paper, Hao Li, Haoxiang Zhang and Ahmed E. Hassan from Queen's University show that this shift has already started, and they measure it. They introduce AIDev, a public dataset of 456,535 pull requests opened on GitHub by five autonomous coding agents: OpenAI Codex, Devin, GitHub Copilot, Cursor and Claude Code. The pull requests span 61,453 repositories and 47,303 developers, collected up to June 22, 2025.

The scale alone is striking: OpenAI Codex opened more than 400,000 pull requests in less than two months after its release. To study quality and not only volume, the authors focus on a subset of 7,122 agent pull requests from 856 popular repositories (500 stars or more), and compare them with about 6,600 pull requests written by humans in the same repositories during 2025.

## Why it matters

Most of what we know about coding agents comes from benchmarks such as SWE-bench, where top systems now solve more than 70% of curated tasks. A benchmark checks whether a patch passes tests. A real project asks more: does the change fit the code style, the architecture and the maintainers' expectations? AIDev looks at that second question, using the decision that matters most in open source: whether the pull request gets merged.

For any team adopting these tools, from a startup to a research lab, the findings speak to practical questions: which tasks to hand to an agent, how much review effort to plan for, and how to keep track of who wrote what.

## Key findings

**1. Agents are used like developers, but their work is accepted less often.** Over 55% of agent pull requests are new features or bug fixes, close to the human mix. Yet every agent has a lower acceptance rate than humans, with the largest gaps on features, fixes and performance work. The authors see this gap between benchmark scores and real merges as a sign that current evaluations miss what reviewers actually care about. Documentation is the exception: OpenAI Codex (88.6%) and Claude Code (85.7%) beat the human baseline (76.5%) on documentation pull requests.

| Author of the pull request | Pull requests studied | Merged | Median time to merge |
|---|---|---|---|
| Humans | about 6,600 | 76.8% | 3.9 h |
| OpenAI Codex | 2,686 | 65.3% | 0.3 h |
| Claude Code | 101 | 52.5% | 6.9 h |
| Cursor | 144 | 51.4% | 2.4 h |
| Devin | 2,729 | 48.9% | 2.2 h |
| GitHub Copilot | 1,462 | 38.2% | 17.2 h |

**2. Review is fast, perhaps too fast.** Accepted OpenAI Codex pull requests close in a median of 18 minutes, about ten times faster than human ones. Most pull requests, from humans (75.3%) and agents (58.2%), show no formal review at all. Review bots appear twice as often on agent pull requests (20.1% against 10.0%), and they often come from the same provider as the agent: one Copilot bot writes 91% of the bot reviews on Copilot pull requests. The authors warn that such closed loops may share the same blind spots.

**3. More output, simpler changes, unclear authorship.** In one project, a single developer opened 164 Codex pull requests between May 30 and June 3, 2025, nearly as many as the 176 human-written pull requests of the previous three and a half years. Only 9.1% of those agent changes altered code complexity, against 23.3% for the human ones. Attribution also varies: Devin, Copilot and Cursor mark their work, Claude Code adds a co-author line that can be turned off, and OpenAI Codex leaves no trace. The authors argue that clear labelling of AI-written code should be a basic requirement.

## Discussion and implications

The paper's main message is that the right question is no longer "can AI generate code?" but "does AI-written code improve real projects?". The authors turn their findings into nine research directions, including benchmarks built from real workflows, studying rejected pull requests to understand how agents fail, and triage systems that send risky changes to experienced reviewers.

Some limits should be kept in mind. Agent pull requests are found through visible signals such as branch names and co-author lines, so agents used locally, like Cursor and Claude Code, are surely undercounted, as the authors note. The data covers the first weeks after several launches, task categories were labelled by an LLM, and the complexity result comes from a single project and developer. Agent and human pull requests come from the same repositories but not the same tasks, so acceptance rates are not a strict head-to-head comparison. The paper is an arXiv preprint submitted to an ACM venue. In my reading, finding 2 is the most important for practitioners: if review does not scale with agent output, quality depends on how carefully humans still read the code.

## Moving forward

AIDev is released openly with its schema and example notebooks, which makes it a ready resource for student projects and theses in empirical software engineering. Natural next steps include tracking defects in merged agent code over time and measuring real review effort. One question stays open: if teams start merging agent work they no longer read closely, who is accountable when it breaks?

## References

- Hao Li, Haoxiang Zhang and Ahmed E. Hassan, [The Rise of AI Teammates in Software Engineering (SE) 3.0: How Autonomous Coding Agents Are Reshaping Software Engineering](https://arxiv.org/abs/2507.15003), arXiv:2507.15003, July 2025.
- Dataset and code: [SAILResearch/AI_Teammates_in_SE3](https://github.com/SAILResearch/AI_Teammates_in_SE3) on GitHub.
- Related vision paper: Ahmed E. Hassan et al., [Towards AI-Native Software Engineering (SE 3.0): A Vision and a Challenge Roadmap](https://arxiv.org/abs/2410.06107), arXiv:2410.06107.
