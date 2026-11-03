---
title: Finding research papers
description: A practical guide to finding computer science papers in ACM Digital Library and arXiv: Boolean queries, examples by research area, curated collections and checks.
lead: A practical guide to ACM Digital Library and arXiv. Use it to find a paper for a research summary, a WeekPaper presentation, or a first exploration of the literature. No paid search tool is required.
---

## Before you start {#intro}

This guide is for GAMA students and community contributors. The examples focus on software engineering, cloud computing and MLOps, cybersecurity, and responsible and trustworthy AI.

[ACM Digital Library](https://dl.acm.org/) and [arXiv](https://arxiv.org/search/cs) are the two research libraries covered here. GitHub lists and an X account provide additional discovery leads.

## 1. Build a focused search {#requete}

Start with a question, such as "How can large language models generate unit tests?" Identify two main concepts, list alternative terms, and combine them. **Search in English**, even if you plan to present the paper in French.

| Tool | Purpose | Example |
|---|---|---|
| AND | Require both concepts | `unit test generation AND large language models` |
| OR | Include alternative terms | `unit testing OR test generation` |
| NOT | Exclude a term, with care | `software testing NOT hardware testing` |
| Quotation marks | Keep words together as a phrase | `"automated program repair"` |
| Parentheses | Group alternatives (ACM) | `(unit testing OR test generation) AND large language models` |

Write Boolean operators in uppercase and use straight quotation marks.

### Broaden or narrow deliberately

**Too few results:** remove one concept, shorten an exact phrase, or try synonyms. **Too many results:** add a specific task or language, search titles or abstracts, or apply a date filter.

Use NOT sparingly, because it can remove relevant studies. Adding `survey` to your query helps you find background reading.

## 2. Search ACM Digital Library {#acm}

[ACM Digital Library](https://dl.acm.org/) provides computing journals and conference proceedings. Its move to full open access began in January 2026. The broader ACM Guide to Computing Literature also indexes other publishers, so an indexed external paper is not necessarily available in full text through ACM.

1. Open [ACM Digital Library](https://dl.acm.org/).
2. Run your query.
3. Adjust the filters (publication date, authors, venues).
4. Open promising papers, read their abstracts, and use the PDF or HTML full text.

### Worked example: unit test generation

Question: how are large language models used to generate unit tests? Start with:

```
unit test generation AND large language models
```

If this is too restrictive, use parentheses to include alternative wording:

```
(unit test generation OR unit testing) AND (large language models OR LLM)
```

Compare the results before applying a recent date range. Older papers often supply important foundations; recent papers reveal newer methods and evaluations. A search match is a candidate, not evidence that the study answers your question.

![ACM Digital Library results page for the unit test generation query](/guides/acm-search.png "ACM results for the query above. Filters are in the left column (red box); the PDF icon (arrow) opens the full text.")

## 3. Search arXiv {#arxiv}

[arXiv](https://arxiv.org/search/cs) provides free manuscripts, including preprints and author versions of published papers. **arXiv does not peer-review submissions.**

1. Open the [arXiv computer science search](https://arxiv.org/search/cs).
2. Run your query.
3. Pick the field to search (title, abstract or all fields) and the sort order.
4. Open promising papers, read their abstracts, and use the PDF or HTML full text.

![arXiv results page for the same query](/guides/arxiv-search.png "arXiv results for the same query. The “All fields” menu (red box) narrows the search to titles or abstracts; the [pdf] link (arrow) opens the paper.")

## 4. Select and record a paper {#selection}

Read the title and abstract, then scan the introduction, main results and limitations. Can you explain the problem and contribution? Check what data, systems or participants support the conclusions. Select a manageable paper whose evidence you can discuss accurately.

Record the paper title, authors, year, an accessible link, and a one-sentence reason for selecting it.

> If access fails, search the exact title in the other library. If the paper is still unavailable, [write to us](mailto:contact@gamainstitute.ca) with its title and link: we can help find an accessible version or a suitable alternative.

## 5. Query examples by research area {#exemples}

These are starting points, not guaranteed result sets. Use them as-is in ACM's Boolean search. In arXiv, combine the terms with the advanced search.

### Software engineering

```
unit test generation AND large language models
automated program repair AND test generation
code generation AND software quality
requirements engineering AND traceability
code review AND defect detection
```

### Cloud computing and MLOps

```
infrastructure as code AND large language models
MLOps AND monitoring
cloud computing AND resource allocation
```

### Cybersecurity

```
prompt injection AND large language models
vulnerability detection AND deep learning
software supply chain AND security
```

### Responsible and trustworthy AI

```
machine learning AND fairness
AI governance AND software engineering
large language models AND cultural bias
```

## 6. Start from curated collections {#collections}

GitHub reading lists help you learn terminology, identify foundational papers, and find code or datasets. Their coverage and maintenance vary: some entries may be old and some links broken. They are not complete or necessarily current literature reviews.

- **[Software engineering for AI and ML](https://github.com/ckaestne/seaibib)**: an annotated bibliography. Start here to understand how software engineering applies to systems with AI components.
- **[Awesome Software Engineering for Machine Learning](https://github.com/SE-ML/awesome-seml)**: development practices, testing, quality, deployment and operation, with research and practitioner material.
- **[Awesome MLOps](https://github.com/visenger/awesome-mlops)**: operating ML systems, including a dedicated papers collection. Separate research papers from tools, talks and tutorials.
- **[Awesome LLM Security](https://github.com/corca-ai/awesome-llm-security)**: papers, benchmarks and tools on LLM attacks and defences. Follow the original paper links to verify claims.
- **[Awesome Responsible AI](https://github.com/AthenaCore/AwesomeResponsibleAI)**: research and resources on responsible and trustworthy AI. Distinguish academic evidence from reports and guidance.
- **[Awesome LLM as a Judge](https://github.com/llm-as-a-judge/Awesome-LLM-as-a-judge)**: using LLMs to evaluate AI-generated outputs, and the challenges of reliability, bias and code correctness.
- **[Awesome Machine Learning for Software Engineering](https://github.com/saltudelft/ml4se)**: papers, theses, datasets and tools on applying machine learning to software engineering (code generation, completion, summarization and changes).
- **[Awesome LLM for Software Engineering](https://github.com/iSEngLab/AwesomeLLM4SE)**: the papers from a survey of LLMs for software engineering, organized by task.
- **[Awesome Agent for Software Engineering](https://github.com/DeepSoftwareAnalytics/Awesome-Agent4SE)**: LLM-based agents for software development.

### Find newer research from an older list

Choose one useful entry and note its title, year, authors and keywords. Find it in ACM or arXiv, then search those keywords again over a more recent date range. Follow its references for foundations and, where available, the papers that cite it for later work.

### Follow an X account

[ComputerPapers on X](https://x.com/ComputerPapers) regularly flags new computer science papers.

## 7. Checklist before you contribute {#verifications}

- [ ] I can explain the paper's problem and main contribution.
- [ ] I have read the original paper, not just a post or a summary.
- [ ] I have checked key results, comparisons and limitations.
- [ ] I have saved the paper title and an accessible link.

Ready? Write your [research summary](/guides/research-summary) or prepare your [WeekPaper presentation](/guides/weekpaper).
