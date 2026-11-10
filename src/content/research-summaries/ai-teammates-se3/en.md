## Overview

Imagine describing an application you want to build and having an AI system plan the solution, write the code, fix problems, and propose the finished work for your approval.

This is the future envisioned by **Software Engineering 3.0 (SE 3.0)**, where AI moves beyond assisting developers to becoming an active teammate in software development.

In the first paper, Hassan and colleagues describe how this transformation could change software engineering. In the second, Li and colleagues investigate whether it is already happening. They analyze **more than 456,000 pull requests** created by autonomous coding agents in real GitHub projects.

Together, the papers address two questions: **How might humans and AI develop software together in the future? And what can we learn from their collaboration today?**

## Why it matters

Until recently, developers primarily wrote code themselves. AI assistants then emerged to suggest code, explain errors, and help write tests.

Now, autonomous coding agents can take on larger tasks. For example, a developer can describe a bug, and an agent may inspect the project, modify several files, run tests, and propose a fix.

This could make software development faster and more accessible. However, it also raises important questions: **Who verifies the AI's work? Who is responsible when something goes wrong? And how should future software engineers be trained?**

These questions matter because producing code is only one part of building reliable software.

## Key findings and ideas

### From coding assistants to AI teammates

The first paper describes three stages of software engineering.

**SE 1.0, human-driven development:** Developers primarily write, test, and maintain software using traditional tools.

**SE 2.0, AI-assisted development:** AI helps developers generate code, explain problems, and complete individual tasks.

**SE 3.0, AI-native development:** Humans describe what they want to achieve, while AI teammates help plan, implement, test, and improve the solution.

![Three panels linked by arrows. SE 1.0, human-driven: developers write, test and maintain code. SE 2.0, AI-assisted: AI suggests code and assists developers. SE 3.0, AI-native vision: humans define goals, AI teammates help build solutions.](/research-summaries/figures/se-1-2-3.webp "**Figure 1.** From human-driven coding to AI-native software engineering: the evolving role of developers and AI."){1662x427}

The important change is from telling AI **what code to write** to explaining **what problem to solve**.

SE 3.0 is a proposed vision, not a fully realized industry standard. Its success will depend on developing AI systems that are reliable, adaptable, and capable of meaningful collaboration with humans.

### AI agents are already contributing to real projects

The second paper introduces **AIDev**, a dataset documenting how autonomous coding agents contribute to open-source projects.

The researchers collected:

- **456,535 pull requests** created by AI agents.
- **61,453 GitHub repositories** containing those contributions.
- Contributions involving approximately **47,000 developers**.
- Activity from five major coding-agent systems: OpenAI Codex, Devin, GitHub Copilot, Cursor, and Claude Code.

![Three figures: 456,535 AI-authored pull requests, code contributions created by autonomous coding agents; 61,453 GitHub repositories, open-source projects with agent contributions; about 47,000 developers involved, human developers who created, reviewed or integrated agent pull requests.](/research-summaries/figures/aidev-scale.webp "**Figure 2.** The scale of autonomous coding-agent contributions observed in the AIDev study."){1672x387}

A _pull request_ is a proposal to add or modify code in a software project. Other contributors can review the proposed changes before accepting them.

The dataset shows that AI agents are already participating in activities such as fixing bugs, developing features, updating documentation, and maintaining software.

**The key message:** AI teammates are no longer merely a research vision. They are already participating in real software development workflows.

### Faster development does not guarantee better software

The researchers highlight several observations, summarized in Table 1.

**Table 1.** What the findings really mean

| Observation | What it tells us |
|---|---|
| Half of GitHub Copilot's analyzed PRs completed within 13 minutes | Agents can produce contributions quickly. |
| Some agents' PRs were accepted less frequently than human PRs | Speed does not guarantee acceptance. |
| One developer submitted 164 agentic PRs in three days | AI can substantially increase submission volume in individual cases. |
| Agent-generated changes tended to be structurally simpler | More contributions do not necessarily mean more complex work. |

The volume example is striking: those 164 AI-assisted pull requests in three days compare with 176 human-authored pull requests by the same developer over the previous three years.

These findings highlight an important distinction: **generating more code changes does not automatically mean delivering more valuable or reliable software.**

## Discussion and implications

The two papers suggest that software engineers may increasingly focus on defining requirements, reviewing solutions, verifying correctness, and supervising AI-driven workflows.

In my interpretation, this transformation makes software quality assurance even more important. If AI agents can generate changes in minutes, developers and organizations need effective ways to test those changes, understand their consequences, and establish accountability.

However, the evidence has limitations. AIDev analyzes observable contributions in selected GitHub repositories. It does not prove that AI agents improve overall team productivity, nor does it establish the long-term maintainability of the software they produce. The striking example of one developer's output should not be interpreted as a general productivity improvement.

## Moving forward

Future research should investigate how to evaluate AI-generated code, improve human-AI collaboration, and ensure that autonomous agents follow software quality, security, and governance requirements.

The next challenge is not simply building AI agents that write code faster, but developing **AI teammates whose decisions and contributions humans can understand, verify, and trust**.

**A question worth considering:** If AI agents increasingly write the code, what skills will distinguish the software engineers of tomorrow?

## References and replication package

**Original research papers**

1. Hassan, A. E., Oliva, G. A., Lin, D., Chen, B., & Jiang, Z. M. (2024). _Towards AI-Native Software Engineering (SE 3.0): A Vision and a Challenge Roadmap._ [arXiv:2410.06107](https://arxiv.org/abs/2410.06107)
2. Li, H., Zhang, H., & Hassan, A. E. (2025). _The Rise of AI Teammates in Software Engineering (SE) 3.0: How Autonomous Coding Agents Are Reshaping Software Engineering._ [arXiv:2507.15003](https://arxiv.org/abs/2507.15003)

**Dataset and replication resources**

- **AIDev dataset and replication repository:** [SAILResearch/AI_Teammates_in_SE3](https://github.com/SAILResearch/AI_Teammates_in_SE3) on GitHub.
