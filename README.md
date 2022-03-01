## PORTFOLIO_PROJECT
Projet de programmation web backend.

## RÈGLES DE DÉVELOPPEMENT:
# NOMENCLATURE
Langues:
- commentaires = Français ;
- BDD = Français ;
- code php/js/html/css = Anglais;

Nommage: 
- Tout nom de variables/fonctions commence par une minuscule ;
- Les nom de variables/fonctions s’écrivent sans espace : les mots sont séparés par des majuscules (nomDeVariable/nomDeFonction) ;
- Seule les constantes ont un nom en majuscule avec underscore (NOM_CONSTANTE) ;
- Tout nom de variable/constante/fonction doit être explicite ;

# ORGANISATION DE BASE DU SITE

CSS:
→  doit contenir tous les scripts css du site ;
→  common.css = règles css communes à index.html et admin.html ;
→  public.css = règles css de index.html ;
→  admin.cs = règles css de admin.html ;
→   “img” doit contenir toutes les images purement relatives à l’esthétique du site (icône de croix, icône de flèche, etc.) ;

IMG:
→ doit contenir toutes les images constituant le contenu du site (logo, photo d’identité, photos de projet, etc.) ;
→ “gallery” = img de la gallery ;
→ “skills” = img de la section compétences

JS:
→ doit contenir le fichier tous les scripts javascript du site ;
→ public.js = script de la page index.html ;
→ admin.js = script de la page admin.html ;

PHP (= models/controllers/routers de notre modèle MVC):
→ doit contenir tous les scripts php du site ;

À LA RACINE DU SITE (= les vues de notre modèle MVC):
→ index.html = partie publique du portfolio ;
→ admin.html = partie admin ;
