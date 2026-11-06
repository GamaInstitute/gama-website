## Vue d'ensemble

Les assistants de codage IA actuels aident les développeurs à écrire, tester et déboguer du code plus vite. Ahmed E. Hassan (Université Queen's), Gustavo A. Oliva, Dayi Lin et Boyuan Chen (Huawei Canada) et Zhen Ming (Jack) Jiang (Université York) soutiennent que cela ne suffit pas. Dans cet article de vision, ils décrivent trois ères du génie logiciel. Le SE 1.0 est le génie logiciel classique, centré sur le code et soutenu par des outils. Le SE 2.0 est le génie logiciel assisté par l'IA d'aujourd'hui, où l'IA aide aux tâches traditionnelles mais où le développeur pilote encore chaque étape. Le SE 3.0, l'ère qu'ils appellent de leurs vœux, est natif de l'IA : le développeur exprime ce qu'il veut, le précise au fil d'une conversation avec un coéquipier IA, et l'IA transforme cette intention en logiciel fonctionnel.

L'article n'est pas une expérience mais un programme de recherche. Il décrit la technologie nécessaire au SE 3.0 et une feuille de route des défis à relever, construites à partir de revues de la littérature, d'échanges avec des leaders universitaires et industriels, et des propres prototypes des auteurs.

## Pourquoi c'est important

Les auteurs partent d'une scène familière : un développeur écrit un commentaire pour que l'assistant génère du code, le réécrit pour imposer une bibliothèque précise, lance les tests, découvre une exigence oubliée, l'explique dans le clavardage, compare trois corrections proposées, et recommence. L'IA écrit des morceaux de code, mais l'humain doit encore découper le problème, guider chaque étape et vérifier chaque résultat. Les auteurs parlent de surcharge cognitive.

Ils relèvent deux autres limites du SE 2.0. D'abord, les assistants ont tendance à ajouter du code plutôt qu'à le simplifier, ce qui peut produire des systèmes gonflés et plus difficiles à maintenir ; ils citent une étude où Cursor accélérait le développement à court terme mais augmentait durablement la complexité du code et les avertissements d'analyse statique. Ensuite, à mesure que le code généré par l'IA se répand, il se retrouve dans les données qui entraînent les futurs modèles, une boucle qui risque d'en dégrader la qualité. Pour les étudiants qui apprennent à programmer aujourd'hui, une question se pose directement : quelles compétences compteront encore quand une grande partie du code sera écrite par des machines ?

## Principaux résultats

**1. L'intention remplace le code au cœur du développement.** Dans le SE 3.0, une intention est un résultat souhaité, exprimé sous n'importe quelle forme : une description, du pseudocode, une esquisse d'interface ou des exemples de données. L'IA pose des questions de clarification jusqu'à ce que l'humain et l'IA s'accordent, puis cherche du code qui satisfait l'intention. Le code source est masqué par défaut mais peut toujours être ouvert pour le débogage. Les conversations deviennent elles-mêmes des actifs à versionner et à archiver, puisqu'on peut en régénérer le code quand de meilleurs modèles apparaissent.

**2. Une pile technologique à cinq couches.** Les auteurs décrivent ce que chaque couche doit devenir :

| Couche | Aujourd'hui (SE 2.0) | Vision (SE 3.0) |
|---|---|---|
| Teammate.next | Assistant statique et impersonnel | Coéquipier et mentor personnalisé qui apprend de chaque échange |
| IDE.next | Édition de code | Conversations sur les intentions |
| Compiler.next | Application de règles fixes au code | Recherche parmi de nombreuses solutions candidates, en équilibrant précision, coût et rapidité |
| Runtime.next | Service de modèles isolés | Exécution d'applications d'IA composées selon des objectifs de niveau de service, les requêtes simples allant à de petits modèles locaux |
| FM.next | Modèles entraînés sur des données brutes d'Internet | Modèles plus petits entraînés sur un programme structuré de génie logiciel |

Un principe clé de Compiler.next : les tests sont dérivés des intentions, jamais du code existant, puisque ce code peut ne pas faire ce qu'il devrait.

**3. Six défis concrets, et d'autres questions ouvertes.** La feuille de route demande comment un coéquipier IA peut apprendre à poser ni trop ni trop peu de questions de clarification, comment rendre la synthèse de code efficace, comment accélérer l'environnement d'exécution, comment répartir les requêtes entre grands et petits modèles, comment donner aux modèles une vraie compréhension du génie logiciel au-delà des motifs de code, et comment libérer les développeurs de l'ingénierie des requêtes (prompt engineering). Pour plusieurs de ces défis, les auteurs présentent des prototypes préliminaires, comme un routeur qui envoie 50 % de requêtes en moins aux modèles coûteux tout en conservant environ 90 % de la qualité des réponses.

## Discussion et implications

La force de l'article tient à sa portée : il traite toute la chaîne, de l'entraînement des modèles à l'IDE, comme un seul problème d'ingénierie, et nomme des questions ouvertes qui dépassent largement la technique. Qu'est-ce qu'un bon ingénieur logiciel à l'ère du SE 3.0, et comment les universités doivent-elles adapter leurs programmes ? Si un coéquipier IA personnalisé part avec un développeur, à qui appartient-il ? Comment éviter que le SE 3.0 exclue ceux qui n'ont pas accès à une infrastructure coûteuse ?

Il faut garder à l'esprit la nature de l'article. C'est une vision, et les auteurs reconnaissent que la pile complète ne pourra être validée que lorsque chaque couche aura un prototype. Les preuves avancées viennent surtout des premiers systèmes des auteurs, testés sur des bancs d'essai comme HumanEval-Plus. L'article est une prépublication arXiv, publiée en octobre 2024 et révisée en janvier 2026. À mon avis, masquer le code par défaut est l'idée la plus discutable : l'étude empirique associée, AIDev (arXiv:2507.15003), montre que les pull requests écrites par des agents IA sont encore moins souvent fusionnées que celles des humains, ce qui laisse penser que la revue humaine du code reste essentielle pour l'instant.

## Perspectives

Les auteurs proposent de travailler sur les cinq couches en parallèle et invitent explicitement les points de vue opposés. Pour des communautés comme GAMA, l'appel à concevoir des modèles « petits mais puissants », dotés d'une solide connaissance du génie logiciel, est particulièrement pertinent, car il réduirait le coût de participation. Une question reste ouverte pour les enseignants : si le code devient secondaire, comment apprendre aux étudiants à juger un code qu'ils n'ont pas écrit ?

## Références

- Ahmed E. Hassan, Gustavo A. Oliva, Dayi Lin, Boyuan Chen et Zhen Ming (Jack) Jiang, [Towards AI-Native Software Engineering (SE 3.0): A Vision and a Challenge Roadmap](https://arxiv.org/abs/2410.06107), arXiv:2410.06107, version 2, janvier 2026.
- Étude empirique associée : Hao Li, Haoxiang Zhang et Ahmed E. Hassan, [The Rise of AI Teammates in Software Engineering (SE) 3.0](https://arxiv.org/abs/2507.15003), arXiv:2507.15003, juillet 2025.
