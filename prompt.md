Tu es un développeur senior frontend spécialisé Astro.

Je veux créer la première version d’un site statique pour le domaine `cgp-independant.fr`.

Objectif du site :
Créer un annuaire léger, rapide et SEO-friendly de CGP indépendants.
Les données viennent d’un fichier CSV d’environ 500 lignes.
Le site doit permettre d’afficher les CGP sous forme de listing, de fiches individuelles et plus tard sur une carte.

Stack souhaitée :

* Astro 7
* TypeScript
* Tailwind CSS
* daisyUI
* Données depuis un fichier CSV local
* Pas de React
* Pas de Next.js
* Pas de base de données
* Pas de backend
* Pages statiques générées au build

Objectif technique :
Créer une structure propre, maintenable et très légère.
Le JavaScript côté client doit être minimal.
Le site doit être optimisé pour le SEO et la performance.

Utiliser Astro 7 avec les pratiques actuelles du framework :

* `getStaticPaths` pour les routes dynamiques
* génération statique des pages au build
* pas d’hydratation inutile
* pas de composants React
* pas de JavaScript client sauf nécessité explicite

Structure de pages à créer :

* `/`
  Page d’accueil avec :

  * titre principal : “Trouvez un CGP indépendant près de chez vous”
  * court texte d’introduction
  * champ de recherche visuel non fonctionnel pour le moment
  * liens vers l’annuaire, la carte, les villes et les départements

* `/cgp/`
  Listing complet des CGP depuis le CSV.
  Pour chaque CGP, afficher une card avec :

  * nom affiché
  * cabinet
  * ville
  * département
  * région
  * numéro ORIAS si présent
  * lien vers la fiche détaillée

* `/cgp/[slug]/`
  Fiche individuelle d’un CGP.
  Afficher :

  * nom affiché
  * cabinet
  * ville
  * département
  * région
  * site web si présent
  * email si présent
  * téléphone si présent
  * numéro ORIAS si présent
  * catégories ORIAS si présentes
  * date de dernière vérification ORIAS si présente
  * lien vers le registre officiel ORIAS
  * lien retour vers le listing

  Important :
  Ne pas afficher “vérifié” ou “certifié” sauf si un champ explicite le permet.
  Si un numéro ORIAS est présent, afficher une mention prudente :
  “Informations à vérifier sur le registre officiel ORIAS.”

* `/cgp/carte/`
  Page placeholder pour la carte.
  Ne pas intégrer Leaflet pour le moment.
  Afficher seulement un bloc indiquant que la carte interactive sera ajoutée ensuite.

* `/cgp/par-ville/`
  Page listant toutes les villes présentes dans le CSV.

* `/cgp/par-ville/[city]/`
  Page listant les CGP d’une ville.

* `/cgp/par-departement/`
  Page listant tous les départements présents dans le CSV.

* `/cgp/par-departement/[department]/`
  Page listant les CGP d’un département.

* `/ajouter-un-cgp/`
  Page expliquant comment demander l’ajout ou la modification d’une fiche.

* `/a-propos/`
  Page expliquant le but du site.

* `/contact/`
  Page de contact simple.

* `/mentions-legales/`
  Page placeholder.

* `/politique-confidentialite/`
  Page placeholder.

Structure de fichiers attendue :

```txt
src/
  pages/
    index.astro
    cgp/
      index.astro
      carte.astro
      [slug].astro
      par-ville/
        index.astro
        [city].astro
      par-departement/
        index.astro
        [department].astro
    ajouter-un-cgp.astro
    a-propos.astro
    contact.astro
    mentions-legales.astro
    politique-confidentialite.astro

  components/
    Layout.astro
    Header.astro
    Footer.astro
    CgpCard.astro
    Breadcrumb.astro
    EmptyState.astro

  data/
    cgp.csv

  lib/
    cgp.ts
    slugify.ts

  styles/
    global.css
```

Structure du CSV :

```csv
id,display_name,first_name,last_name,firm_name,legal_name,siren,siret,orias_number,orias_status,orias_categories,orias_last_checked_at,city,postal_code,department_code,department_name,region,address,latitude,longitude,website,email,phone,linkedin,slug,is_published,source_url,notes
```

Créer un fichier `src/data/cgp.csv` avec 5 lignes de données fictives pour tester.

