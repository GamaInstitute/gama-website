## Overview

Large language models learn from huge amounts of human-written text, and with it they learn our stereotypes. Researchers have built many tools to measure this, but almost all of them work in English and reflect Western stereotypes. A model used in Hindi, Arabic or Portuguese can carry very different biases that these tools never see.

The SHADES project, a collaboration of more than 50 researchers led by Margaret Mitchell at Hugging Face, set out to fill that gap. Native and fluent speakers wrote down stereotypes from their own languages and regions, translated them into every other language of the project, and recorded where each one is recognized. The result is a parallel dataset that lets researchers test the same stereotype across many languages and compare how different models react to it.

## Why it matters

Imagine, as an illustrative example, a student in Morocco and a student in Brazil asking the same chatbot for help with an essay about their neighbours. If the model has absorbed local stereotypes about nationalities or regions, the two students may receive very different, and differently biased, answers. Without tests in their languages, nobody would notice.

This matters more as multilingual models spread. Stereotypes shape how people see others and how they behave, and a model that repeats them at scale can reinforce them. Regulations such as the European AI Act also expect AI systems to avoid discrimination, which requires ways to measure bias in every language a system serves, not only in English.

## Key findings

**1. A dataset built by the communities it describes.** SHADES contains 304 stereotypes covering 16 languages and 37 regions, written by 43 native and fluent speakers. The stereotypes are paired with 443 minimally different "contrast" statements (for example, "Boys like blue" next to "Girls like blue"), and come with templates that respect each language's grammar, so researchers can generate new test sentences. Gender stereotypes turned out to be by far the most widely shared across regions.

| SHADES at a glance | |
|---|---|
| Stereotypes | 304, each translated into all 16 languages |
| Regions | 37, from Algeria to Uzbekistan |
| Contributors | 43 native or fluent speakers |
| Annotations | regions where it is recognized, type of bias, type of statement, group targeted |
| Access | gated: evaluation only, never for training models |

**2. Every model tested reflects stereotypes, in every language tested.** The authors compared how likely a model finds a stereotype versus its contrast. For two model families, Qwen2 and Llama 3, in English and Chinese, all models scored on the stereotyped side. The largest model, Qwen2 with 72 billion parameters, showed the highest average bias score (0.43, for stereotypes about women in Chinese), while the smallest, with 1.5 billion parameters, came closest to neutral. Statistical tests confirmed that bias varies significantly with the model, the language and the type of stereotype.

**3. Chat models answer inconsistently across languages.** Five instruction-tuned models were asked whether a statement is a stereotype, and whether they agree with it. Aya-101 was best at recognizing stereotypes, but Aya-101 and Qwen2 also agreed with stereotypes most often. In Arabic, Bengali, Hindi and Marathi, the models consistently failed to give meaningful answers at all. When prompted directly with SHADES statements, base models produced strongly stereotyped and sometimes graphic text.

## Discussion and implications

The authors conclude that models handle stereotypes very differently depending on the language, the model and the group targeted, so two users of the same model can have very different experiences of bias. For developers, the lesson is that testing a model's fairness in English says little about its behaviour in other languages. For users, it means a model that seems careful in one language may not be in another.

Readers should keep the scope in mind. The authors present these experiments as proof-of-concept examples, not a full benchmark: the detailed base-model results cover only two model families and two languages. The list of stereotypes is not exhaustive, each language has few annotators, and the authors note that sayings, descriptions and implicit statements may need different measures. In my reading, one gap stands out for GAMA's community: no Sub-Saharan African language is included yet, which the authors themselves list as a direction for future work.

## Moving forward

The authors invite others to extend SHADES to more languages, regions and stereotypes, and to use its templates to generate new evaluation data. The dataset is released with gated access, so it serves to measure bias rather than to train models on it. An open question remains for multilingual communities like ours: who should decide which stereotypes are recorded for a language, and how can speakers of underrepresented languages take part?

## References

- Margaret Mitchell, Giuseppe Attanasio, Ioana Baldini et al., [SHADES: Towards a Multilingual Assessment of Stereotypes in Large Language Models](https://aclanthology.org/2025.naacl-long.600/), Proceedings of NAACL 2025 (Volume 1: Long Papers), pages 11995 to 12041.
- Dataset: [LanguageShades/BiasShades](https://huggingface.co/datasets/LanguageShades/BiasShades) on Hugging Face. Evaluation code: [bigscience-workshop/ShadesofBias](https://github.com/bigscience-workshop/ShadesofBias) on GitHub.
- Timm Dill, [Towards a Multilingual Assessment of Stereotypes in Large Language Models](https://montrealethics.ai/towards-a-multilingual-assessment-of-stereotypes-in-large-language-models/), Montreal AI Ethics Institute, May 12, 2025.
