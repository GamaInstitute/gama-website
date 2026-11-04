## Overview

Most companies check payments one at a time. A rules engine asks simple questions: is this invoice under the approval threshold, is the vendor on the approved list, is the amount normal? In a guide published on freeCodeCamp, Kamal Kishore argues that this approach misses a whole family of fraud schemes, because the warning sign is not in any single payment. It is in the way payments, vendors and bank accounts connect to one another.

The guide shows how to model accounts payable data (vendors, invoices, payments, bank accounts, employees) as a knowledge graph in the Neo4j graph database, and how to detect five fraud patterns with short queries written in Cypher, Neo4j's query language. It comes with a working prototype and a synthetic dataset that anyone can run.

## Why this matters

Picture three invoices from three different suppliers: Alpha Corp, Beta LLC and Gamma Inc. Each amount is ordinary, each supplier is approved, the dates make sense. Checked one by one, all three pass. Drawn as a network, they tell another story: all three are paid into the same bank account. That convergence is a classic sign of a "money mule" scheme, where shell companies funnel money to a single destination.

Schemes like this are built to look normal one transaction at a time, for example an invoice of $4,800 placed just under a $5,000 dual sign-off threshold. Finding them in a traditional relational database means joining many tables (vendors, invoices, payments, accounts), which, the author notes, gets slow as tables grow to millions of rows. A graph stores the connections themselves, so following them is the natural operation.

## Key findings

**1. Design the graph around the questions you will ask.** Some connections are expensive to discover at query time, so the guide computes them once, while loading the data. Vendors paid into the same bank account are linked by a `SHARED_ACCOUNT_WITH` relationship, vendors in the same city by `SHARED_LOCATION`, and vendors whose bank routing numbers start with the same three digits by `SHARED_ROUTING_PREFIX`. A search that would need four hops through the data becomes a single hop.

**2. Five patterns, five short queries.** Each fraud pattern becomes one query that looks for a specific shape in the network:

| Pattern | What the query looks for |
|---|---|
| Duplicate invoices | Two invoices from the same vendor, for the same amount, a few days apart (14 days in the example) |
| Circular rings | Three vendors that all share bank accounts with one another, forming a triangle |
| Money mule networks | One bank account receiving payments from many different vendors (10 or more is treated as a likely mule) |
| Vendor collusion | Vendors with several suspicious links at once: shared account, shared location, shared routing prefix |
| Out-of-jurisdiction approvals | An employee approving a payment their department is not authorized for |

**3. The prototype finds every planted case.** The test dataset is synthetic: 100 vendors, 220 invoices and 331 payments, with known fraud deliberately injected. The queries found all 12 duplicate invoice pairs, the circular ring, the 25-vendor mule ring and all 3 out-of-jurisdiction approvals. The collusion query flagged 89 vendors as high risk.

## Discussion and implications

The main lesson reaches beyond fraud: when a problem is about relationships, store and query the relationships directly. The guide is careful to present the graph as a complement to rules engines and machine learning, not a replacement. For production, it suggests two stages: fast, simple graph checks while a payment is being processed, then a slower scoring step that feeds network measures, such as how central a vendor is, into a machine learning model. Cases confirmed by analysts are written back into the graph, so the system improves over time.

Readers should keep the scope in mind. All the data is synthetic and the prototype has hundreds of records, not millions. The perfect detection rates only show that the queries found the patterns planted in the data; the guide does not measure how many false alarms they would raise on real payments. For the 89 vendors flagged for collusion, it reports a count but not how many are real cases, which suggests, in our reading, that this query would need tuning before it is useful. The guide also warns about "supernodes": legitimate entities, like a utility or a landlord, that receive payments from almost everyone and could look suspicious.

## What's next

The natural next step is to run these queries on real accounts payable data, measure false positives, and tune the thresholds with analyst feedback, as the guide recommends. The machine learning stage is described but not built. One question stays open: once fraudsters know the network is being watched, how will they change the shape of their schemes?

## References

- Kamal Kishore, [How to Detect Financial Fraud Patterns with Knowledge Graphs: A Production Guide](https://www.freecodecamp.org/news/how-to-detect-financial-fraud-patterns-with-knowledge-graphs-a-production-guide/), freeCodeCamp, October 30, 2026.
- Companion code: [kamalct/fraud-detection-knowledge-graphs](https://github.com/kamalct/fraud-detection-knowledge-graphs) on GitHub.
