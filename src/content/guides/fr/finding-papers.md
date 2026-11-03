---
title: Trouver des articles scientifiques
description: Guide pratique pour trouver un article en informatique dans ACM Digital Library et arXiv : requêtes booléennes, exemples par domaine, collections et vérifications.
lead: Un guide pratique pour ACM Digital Library et arXiv. Utilisez-le pour trouver un article à résumer, préparer une présentation WeekPaper ou commencer à explorer la littérature scientifique. Aucun outil de recherche payant n'est nécessaire.
---

## Avant de commencer {#intro}

Ce guide s'adresse aux étudiants et aux contributeurs de la communauté GAMA. Les exemples portent sur le génie logiciel, l'infonuagique et le MLOps, la cybersécurité ainsi que l'IA responsable et digne de confiance.

[ACM Digital Library](https://dl.acm.org/) et [arXiv](https://arxiv.org/search/cs) sont les deux bibliothèques scientifiques présentées ici. Des listes GitHub et un compte X offrent des pistes supplémentaires.

## 1. Construire une recherche ciblée {#requete}

Commencez par une question, par exemple « Comment les grands modèles de langage peuvent-ils générer des tests unitaires ? ». Identifiez deux concepts principaux, trouvez des termes équivalents et combinez-les. **Effectuez vos recherches en anglais**, même si vous prévoyez de présenter l'article en français.

| Outil | Objectif | Exemple |
|---|---|---|
| AND | Exiger les deux concepts | `unit test generation AND large language models` |
| OR | Inclure des termes équivalents | `unit testing OR test generation` |
| NOT | Exclure un terme avec prudence | `software testing NOT hardware testing` |
| Guillemets | Rechercher une expression exacte | `"automated program repair"` |
| Parenthèses | Regrouper les termes équivalents (ACM) | `(unit testing OR test generation) AND large language models` |

Écrivez les opérateurs booléens en majuscules et utilisez des guillemets droits.

### Élargir ou préciser la recherche

**Trop peu de résultats :** retirez un concept, raccourcissez une expression exacte ou essayez des synonymes. **Trop de résultats :** ajoutez une tâche ou un langage précis, recherchez dans les titres ou les résumés, ou appliquez un filtre de date.

Utilisez NOT avec prudence, car cet opérateur peut éliminer des études pertinentes. Ajouter `survey` à la requête aide à trouver un état de l'art.

## 2. Chercher dans ACM Digital Library {#acm}

[ACM Digital Library](https://dl.acm.org/) propose des revues et des actes de conférences en informatique. Sa transition vers un accès entièrement ouvert a débuté en janvier 2026. L'ACM Guide to Computing Literature indexe aussi les publications d'autres éditeurs : un article externe indexé n'est donc pas toujours accessible en texte intégral par l'intermédiaire d'ACM.

1. Ouvrez [ACM Digital Library](https://dl.acm.org/).
2. Lancez votre requête.
3. Ajustez les filtres (date de publication, auteurs, revues).
4. Ouvrez les articles prometteurs, lisez leurs résumés et consultez le texte intégral au format PDF ou HTML.

### Exemple : la génération de tests unitaires

Question : comment les grands modèles de langage sont-ils utilisés pour générer des tests unitaires ? Commencez par :

```
unit test generation AND large language models
```

Si cette recherche est trop restrictive, utilisez des parenthèses pour inclure des formulations équivalentes :

```
(unit test generation OR unit testing) AND (large language models OR LLM)
```

Comparez les résultats avant d'appliquer un filtre de dates récentes. Les articles plus anciens fournissent souvent des bases importantes ; les plus récents présentent de nouvelles méthodes et évaluations. Un résultat de recherche est un article à examiner, pas une preuve que l'étude répond à votre question.

![Page de résultats ACM Digital Library pour la requête sur la génération de tests unitaires](/guides/acm-search.png "Résultats ACM pour la requête ci-dessus. Les filtres sont dans la colonne de gauche (encadré rouge) ; l'icône PDF (flèche) ouvre le texte intégral.")

## 3. Chercher dans arXiv {#arxiv}

[arXiv](https://arxiv.org/search/cs) donne gratuitement accès à des manuscrits, notamment des prépublications et des versions d'auteur d'articles publiés. **arXiv ne soumet pas les dépôts à une évaluation par les pairs.**

1. Ouvrez la [recherche arXiv en informatique](https://arxiv.org/search/cs).
2. Lancez votre requête.
3. Choisissez le champ de recherche (titre, résumé ou tous les champs) et l'ordre de tri.
4. Ouvrez les articles prometteurs, lisez leurs résumés et consultez le texte intégral au format PDF ou HTML.

![Page de résultats arXiv pour la même requête](/guides/arxiv-search.png "Résultats arXiv pour la même requête. Le menu « All fields » (encadré rouge) limite la recherche au titre ou au résumé ; le lien [pdf] (flèche) ouvre l'article.")

## 4. Sélectionner et noter un article {#selection}

Lisez le titre et le résumé, puis parcourez l'introduction, les principaux résultats et les limites. Pouvez-vous expliquer le problème et la contribution ? Vérifiez sur quelles données, quels systèmes ou quels participants reposent les conclusions. Choisissez un article abordable dont vous pourrez discuter les résultats avec précision.

Notez le titre de l'article, les noms des auteurs, l'année, un lien accessible et une phrase expliquant votre choix.

> Si l'accès échoue, recherchez le titre exact dans l'autre bibliothèque. Si l'article reste inaccessible, [écrivez-nous](mailto:contact@gamainstitute.ca) en précisant son titre et son lien : nous vous aiderons à trouver une version accessible ou un autre article adapté.

## 5. Exemples de requêtes par domaine {#exemples}

Ces expressions sont des points de départ ; elles ne garantissent pas un ensemble précis de résultats. Utilisez-les telles quelles dans la recherche booléenne d'ACM. Dans arXiv, combinez les termes avec la recherche avancée.

### Génie logiciel

```
unit test generation AND large language models
automated program repair AND test generation
code generation AND software quality
requirements engineering AND traceability
code review AND defect detection
```

### Infonuagique et MLOps

```
infrastructure as code AND large language models
MLOps AND monitoring
cloud computing AND resource allocation
```

### Cybersécurité

```
prompt injection AND large language models
vulnerability detection AND deep learning
software supply chain AND security
```

### IA responsable et digne de confiance

```
machine learning AND fairness
AI governance AND software engineering
large language models AND cultural bias
```

## 6. Partir de collections existantes {#collections}

Les listes de lecture GitHub aident à découvrir la terminologie, à repérer des articles fondateurs et à trouver du code ou des jeux de données. Leur couverture et leur entretien varient : certaines références peuvent être anciennes et certains liens ne plus fonctionner. Ce ne sont ni des revues de littérature complètes ni des listes forcément à jour.

- **[Génie logiciel pour l'IA et l'apprentissage automatique](https://github.com/ckaestne/seaibib)** : bibliographie annotée. Commencez ici pour comprendre comment le génie logiciel s'applique aux systèmes comportant des composants d'IA.
- **[Awesome Software Engineering for Machine Learning](https://github.com/SE-ML/awesome-seml)** : pratiques de développement, tests, qualité, déploiement et exploitation, avec des publications scientifiques et des ressources pour praticiens.
- **[Awesome MLOps](https://github.com/visenger/awesome-mlops)** : l'exploitation des systèmes d'apprentissage automatique, avec une collection d'articles scientifiques. Distinguez-les des outils, conférences et tutoriels.
- **[Awesome LLM Security](https://github.com/corca-ai/awesome-llm-security)** : articles, bancs d'essai et outils sur les attaques et les défenses des LLM. Suivez les liens vers les articles originaux pour vérifier les affirmations.
- **[Awesome Responsible AI](https://github.com/AthenaCore/AwesomeResponsibleAI)** : travaux et ressources sur l'IA responsable et digne de confiance. Distinguez les résultats scientifiques des rapports et recommandations.
- **[Awesome LLM as a Judge](https://github.com/llm-as-a-judge/Awesome-LLM-as-a-judge)** : l'utilisation des LLM pour évaluer des contenus générés par l'IA, et les défis de fiabilité, de biais et de correction du code.
- **[Awesome Machine Learning for Software Engineering](https://github.com/saltudelft/ml4se)** : articles, thèses, jeux de données et outils sur l'apprentissage automatique appliqué au génie logiciel (génération, complétion, résumé et modification de code).
- **[Awesome LLM for Software Engineering](https://github.com/iSEngLab/AwesomeLLM4SE)** : les travaux d'un état de l'art sur les LLM pour le génie logiciel, organisés par tâche.
- **[Awesome Agent for Software Engineering](https://github.com/DeepSoftwareAnalytics/Awesome-Agent4SE)** : les agents fondés sur les LLM pour le développement logiciel.

### Trouver des travaux récents à partir d'une liste ancienne

Choisissez une référence pertinente et notez son titre, son année, ses auteurs et ses mots-clés. Retrouvez-la dans ACM ou arXiv, puis relancez la recherche avec ces mots-clés sur une période plus récente. Consultez ses références pour les travaux fondateurs et, lorsque c'est possible, les articles qui la citent pour les travaux ultérieurs.

### Suivre un compte X

[ComputerPapers sur X](https://x.com/ComputerPapers) signale régulièrement de nouveaux articles en informatique.

## 7. Vérifications avant de contribuer {#verifications}

- [ ] Je peux expliquer le problème étudié et la principale contribution de l'article.
- [ ] J'ai lu l'article original, pas seulement une publication sur les réseaux sociaux ou un résumé.
- [ ] J'ai vérifié les principaux résultats, les comparaisons et les limites.
- [ ] J'ai noté le titre de l'article et un lien accessible.

Prêt·e ? Rédigez votre [résumé de recherche](/guides/research-summary) ou préparez votre [présentation WeekPaper](/guides/weekpaper).
