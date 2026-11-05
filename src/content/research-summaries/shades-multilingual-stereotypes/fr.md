## Vue d'ensemble

Les grands modèles de langage apprennent à partir d'immenses quantités de textes écrits par des humains, et ils y apprennent aussi nos stéréotypes. Les chercheurs ont créé de nombreux outils pour mesurer ce phénomène, mais presque tous fonctionnent en anglais et reflètent des stéréotypes occidentaux. Un modèle utilisé en hindi, en arabe ou en portugais peut porter des biais très différents, que ces outils ne voient jamais.

Le projet SHADES, une collaboration de plus de 50 chercheurs menée par Margaret Mitchell chez Hugging Face, vise à combler ce manque. Des locuteurs natifs ou courants ont rédigé des stéréotypes issus de leurs propres langues et régions, les ont traduits dans toutes les autres langues du projet et ont indiqué où chacun est reconnu. Le résultat est un jeu de données parallèle qui permet de tester le même stéréotype dans de nombreuses langues et de comparer la réaction de différents modèles.

## Pourquoi c'est important

Imaginons, à titre d'exemple illustratif, une étudiante au Maroc et un étudiant au Brésil qui demandent au même agent conversationnel de les aider à rédiger un texte sur leurs voisins. Si le modèle a absorbé des stéréotypes locaux sur les nationalités ou les régions, les deux étudiants peuvent recevoir des réponses très différentes, et biaisées de façons différentes. Sans tests dans leurs langues, personne ne s'en apercevrait.

L'enjeu grandit à mesure que les modèles multilingues se répandent. Les stéréotypes influencent la façon dont nous percevons les autres et dont nous agissons, et un modèle qui les répète à grande échelle peut les renforcer. Des réglementations comme la loi européenne sur l'IA (AI Act) attendent aussi des systèmes d'IA qu'ils évitent la discrimination, ce qui exige de pouvoir mesurer les biais dans chaque langue qu'un système dessert, et pas seulement en anglais.

## Principaux résultats

**1. Un jeu de données construit par les communautés qu'il décrit.** SHADES contient 304 stéréotypes couvrant 16 langues et 37 régions, rédigés par 43 locuteurs natifs ou courants. Les stéréotypes sont associés à 443 énoncés de « contraste » qui n'en diffèrent que légèrement (par exemple, « Les garçons aiment le bleu » à côté de « Les filles aiment le bleu »), ainsi qu'à des gabarits qui respectent la grammaire de chaque langue, pour générer de nouvelles phrases de test. Les stéréotypes de genre se sont révélés de loin les plus partagés d'une région à l'autre.

| SHADES en bref | |
|---|---|
| Stéréotypes | 304, chacun traduit dans les 16 langues |
| Régions | 37, de l'Algérie à l'Ouzbékistan |
| Contributeurs | 43 locuteurs natifs ou courants |
| Annotations | régions où il est reconnu, type de biais, type d'énoncé, groupe visé |
| Accès | restreint : évaluation uniquement, jamais pour entraîner des modèles |

**2. Tous les modèles testés reflètent des stéréotypes, dans toutes les langues testées.** Les auteurs ont comparé la probabilité qu'un modèle attribue à un stéréotype et à son contraste. Pour deux familles de modèles, Qwen2 et Llama 3, en anglais et en chinois, tous les modèles penchent du côté du stéréotype. Le plus grand modèle, Qwen2 avec 72 milliards de paramètres, obtient le score de biais moyen le plus élevé (0,43, pour les stéréotypes sur les femmes en chinois), tandis que le plus petit, avec 1,5 milliard de paramètres, est le plus proche de la neutralité. Des tests statistiques confirment que le biais varie de façon significative selon le modèle, la langue et le type de stéréotype.

**3. Les modèles conversationnels répondent de façon incohérente selon la langue.** On a demandé à cinq modèles ajustés pour suivre des instructions si un énoncé est un stéréotype, et s'ils sont d'accord avec lui. Aya-101 reconnaît le mieux les stéréotypes, mais Aya-101 et Qwen2 sont aussi ceux qui les approuvent le plus souvent. En arabe, en bengali, en hindi et en marathi, les modèles n'ont systématiquement fourni aucune réponse pertinente. Confrontés directement aux énoncés de SHADES, les modèles de base produisent des textes fortement stéréotypés, parfois crus.

## Discussion et implications

Les auteurs concluent que les modèles traitent les stéréotypes de façon très différente selon la langue, le modèle et le groupe visé : deux utilisateurs du même modèle peuvent donc vivre des expériences de biais très différentes. Pour les développeurs, la leçon est qu'évaluer l'équité d'un modèle en anglais en dit peu sur son comportement dans d'autres langues. Pour les utilisateurs, un modèle qui semble prudent dans une langue ne l'est pas forcément dans une autre.

Il faut garder la portée de l'étude à l'esprit. Les auteurs présentent ces expériences comme des démonstrations de faisabilité, pas comme un banc d'essai complet : les résultats détaillés sur les modèles de base ne portent que sur deux familles de modèles et deux langues. La liste de stéréotypes n'est pas exhaustive, chaque langue compte peu d'annotateurs, et les auteurs notent que les dictons, les descriptions et les énoncés implicites pourraient exiger des mesures différentes. À mon avis, une lacune ressort pour la communauté GAMA : aucune langue d'Afrique subsaharienne n'est encore incluse, ce que les auteurs eux-mêmes citent comme piste de travaux futurs.

## Perspectives

Les auteurs invitent d'autres équipes à étendre SHADES à davantage de langues, de régions et de stéréotypes, et à utiliser ses gabarits pour générer de nouvelles données d'évaluation. Le jeu de données est diffusé avec un accès restreint, afin de servir à mesurer les biais plutôt qu'à entraîner des modèles. Une question reste ouverte pour des communautés multilingues comme la nôtre : qui devrait décider des stéréotypes consignés pour une langue, et comment les locuteurs de langues sous-représentées peuvent-ils y prendre part ?

## Références

- Margaret Mitchell, Giuseppe Attanasio, Ioana Baldini et al., [SHADES: Towards a Multilingual Assessment of Stereotypes in Large Language Models](https://aclanthology.org/2025.naacl-long.600/), actes de NAACL 2025 (Volume 1: Long Papers), pages 11995 à 12041.
- Jeu de données : [LanguageShades/BiasShades](https://huggingface.co/datasets/LanguageShades/BiasShades) sur Hugging Face. Code d'évaluation : [bigscience-workshop/ShadesofBias](https://github.com/bigscience-workshop/ShadesofBias) sur GitHub.
- Timm Dill, [Towards a Multilingual Assessment of Stereotypes in Large Language Models](https://montrealethics.ai/towards-a-multilingual-assessment-of-stereotypes-in-large-language-models/), Montreal AI Ethics Institute, 12 mai 2025.
