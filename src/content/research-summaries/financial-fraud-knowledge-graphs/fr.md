## Vue d'ensemble

La plupart des entreprises vérifient les paiements un par un. Un moteur de règles pose des questions simples : la facture est-elle sous le seuil d'approbation, le fournisseur figure-t-il sur la liste approuvée, le montant est-il normal ? Dans un guide pratique publié sur freeCodeCamp, Kamal Kishore soutient que cette approche laisse passer toute une famille de fraudes, car le signal d'alerte ne se trouve dans aucun paiement en particulier. Il se trouve dans la façon dont les paiements, les fournisseurs et les comptes bancaires sont reliés entre eux.

Le guide montre comment modéliser les données des comptes fournisseurs (fournisseurs, factures, paiements, comptes bancaires, employés) sous forme de graphe de connaissances dans la base de données orientée graphe Neo4j, puis comment détecter cinq schémas de fraude avec de courtes requêtes écrites en Cypher, le langage de requête de Neo4j. Il s'agit d'un tutoriel plutôt que d'un article de recherche : son intérêt tient à un prototype complet et exécutable, avec un jeu de données synthétique et le code publié sur GitHub, pour que chacun puisse reproduire les résultats.

## Pourquoi c'est important

Le guide s'ouvre sur trois factures de trois fournisseurs : Alpha Corp, Beta LLC et Gamma Inc. Chaque montant est ordinaire, chaque fournisseur est approuvé, les dates sont cohérentes. Vérifiées une par une, les trois passent. Dessinées sous forme de réseau, elles racontent une autre histoire : les trois sont versées sur le même compte bancaire. Cette convergence est un signe classique d'un réseau de « mules financières », où des sociétés-écrans acheminent l'argent vers une seule destination.

Ces fraudes sont conçues pour paraître normales, une transaction à la fois : par exemple, une facture de 4 800 $ placée juste sous un seuil de double signature fixé à 5 000 $. Pour les détecter dans une base de données relationnelle classique, il faut joindre de nombreuses tables, ce qui, note l'auteur, devient lent quand les tables atteignent des millions de lignes. Un graphe stocke directement les liens, et les suivre devient l'opération naturelle. Pour toute organisation qui paie des fournisseurs, d'une université à une petite entreprise, c'est la différence entre voir des transactions et voir des relations.

## Principaux résultats

**1. Concevoir le graphe en fonction des questions à poser.** Certains liens coûtent cher à découvrir au moment de la requête ; le guide les calcule donc une seule fois, au chargement des données. Les fournisseurs payés sur le même compte bancaire sont reliés par une relation `SHARED_ACCOUNT_WITH`, ceux situés dans la même ville par `SHARED_LOCATION`, et ceux dont les numéros d'acheminement bancaire commencent par les trois mêmes chiffres par `SHARED_ROUTING_PREFIX`. Une recherche qui demanderait quatre sauts dans les données n'en demande plus qu'un.

**2. Cinq schémas, cinq courtes requêtes.** Chaque schéma de fraude devient une requête qui cherche une forme précise dans le réseau. Le prototype a été testé sur un jeu de données synthétique (100 fournisseurs, 220 factures, 331 paiements) dans lequel des cas de fraude connus avaient été volontairement insérés :

| Schéma | Ce que cherche la requête | Insérés | Trouvés |
|---|---|---|---|
| Factures en double | Même fournisseur, même montant, à quelques jours d'intervalle (14 dans l'exemple) | 12 paires | 12 |
| Boucles circulaires | Trois fournisseurs qui partagent tous des comptes bancaires, formant un triangle | 1 | 1 |
| Réseau de mules | Un compte payé par de nombreux fournisseurs (10 ou plus : mule probable) | 1 réseau de 25 fournisseurs | 1 |
| Collusion entre fournisseurs | Fournisseurs présentant plusieurs liens suspects à la fois | 1 groupe de 4 fournisseurs | 89 fournisseurs signalés |
| Approbations hors compétence | Un employé qui approuve un paiement hors de l'autorité de son service | 3 | 3 |

**3. Le graphe complète les règles, il ne les remplace pas.** En production, le guide propose deux étapes : des vérifications rapides et simples dans le graphe pendant le traitement du paiement, puis une étape de notation plus lente qui fournit des mesures du réseau, comme la centralité d'un fournisseur, à un modèle d'apprentissage automatique. Les cas confirmés par les analystes sont réinscrits dans le graphe, pour que le système s'améliore avec le temps.

## Discussion et implications

La principale leçon dépasse la fraude : quand un problème porte sur des relations, il faut stocker et interroger directement ces relations. Pour les étudiants, le guide est aussi un bon modèle de tutoriel reproductible : un problème clair, un modèle de données, du code exécutable et une étape de validation qui compare les résultats à une réponse connue.

Il faut garder la portée du guide à l'esprit. Toutes les données sont synthétiques et le prototype compte quelques centaines d'enregistrements, pas des millions. Les scores parfaits du tableau montrent seulement que les requêtes retrouvent les cas insérés par l'auteur ; le guide ne mesure pas les fausses alertes sur de vrais paiements. La requête sur la collusion en est l'exemple le plus net : elle signale 89 fournisseurs pour un groupe inséré de 4, sans indiquer combien sont de vrais cas. À notre avis, cette requête demanderait un réglage soigneux avant d'être utile. Le guide met aussi en garde contre les « supernœuds » : des entités légitimes, comme un fournisseur d'électricité ou un propriétaire, qui reçoivent des paiements de presque tout le monde et peuvent paraître suspectes. Enfin, en tant que guide de praticien, il n'a pas été évalué par les pairs.

## Perspectives

L'étape suivante consisterait à exécuter ces requêtes sur de vraies données de comptes fournisseurs, à mesurer les faux positifs et à ajuster les seuils avec l'aide des analystes, comme le recommande le guide. L'étape d'apprentissage automatique est décrite mais pas réalisée, ce qui ouvre la porte à un projet de suite. Une question reste ouverte : quand les fraudeurs sauront que le réseau est surveillé, comment changeront-ils la forme de leurs stratagèmes ?

## Références

- Kamal Kishore, [How to Detect Financial Fraud Patterns with Knowledge Graphs: A Production Guide](https://www.freecodecamp.org/news/how-to-detect-financial-fraud-patterns-with-knowledge-graphs-a-production-guide/), freeCodeCamp, 30 octobre 2026.
- Code associé : [kamalct/fraud-detection-knowledge-graphs](https://github.com/kamalct/fraud-detection-knowledge-graphs) sur GitHub.
