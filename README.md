# bachirdiaw.com

Site statique : français à la racine, anglais dans `/en/`. Aucun outil de build n'est nécessaire.

## Mise en ligne (GitHub + Cloudflare Pages)

1. Dans GitHub, glisser-déposer tout le contenu du dossier (pas le zip) dans le dépôt.
2. Dans Cloudflare Pages, connecter le dépôt. Commande de build : vide. Dossier de sortie : `/`.
3. Dans Cloudflare Pages, onglet Custom domains, ajouter `bachirdiaw.com`.

## Ce qui reste à remplir

**js/config.js** : showreel (YouTube ou Vimeo), numéro WhatsApp, email, liens des réseaux, chiffres d'audience. Un champ vide est masqué sur le site. Le formulaire de contact envoie vers WhatsApp (ou l'email si pas de numéro).

**Photos** : à déposer dans le dossier `img/`, au format JPG, avec exactement ces noms. Tant qu'une photo manque, un emplacement coloré s'affiche à sa place.

| Fichier | Où il apparaît |
|---|---|
| `hero.jpg` | Portrait de l'accueil (format 4:5) |
| `og.jpg` | Image de partage WhatsApp, Facebook, Google (1200 x 630) |
| `karma-cover.jpg`, `karma-1.jpg` à `karma-4.jpg` | Fiche Karma (couverture + 4 photos) |
| même schéma pour `derapages`, `infideles`, `salma`, `beaute-maudite`, `fassema` | Fiches des autres séries |
| `inst-el-tac-tico.jpg`, `inst-baisse-loyer.jpg`, `inst-tier.jpg`, `inst-horizon-halal.jpg` | Page Institutionnel |
| `media-1.jpg` à `media-8.jpg` | Galerie de la page Médias |

**Textes "À compléter"** : personnage, année, diffusion et synopsis de chaque série, rôle, commanditaire et année de chaque série institutionnelle. Envoie les informations et les pages sont mises à jour en français et en anglais.

## Avant publication

- Vérifier les droits d'utilisation des affiches, photos et extraits.
- Vérifier les liens du pied de page vers MAISON BAMBOU et Deuxième Étoile.
