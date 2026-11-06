## Overview

Today's AI coding assistants help developers write, test and debug code faster. Ahmed E. Hassan (Queen's University), Gustavo A. Oliva, Dayi Lin and Boyuan Chen (Huawei Canada) and Zhen Ming (Jack) Jiang (York University) argue that this is not enough. In this vision paper, they describe three eras of software engineering. SE 1.0 is classical, code-centric engineering supported by tools. SE 2.0 is today's AI-assisted engineering, where AI helps with traditional tasks but the developer still drives every step. SE 3.0, the era they call for, is AI-native: developers state what they want, refine it through a conversation with an AI teammate, and the AI turns that intent into running software.

The paper is not an experiment but a research agenda. It sets out the technology needed for SE 3.0 and a roadmap of open challenges, built from literature surveys, discussions with academic and industry leaders, and the authors' own prototypes.

## Why it matters

The authors start from a familiar scene: a developer writes a comment to get the assistant to generate code, rewrites it to force a specific library, runs the tests, discovers a missed requirement, explains it in the chat, compares three suggested fixes, and starts again. The AI writes pieces of code, but the human still has to break down the problem, guide every step and check every result. The authors call this cognitive overload.

They point to two other limits of SE 2.0. First, assistants tend to add code rather than simplify it, which can produce bloated, harder-to-maintain systems; they cite a study in which Cursor sped up development in the short term but steadily increased code complexity and static analysis warnings. Second, as AI-generated code spreads, it ends up in the data used to train future models, a loop that may lower their quality. For students learning to program today, this raises a direct question: which skills will still matter when much of the code is written by machines?

## Key findings

**1. Intent replaces code at the centre of development.** In SE 3.0, an intent is a desired outcome, expressed in any form: a description, pseudocode, a UI sketch or example data. The AI asks clarifying questions until human and AI agree, then searches for code that satisfies the intent. Source code is hidden by default but can always be opened for debugging. The conversations themselves become assets to version and archive, since code can be regenerated from them when better models arrive.

**2. A five-layer technology stack.** The authors describe what each layer must become:

| Layer | Today (SE 2.0) | Vision (SE 3.0) |
|---|---|---|
| Teammate.next | Static, impersonal assistant | Personalized teammate and mentor that learns from each interaction |
| IDE.next | Editing code | Conversations about intents |
| Compiler.next | Applying fixed rules to code | Searching many candidate solutions, balancing accuracy, cost and speed |
| Runtime.next | Serving single models | Running compound AI applications under service-level targets, with simple requests sent to small local models |
| FM.next | Models trained on raw internet data | Smaller models trained on a curated software engineering curriculum |

A key principle of Compiler.next is that tests are derived from intents, never from existing code, since code may not do what it should.

**3. Six concrete challenges, and more open questions.** The roadmap asks how an AI teammate can learn to ask neither too many nor too few clarifying questions, how to make code synthesis efficient, how to speed up the runtime, how to route requests between large and small models, how to give models a real grasp of software engineering beyond code patterns, and how to free developers from prompt engineering. For several of these, the authors report early prototypes, such as a router that sends 50% fewer requests to costly models while keeping about 90% of response quality.

## Discussion and implications

The paper's strength is its scope: it treats the whole chain, from model training to the IDE, as one engineering problem, and names open questions that go well beyond technology. What makes a good software engineer in SE 3.0, and how should universities change their curricula? If a personalized AI teammate leaves with a developer, whose property is it? How can SE 3.0 avoid excluding people who lack access to costly infrastructure?

Readers should keep the nature of the paper in mind. It is a vision, and the authors say the full stack can only be validated once every layer has a prototype. The supporting evidence comes mostly from the authors' own early systems, tested on benchmarks such as HumanEval-Plus. The paper is an arXiv preprint, first posted in October 2024 and revised in January 2026. In my reading, hiding code by default is the most debatable idea: the companion AIDev study (arXiv:2507.15003) finds that pull requests written by AI agents are still merged less often than human ones, which suggests that human review of code remains essential for now.

## Moving forward

The authors suggest working on all five layers in parallel and explicitly welcome opposing views. For communities like GAMA, the call to build "small and mighty" models with deep software engineering knowledge is especially relevant, since it would lower the cost of taking part. A question remains for educators: if code becomes secondary, how do we teach students to judge code they did not write?

## References

- Ahmed E. Hassan, Gustavo A. Oliva, Dayi Lin, Boyuan Chen and Zhen Ming (Jack) Jiang, [Towards AI-Native Software Engineering (SE 3.0): A Vision and a Challenge Roadmap](https://arxiv.org/abs/2410.06107), arXiv:2410.06107, version 2, January 2026.
- Related empirical study: Hao Li, Haoxiang Zhang and Ahmed E. Hassan, [The Rise of AI Teammates in Software Engineering (SE) 3.0](https://arxiv.org/abs/2507.15003), arXiv:2507.15003, July 2025.
