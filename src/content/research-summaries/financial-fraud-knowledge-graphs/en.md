## Overview

Most companies check payments one at a time. A rules engine asks simple questions: is this invoice under the approval threshold, is the vendor on the approved list, is the amount normal? In a hands-on guide published on freeCodeCamp, Kamal Kishore argues that this approach misses a whole family of fraud schemes, because the warning sign is not in any single payment. It is in the way payments, vendors and bank accounts connect to one another.

The guide shows how to model accounts payable data (vendors, invoices, payments, bank accounts, employees) as a knowledge graph in the Neo4j graph database, then detect five fraud patterns with short queries written in Cypher, Neo4j's query language. It is a tutorial rather than a research paper: its value lies in a complete, runnable prototype, with a synthetic dataset and the code published on GitHub, so anyone can reproduce the results.

## Why it matters

The guide opens with three invoices from three suppliers: Alpha Corp, Beta LLC and Gamma Inc. Each amount is ordinary, each supplier is approved, the dates make sense. Checked one by one, all three pass. Drawn as a network, they tell another story: all three are paid into the same bank account. That convergence is a classic sign of a "money mule" scheme, where shell companies funnel money to a single destination.

Schemes like this are built to look normal one transaction at a time, for example an invoice of $4,800 placed just under a $5,000 dual sign-off threshold. Finding them in a traditional relational database means joining many tables, which, the author notes, gets slow as tables grow to millions of rows. A graph stores the connections themselves, so following them is the natural operation. For any organization that pays suppliers, from a university to a small business, this is the difference between seeing transactions and seeing relationships.

## Key findings

**1. Design the graph around the questions you will ask.** Some connections are expensive to discover at query time, so the guide computes them once, while loading the data. Vendors paid into the same bank account are linked by a `SHARED_ACCOUNT_WITH` relationship, vendors in the same city by `SHARED_LOCATION`, and vendors whose bank routing numbers start with the same three digits by `SHARED_ROUTING_PREFIX`. A search that would need four hops through the data becomes a single hop.

**2. Five patterns, five short queries.** Each fraud pattern becomes one query that looks for a specific shape in the network. The prototype was tested on a synthetic dataset (100 vendors, 220 invoices, 331 payments) into which known fraud cases had been deliberately planted:

| Pattern | What the query looks for | Planted | Found |
|---|---|---|---|
| Duplicate invoices | Same vendor, same amount, a few days apart (14 in the example) | 12 pairs | 12 |
| Circular rings | Three vendors that all share bank accounts, forming a triangle | 1 | 1 |
| Money mule network | One account paid by many vendors (10 or more: likely mule) | 1 ring of 25 vendors | 1 |
| Vendor collusion | Vendors with several suspicious links at once | 1 cluster of 4 vendors | 89 vendors flagged |
| Out-of-jurisdiction approvals | An employee approving a payment outside their department's authority | 3 | 3 |

**3. A graph complements rules, it does not replace them.** For production, the guide suggests two stages: fast, simple graph checks while a payment is being processed, then a slower scoring step that feeds network measures, such as how central a vendor is, into a machine learning model. Cases confirmed by analysts are written back into the graph, so the system improves over time.

## Discussion and implications

The main lesson reaches beyond fraud: when a problem is about relationships, store and query the relationships directly. For students, the guide is also a good model of a reproducible tutorial: a clear problem, a data model, runnable code and a validation step that compares results with a known answer key.

Readers should keep the scope in mind. All the data is synthetic and the prototype holds hundreds of records, not millions. The perfect scores in the table only show that the queries found the patterns the author planted; the guide does not measure false alarms on real payments. The collusion query is the clearest example: it flagged 89 vendors for a planted cluster of 4, and the guide reports no figure on how many are real cases. In our reading, this query would need careful tuning before it is useful. The guide also warns about "supernodes": legitimate entities, like a utility or a landlord, that receive payments from almost everyone and can look suspicious. Finally, as a practitioner's guide, it has not gone through peer review.

## Moving forward

The natural next step is to run these queries on real accounts payable data, measure false positives, and tune the thresholds with analyst feedback, as the guide recommends. The machine learning stage is described but not built, which leaves room for a follow-up project. One question stays open: once fraudsters know the network is being watched, how will they change the shape of their schemes?

## References

- Kamal Kishore, [How to Detect Financial Fraud Patterns with Knowledge Graphs: A Production Guide](https://www.freecodecamp.org/news/how-to-detect-financial-fraud-patterns-with-knowledge-graphs-a-production-guide/), freeCodeCamp, October 30, 2026.
- Companion code: [kamalct/fraud-detection-knowledge-graphs](https://github.com/kamalct/fraud-detection-knowledge-graphs) on GitHub.
