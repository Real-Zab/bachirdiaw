/* Seul fichier à modifier pour brancher le showreel, les contacts, les réseaux et les chiffres d'audience.
   Tout champ laissé vide ("") est simplement masqué sur le site. */
window.SITE_CONFIG = {
  /* Showreel : provider = "youtube" ou "vimeo", id = identifiant de la vidéo (ex. pour youtube.com/watch?v=abc123, l'id est abc123) */
  showreel: { provider: "youtube", id: "" },

  /* Diaporama de l'accueil : interval = durée d'une photo en millisecondes, fade = durée du fondu, pauseOnTouch = pause quand on appuie sur la photo, pauseOnHover = pause au survol (ordinateur) */
  slideshow: { interval: 8000, fade: 1400, pauseOnTouch: true, pauseOnHover: false },

  /* Kit média : chemin du PDF une fois déposé dans le dossier media (ex. "media/kit-media-bachir-diaw.pdf"). Vide = bouton masqué. */
  mediaKit: "",

  /* Numéro WhatsApp au format international, chiffres uniquement (ex. 221770000000) */
  whatsapp: "",

  /* Email de contact professionnel */
  email: "contact@bachirdiaw.com",

  /* Liens complets vers tes comptes (ex. https://www.instagram.com/ton_compte) */
  social: {
    instagram: "https://www.instagram.com/bachir__diaw",
    tiktok: "https://www.tiktok.com/@bachir_diaw",
    facebook: "https://www.facebook.com/share/1CZFTLsFWj/",
    x: "https://x.com/BachirDiaw",
    snapchat: "https://www.snapchat.com/add/el-bashir",
    threads: "https://www.threads.com/@bachir__diaw",
    youtube: "https://youtube.com/@chefdiaw2618"
  },

  /* Chiffres d'audience affichés sur la page Collaborations. Une ligne sans valeur n'apparaît pas. */
  stats: [
    { value: "59,6 K", label_fr: "Abonnés sur Instagram", label_en: "Instagram followers" },
    { value: "208 K", label_fr: "Abonnés sur TikTok", label_en: "TikTok followers" },
    { value: "9 742", label_fr: "Abonnés sur X", label_en: "X followers" }
  ],

  /* Institutionnel : lien à ouvrir pour chaque série (vidéo YouTube, page LinkedIn ou Facebook de la structure, etc.).
     Colle l'adresse complète entre les guillemets. Vide = aucun bouton. */
  instLinks: {
    "baisse-loyer": "https://youtube.com/playlist?list=PLuq-9139yokAhYjGtOJb0dX-MKwg8TbER&si=-ue9RF8Ce57-sB7B",
    "tier": "https://youtube.com/playlist?list=PLuq-9139yokD9AxBGAr64BReSN9owr1cu&si=lOt8uYHCXzcL1UoQ",
    "horizon-halal": "https://lnkd.in/p/dptSvT2Y"
  },

  /* Témoignages publiés sur la page Témoignages. Ajoute une ligne par témoignage reçu avec l'accord de la personne :
     { quote_fr: "…", quote_en: "…", name: "Prénom Nom", role: "Fonction, projet" }. Liste vide = rien d'affiché. */
  testimonials: []

};
