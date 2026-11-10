## Vue d'ensemble

Imaginez que vous décriviez une application à créer et qu'un système d'IA planifie la solution, écrive le code, corrige les problèmes et vous propose le travail terminé pour approbation.

C'est l'avenir qu'envisage le **génie logiciel 3.0 (SE 3.0)**, où l'IA ne se contente plus d'assister les développeurs : elle devient un coéquipier actif du développement logiciel.

Dans le premier article, Hassan et ses collègues décrivent comment cette transformation pourrait changer le génie logiciel. Dans le second, Li et ses collègues examinent si elle a déjà commencé. Ils analysent **plus de 456 000 pull requests** créées par des agents de codage autonomes dans de vrais projets GitHub.

Ensemble, les deux articles abordent deux questions : **comment les humains et l'IA pourraient-ils développer des logiciels ensemble demain ? Et que nous apprend leur collaboration aujourd'hui ?**

## Pourquoi c'est important

Jusqu'à récemment, les développeurs écrivaient eux-mêmes l'essentiel du code. Les assistants d'IA sont ensuite apparus pour suggérer du code, expliquer des erreurs et aider à écrire des tests.

Aujourd'hui, des agents de codage autonomes peuvent prendre en charge des tâches plus larges. Par exemple, un développeur décrit un bogue, et un agent peut examiner le projet, modifier plusieurs fichiers, exécuter les tests et proposer une correction.

Le développement logiciel pourrait ainsi devenir plus rapide et plus accessible. Mais cela soulève aussi des questions importantes : **qui vérifie le travail de l'IA ? Qui est responsable en cas de problème ? Et comment former les ingénieurs logiciels de demain ?**

Ces questions comptent, car produire du code n'est qu'une partie de la construction d'un logiciel fiable.

## Principaux résultats et idées

### Des assistants de codage aux coéquipiers IA

Le premier article décrit trois étapes du génie logiciel.

**SE 1.0, un développement mené par l'humain :** les développeurs écrivent, testent et maintiennent le logiciel avec des outils traditionnels.

**SE 2.0, un développement assisté par l'IA :** l'IA aide les développeurs à générer du code, à expliquer des problèmes et à accomplir des tâches ponctuelles.

**SE 3.0, un développement natif de l'IA :** les humains décrivent ce qu'ils veulent accomplir, et des coéquipiers IA aident à planifier, implémenter, tester et améliorer la solution.

![Trois panneaux reliés par des flèches. SE 1.0, mené par l'humain : les développeurs écrivent, testent et maintiennent le code. SE 2.0, assisté par l'IA : l'IA suggère du code et assiste les développeurs. SE 3.0, vision native de l'IA : les humains définissent les objectifs, des coéquipiers IA aident à construire les solutions.](/research-summaries/figures/se-1-2-3.webp "**Figure 1.** Du codage mené par l'humain au génie logiciel natif de l'IA : l'évolution des rôles des développeurs et de l'IA."){1662x427}

Le changement essentiel consiste à passer de dire à l'IA **quel code écrire** à lui expliquer **quel problème résoudre**.

Le SE 3.0 est une vision proposée, pas une norme déjà établie dans l'industrie. Son succès dépendra de systèmes d'IA fiables, adaptables et capables d'une véritable collaboration avec les humains.

### Les agents d'IA contribuent déjà à de vrais projets

Le second article présente **AIDev**, un jeu de données qui documente la façon dont les agents de codage autonomes contribuent à des projets open source.

Les chercheurs ont recueilli :

- **456 535 pull requests** créées par des agents d'IA ;
- **61 453 dépôts GitHub** contenant ces contributions ;
- des contributions impliquant environ **47 000 développeurs** ;
- l'activité de cinq grands systèmes d'agents de codage : OpenAI Codex, Devin, GitHub Copilot, Cursor et Claude Code.

