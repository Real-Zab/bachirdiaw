/* Seul fichier à modifier pour brancher le showreel, les contacts, les réseaux et les chiffres d'audience.
   Tout champ laissé vide ("") est simplement masqué sur le site. */
window.SITE_CONFIG = {
  /* Showreel : provider = "youtube" ou "vimeo", id = identifiant de la vidéo (ex. pour youtube.com/watch?v=abc123, l'id est abc123) */
  showreel: { provider: "youtube", id: "" },

  /* Numéro WhatsApp au format international, chiffres uniquement (ex. 221770000000) */
  whatsapp: "221776335959",

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
    { value: "", label_fr: "Abonnés sur Instagram", label_en: "Instagram followers" },
    { value: "", label_fr: "Abonnés sur TikTok", label_en: "TikTok followers" },
    { value: "", label_fr: "Vues mensuelles", label_en: "Monthly views" }
  ]
};