Exemple de données fictives :

* Jean Dupont, Dupont Patrimoine, Paris
* Claire Martin, Martin Conseil Patrimoine, Lyon
* Thomas Bernard, Bernard Gestion Privée, Bordeaux
* Sophie Laurent, Laurent Patrimoine, Nantes
* Marc Petit, Petit Conseil, Lille

Exemple de ligne CSV fictive :

```csv
1,Jean Dupont,Jean,Dupont,Dupont Patrimoine,DUPONT PATRIMOINE SAS,123456789,12345678900012,07012345,active,CIF;COA,2026-07-07,Paris,75008,75,Paris,Île-de-France,"10 rue de la Paix",48.8686,2.3305,https://dupont-patrimoine.fr,contact@dupont-patrimoine.fr,0102030405,,jean-dupont-paris,true,https://www.orias.fr/,Donnée fictive
```

Contraintes sur les données :

* `id` doit être stable.
* `slug` doit être utilisé pour générer l’URL de la fiche.
* Si le champ `slug` est vide, générer automatiquement un slug à partir du nom et de la ville.
* `is_published` permet de masquer une fiche.
* Ne pas afficher les fiches avec `is_published=false`.
* `orias_number` est optionnel mais doit être affiché s’il est présent.
* `orias_status`, `orias_categories` et `orias_last_checked_at` sont optionnels.
* `source_url` sert à conserver la source de la donnée.
* `notes` est un champ interne, ne pas l’afficher publiquement.

Contraintes de développement :

* Utiliser TypeScript strictement.
* Créer un type `Cgp` dans `src/lib/cgp.ts`.
* Créer une fonction `getAllCgps()`.
* Créer une fonction `getPublishedCgps()`.
* Créer une fonction `getCgpBySlug(slug: string)`.
* Créer une fonction `getCities()`.
* Créer une fonction `getDepartments()`.
* Créer une fonction `getCgpsByCity(city: string)`.
* Créer une fonction `getCgpsByDepartment(department: string)`.
* Créer une fonction `slugify()` dans `src/lib/slugify.ts`.
* Les routes dynamiques Astro doivent utiliser `getStaticPaths`.
* Les pages doivent être générées statiquement.
* Le parsing CSV doit être robuste aux champs vides.
* Les valeurs booléennes comme `is_published` doivent être normalisées.

Design :

* Utiliser Tailwind CSS et daisyUI.
* Créer une UI sobre, claire et professionnelle.
* Utiliser une navbar simple :

  * Accueil
  * Annuaire
  * Carte
  * Ajouter un CGP
  * Contact
* Footer avec :

  * Mentions légales
  * Politique de confidentialité
  * Contact
* Utiliser des cards daisyUI pour les CGP.
* Utiliser des breadcrumbs sur les pages internes.
* Le design doit être responsive mobile/desktop.

SEO :

* Chaque page doit avoir un `<title>` pertinent.
* Chaque page doit avoir une meta description.
* Les fiches CGP doivent avoir un title du type :
  “Jean Dupont - CGP indépendant à Paris”
* Les pages villes doivent avoir un title du type :
  “CGP indépendants à Paris”
* Les pages départements doivent avoir un title du type :
  “CGP indépendants dans le département Paris (75)”
* Générer une structure HTML propre avec un seul `h1` par page.
* Prévoir un sitemap si simple à ajouter.

Performance :

* Pas de JavaScript client inutile.
* Pas de composants React.
* Pas d’hydratation inutile.
* Générer du HTML statique.
* Charger uniquement le CSS nécessaire.

Livrable attendu :

* Générer tous les fichiers nécessaires.
* Le projet doit pouvoir tourner avec :
  `pnpm install`
  puis
  `pnpm run dev`
* Ajouter ou mettre à jour le README avec :

  * description du projet
  * stack utilisée
  * version Astro 7
  * structure du CSV
  * explication des champs ORIAS
  * commandes de développement
  * explication rapide pour ajouter un CGP dans le CSV

Ne pas ajouter Leaflet maintenant.
Ne pas ajouter de moteur de recherche avancé maintenant.
Ne pas ajouter d’authentification.
Ne pas ajouter de base de données.
Ne pas ajouter d’admin.
Créer seulement la V1 statique propre et extensible.
