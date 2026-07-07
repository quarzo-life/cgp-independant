# CGP Indépendant

Annuaire statique, léger et SEO-friendly des conseillers en gestion de patrimoine (CGP)
indépendants en France. V1 : listing, fiches individuelles, pages par ville et par
département. Une page carte est prévue en V2.

## Stack

- [Astro 7](https://astro.build) — génération 100% statique, pas de framework JS côté client
- TypeScript strict
- Tailwind CSS v4 (via `@tailwindcss/vite`)
- daisyUI v5
- Données depuis un fichier CSV local, parsé au build avec `csv-parse`
- Pas de React, pas de backend, pas de base de données

## Structure du projet

```text
src/
  pages/
    index.astro                        page d'accueil
    cgp/
      index.astro                      annuaire complet
      carte.astro                      placeholder carte interactive
      [slug].astro                     fiche individuelle d'un CGP
      par-ville/
        index.astro                    liste des villes
        [city].astro                   CGP d'une ville
      par-departement/
        index.astro                    liste des départements
        [department].astro             CGP d'un département
    ajouter-un-cgp.astro
    a-propos.astro
    contact.astro
    mentions-legales.astro
    politique-confidentialite.astro
  components/                          Layout, Header, Footer, CgpCard, Breadcrumb, EmptyState
  data/
    cgp.csv                            source de données
  lib/
    cgp.ts                             type Cgp + fonctions d'accès aux données
    slugify.ts                         génération de slugs
  styles/
    global.css                         import Tailwind + daisyUI
```

## Commandes de développement

```sh
pnpm install
pnpm dev       # démarre le serveur de dev sur http://localhost:4321
pnpm build     # génère le site statique dans ./dist
pnpm preview   # prévisualise le build de production
```

## Structure du CSV (`src/data/cgp.csv`)

```csv
id,display_name,first_name,last_name,firm_name,legal_name,siren,siret,orias_number,orias_status,orias_categories,orias_last_checked_at,city,postal_code,department_code,department_name,region,address,latitude,longitude,website,email,phone,linkedin,slug,is_published,source_url,notes
```

| Champ | Description |
| --- | --- |
| `id` | Identifiant stable de la fiche |
| `display_name` | Nom affiché publiquement |
| `firm_name` | Nom du cabinet |
| `city`, `postal_code`, `department_code`, `department_name`, `region` | Localisation |
| `website`, `email`, `phone`, `linkedin` | Coordonnées, tous optionnels |
| `slug` | Utilisé pour l'URL de la fiche (`/cgp/[slug]/`). Si vide, un slug est généré automatiquement à partir du nom et de la ville |
| `is_published` | `true`/`false`. Les fiches à `false` sont exclues de tout l'annuaire (listing, villes, départements, sitemap) |
| `source_url` | Source de la donnée, non affichée publiquement |
| `notes` | Champ interne, jamais affiché publiquement |

### Champs ORIAS

- `orias_number` : numéro d'immatriculation ORIAS, optionnel. S'il est présent, une mention
  prudente est affichée sur la fiche : *« Informations à vérifier sur le registre officiel
  ORIAS. »* Le site n'affiche jamais de mention « vérifié » ou « certifié » — il ne fait que
  relayer un numéro déclaré, à vérifier par le visiteur sur https://www.orias.fr/.
- `orias_status`, `orias_categories` (séparées par `;`), `orias_last_checked_at` : optionnels,
  affichés uniquement s'ils sont renseignés.

## Ajouter un CGP dans le CSV

1. Ouvrir `src/data/cgp.csv`.
2. Ajouter une nouvelle ligne en respectant l'ordre des colonnes de l'en-tête.
3. Renseigner un `id` unique et stable.
4. Laisser `slug` vide pour une génération automatique, ou fournir un slug personnalisé
   (minuscules, sans accents, mots séparés par des tirets).
5. Mettre `is_published` à `true` pour que la fiche apparaisse sur le site, `false` pour la
   masquer sans la supprimer.
6. Ne jamais indiquer une fiche comme « vérifiée » : seul un `orias_number` renseigné déclenche
   l'affichage de la mention prudente ORIAS.
7. Relancer `pnpm dev` ou `pnpm build` : les pages (fiche, ville, département) sont générées
   automatiquement au build via `getStaticPaths`.