![Trois chiffres : 456 535 pull requests rédigées par l'IA, des contributions de code créées par des agents de codage autonomes ; 61 453 dépôts GitHub, des projets open source avec des contributions d'agents ; environ 47 000 développeurs impliqués, qui ont créé, révisé ou intégré des pull requests d'agents.](/research-summaries/figures/aidev-scale.webp "**Figure 2.** L'ampleur des contributions des agents de codage autonomes observée dans l'étude AIDev."){1672x387}

Une _pull request_ est une proposition d'ajout ou de modification de code dans un projet logiciel. D'autres contributeurs peuvent examiner les changements proposés avant de les accepter.

Le jeu de données montre que les agents d'IA participent déjà à des activités comme la correction de bogues, le développement de fonctionnalités, la mise à jour de la documentation et la maintenance des logiciels.

**Le message clé :** les coéquipiers IA ne sont plus une simple vision de recherche. Ils participent déjà à de vrais processus de développement logiciel.

### Aller plus vite ne garantit pas un meilleur logiciel

Les chercheurs mettent en avant plusieurs observations, résumées dans le tableau 1.

**Tableau 1.** Ce que les résultats signifient vraiment

| Observation | Ce que cela nous apprend |
|---|---|
| La moitié des PR analysées de GitHub Copilot ont été réalisées en moins de 13 minutes | Les agents peuvent produire des contributions rapidement. |
| Les PR de certains agents ont été acceptées moins souvent que celles des humains | La vitesse ne garantit pas l'acceptation. |
| Un développeur a soumis 164 PR produites par un agent en trois jours | L'IA peut fortement augmenter le volume de soumissions dans certains cas. |
| Les changements générés par les agents tendaient à être structurellement plus simples | Plus de contributions ne veut pas forcément dire un travail plus complexe. |

L'exemple du volume est frappant : ces 164 pull requests assistées par l'IA en trois jours se comparent aux 176 pull requests rédigées à la main par le même développeur au cours des trois années précédentes.

Ces résultats soulignent une distinction importante : **générer davantage de changements de code ne signifie pas automatiquement livrer un logiciel plus utile ou plus fiable.**

## Discussion et implications

Les deux articles suggèrent que les ingénieurs logiciels pourraient se concentrer de plus en plus sur la définition des exigences, la revue des solutions, la vérification de leur exactitude et la supervision de processus menés par l'IA.

À mon avis, cette transformation rend l'assurance qualité logicielle encore plus importante. Si des agents d'IA peuvent générer des changements en quelques minutes, les développeurs et les organisations ont besoin de moyens efficaces pour tester ces changements, comprendre leurs conséquences et établir les responsabilités.

Les données ont toutefois leurs limites. AIDev analyse des contributions observables dans une sélection de dépôts GitHub. L'étude ne prouve pas que les agents d'IA améliorent la productivité globale des équipes, ni que les logiciels qu'ils produisent restent maintenables à long terme. L'exemple frappant d'un seul développeur ne doit pas être interprété comme une hausse générale de la productivité.

## Perspectives

Les recherches futures devraient étudier comment évaluer le code généré par l'IA, améliorer la collaboration entre humains et IA, et s'assurer que les agents autonomes respectent les exigences de qualité, de sécurité et de gouvernance des logiciels.

Le prochain défi n'est pas seulement de construire des agents qui écrivent du code plus vite, mais de développer des **coéquipiers IA dont les décisions et les contributions peuvent être comprises, vérifiées et jugées dignes de confiance par les humains**.

**Une question à méditer :** si les agents d'IA écrivent de plus en plus le code, quelles compétences distingueront les ingénieurs logiciels de demain ?

## Références et dossier de réplication

**Articles de recherche originaux**

1. Hassan, A. E., Oliva, G. A., Lin, D., Chen, B., & Jiang, Z. M. (2024). _Towards AI-Native Software Engineering (SE 3.0): A Vision and a Challenge Roadmap._ [arXiv:2410.06107](https://arxiv.org/abs/2410.06107)
2. Li, H., Zhang, H., & Hassan, A. E. (2025). _The Rise of AI Teammates in Software Engineering (SE) 3.0: How Autonomous Coding Agents Are Reshaping Software Engineering._ [arXiv:2507.15003](https://arxiv.org/abs/2507.15003)

**Jeu de données et ressources de réplication**

- **Jeu de données AIDev et dépôt de réplication :** [SAILResearch/AI_Teammates_in_SE3](https://github.com/SAILResearch/AI_Teammates_in_SE3) sur GitHub.

Le premier article est avant tout une vision et une feuille de route de recherche, et non une étude empirique qui exigerait un dossier de réplication expérimental. Le dépôt AIDev permet d'approfondir les données empiriques du second article.
