## Vue d'ensemble

Les chercheurs en génie logiciel prédisent depuis longtemps que l'IA passera de l'autocomplétion à de véritables coéquipiers capables de prendre en charge des tâches entières. Dans cet article, Hao Li, Haoxiang Zhang et Ahmed E. Hassan, de l'Université Queen's, montrent que ce virage a déjà commencé, et ils le mesurent. Ils présentent AIDev, un jeu de données public de 456 535 pull requests ouvertes sur GitHub par cinq agents de codage autonomes : OpenAI Codex, Devin, GitHub Copilot, Cursor et Claude Code. Ces pull requests couvrent 61 453 dépôts et 47 303 développeurs, avec des données recueillies jusqu'au 22 juin 2025.

L'ampleur seule frappe : OpenAI Codex a ouvert plus de 400 000 pull requests moins de deux mois après sa sortie. Pour étudier la qualité et pas seulement le volume, les auteurs se concentrent sur 7 122 pull requests d'agents provenant de 856 dépôts populaires (500 étoiles ou plus), qu'ils comparent à environ 6 600 pull requests écrites par des humains dans les mêmes dépôts en 2025.

## Pourquoi c'est important

L'essentiel de ce que l'on sait des agents de codage vient de bancs d'essai comme SWE-bench, où les meilleurs systèmes résolvent maintenant plus de 70 % des tâches sélectionnées. Un banc d'essai vérifie qu'un correctif passe les tests. Un vrai projet exige davantage : la modification respecte-t-elle le style du code, l'architecture et les attentes des mainteneurs ? AIDev s'intéresse à cette seconde question, à travers la décision qui compte le plus en logiciel libre : la pull request est-elle fusionnée ?

Pour toute équipe qui adopte ces outils, d'une jeune entreprise à un laboratoire de recherche, les résultats répondent à des questions concrètes : quelles tâches confier à un agent, quel effort de revue prévoir, et comment savoir qui a écrit quoi.

## Principaux résultats

**1. Les agents sont utilisés comme des développeurs, mais leur travail est moins souvent accepté.** Plus de 55 % des pull requests d'agents portent sur de nouvelles fonctionnalités ou des corrections de bogues, une répartition proche de celle des humains. Pourtant, chaque agent a un taux d'acceptation inférieur à celui des humains, avec les plus grands écarts sur les fonctionnalités, les corrections et l'optimisation des performances. Les auteurs voient dans cet écart entre les scores des bancs d'essai et les fusions réelles le signe que les évaluations actuelles passent à côté de ce qui compte pour les relecteurs. La documentation fait exception : OpenAI Codex (88,6 %) et Claude Code (85,7 %) dépassent la référence humaine (76,5 %) sur les pull requests de documentation.

| Auteur de la pull request | Pull requests étudiées | Fusionnées | Délai médian avant fusion |
|---|---|---|---|
| Humains | environ 6 600 | 76,8 % | 3,9 h |
| OpenAI Codex | 2 686 | 65,3 % | 0,3 h |
| Claude Code | 101 | 52,5 % | 6,9 h |
| Cursor | 144 | 51,4 % | 2,4 h |
| Devin | 2 729 | 48,9 % | 2,2 h |
| GitHub Copilot | 1 462 | 38,2 % | 17,2 h |

**2. La revue est rapide, peut-être trop.** Les pull requests acceptées d'OpenAI Codex sont fermées en 18 minutes en médiane, environ dix fois plus vite que celles des humains. La plupart des pull requests, humaines (75,3 %) comme issues d'agents (58,2 %), ne montrent aucune revue formelle. Les robots relecteurs apparaissent deux fois plus souvent sur les pull requests d'agents (20,1 % contre 10,0 %), et ils viennent souvent du même fournisseur que l'agent : un robot de Copilot rédige 91 % des revues automatisées des pull requests de Copilot. Les auteurs avertissent que ces boucles fermées risquent de partager les mêmes angles morts.

**3. Plus de production, des changements plus simples, une paternité floue.** Dans un projet, un seul développeur a ouvert 164 pull requests avec Codex entre le 30 mai et le 3 juin 2025, presque autant que les 176 pull requests écrites par des humains au cours des trois ans et demi précédents. Seulement 9,1 % de ces changements d'agent modifiaient la complexité du code, contre 23,3 % pour les changements humains. L'attribution varie aussi : Devin, Copilot et Cursor signent leur travail, Claude Code ajoute une ligne de coauteur que l'on peut désactiver, et OpenAI Codex ne laisse aucune trace. Les auteurs soutiennent qu'identifier clairement le code écrit par l'IA devrait être une exigence de base.

## Discussion et implications

Le message principal de l'article est que la bonne question n'est plus « l'IA peut-elle générer du code ? » mais « le code écrit par l'IA améliore-t-il de vrais projets ? ». Les auteurs tirent de leurs résultats neuf pistes de recherche, dont des bancs d'essai construits à partir de flux de travail réels, l'étude des pull requests rejetées pour comprendre comment les agents échouent, et des systèmes de tri qui envoient les changements risqués aux relecteurs expérimentés.

Certaines limites sont à garder à l'esprit. Les pull requests d'agents sont repérées grâce à des signaux visibles, comme les noms de branches et les lignes de coauteur ; les agents utilisés localement, comme Cursor et Claude Code, sont donc sûrement sous-représentés, ce que notent les auteurs. Les données couvrent les premières semaines après plusieurs lancements, les catégories de tâches ont été étiquetées par un LLM, et le résultat sur la complexité provient d'un seul projet et d'un seul développeur. Les pull requests d'agents et d'humains viennent des mêmes dépôts mais pas des mêmes tâches : les taux d'acceptation ne sont donc pas une comparaison stricte. L'article est une prépublication arXiv soumise à une revue de l'ACM. À mon avis, le résultat 2 est le plus important pour les praticiens : si la revue ne suit pas le rythme des agents, la qualité dépend du soin avec lequel les humains lisent encore le code.

## Perspectives

AIDev est diffusé librement avec son schéma et des carnets d'exemples, ce qui en fait une ressource prête à l'emploi pour des projets étudiants et des mémoires en génie logiciel empirique. Les prochaines étapes naturelles : suivre dans le temps les défauts du code d'agent fusionné et mesurer l'effort réel de revue. Une question reste ouverte : si les équipes commencent à fusionner du travail d'agent qu'elles ne lisent plus attentivement, qui est responsable quand il casse ?

## Références

- Hao Li, Haoxiang Zhang et Ahmed E. Hassan, [The Rise of AI Teammates in Software Engineering (SE) 3.0: How Autonomous Coding Agents Are Reshaping Software Engineering](https://arxiv.org/abs/2507.15003), arXiv:2507.15003, juillet 2025.
- Jeu de données et code : [SAILResearch/AI_Teammates_in_SE3](https://github.com/SAILResearch/AI_Teammates_in_SE3) sur GitHub.
- Article de vision associé : Ahmed E. Hassan et al., [Towards AI-Native Software Engineering (SE 3.0): A Vision and a Challenge Roadmap](https://arxiv.org/abs/2410.06107), arXiv:2410.06107.
