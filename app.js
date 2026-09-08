/**
 * PORTFOLIO HELCIANE HOUGBADJI - EXACT BENTO ENGINE
 */

// 1. DATA DES PROJETS & CRÉATIONS
const PROJECTS_DATA = [
  {
    id: 'peace-page',
    title: 'Peace Page',
    client: 'Projet de Fin d\'Études Bachelor',
    category: 'academic',
    categoryLabel: 'Édition & Santé',
    year: '2023',
    cover: 'MES PROJETS/PEACE PAGE/PEACE PAGE-01.png',
    images: [
      'MES PROJETS/PEACE PAGE/PEACE PAGE-01.png',
      'MES PROJETS/PEACE PAGE/PEACE PAGE-02.png',
      'MES PROJETS/PEACE PAGE/PEACE PAGE-03.png',
      'MES PROJETS/PEACE PAGE/PEACE PAGE-04.png',
      'MES PROJETS/PEACE PAGE/PEACE PAGE-05.png',
      'MES PROJETS/PEACE PAGE/PEACE PAGE-06.png',
      'MES PROJETS/PEACE PAGE/PEACE PAGE-07.png'
    ],
    role: 'Conception Éditoriale & Illustration Sociale',
    tags: ['Santé Mentale', 'Bachelor', 'Afrique', 'Carnet d\'Accompagnement'],
    summary: 'Notebook d\'accompagnement psychologique pour faciliter la communication intergénérationnelle sur la santé mentale en Afrique.',
    description: `Projet de fin d'études Bachelor. Peace Page est un notebook pensé pour accompagner les jeunes traversant des difficultés psychologiques grâce à l'analyse complète de leurs troubles et aux conclusions à en tirer. Problématique : « Comment faciliter la communication intergénérationnelle en ce qui concerne les problèmes liés à la santé mentale en Afrique ? » (« It's okay to not be okay »).`
  },
  {
    id: 'baudelaire',
    title: 'Bibliothèque Baudelaire',
    client: 'Workshop / Bibliothèque',
    category: 'academic',
    categoryLabel: 'Signalétique & Icones',
    year: '2022',
    cover: 'MES PROJETS/BAUDELAIRE/BAUDELAIRE-02.png',
    images: [
      'MES PROJETS/BAUDELAIRE/BAUDELAIRE-02.png',
      'MES PROJETS/BAUDELAIRE/BAUDELAIRE-01.png',
      'MES PROJETS/BAUDELAIRE/BAUDELAIRE-03.png',
      'MES PROJETS/BAUDELAIRE/BAUDELAIRE-04.png'
    ],
    role: 'Signalétique Spatiale & Pictogrammes',
    tags: ['Signalétique', 'Bibliothèque', 'Iconographie', 'Poésie & Contes'],
    summary: 'Système complet de signalétique et travail d\'iconographie pour une bibliothèque reconnue pour sa poésie et ses contes.',
    description: `Baudelaire est une bibliothèque fictive reconnue surtout pour ses livres de poésie et de contes français. Le but de ce projet : concevoir des signalétiques et un travail d'iconographie complet guidant les usagers (Poésie, Littérature, Enfants, Sciences, Familles, Boîte de retours).`
  },
  {
    id: 'guess-the-problem',
    title: 'Guess The Problem',
    client: 'Workshop Créatif',
    category: 'academic',
    categoryLabel: 'Design Thinking',
    year: '2022',
    cover: 'MES PROJETS/GUESS THE PROBLEM/GUESS THE PROBLEM-01.png',
    images: [
      'MES PROJETS/GUESS THE PROBLEM/GUESS THE PROBLEM-01.png',
      'MES PROJETS/GUESS THE PROBLEM/GUESS THE PROBLEM-02.png',
      'MES PROJETS/GUESS THE PROBLEM/GUESS THE PROBLEM-03.png',
      'MES PROJETS/GUESS THE PROBLEM/GUESS THE PROBLEM-04.png'
    ],
    role: 'Game Design Visuel & Facilitation Graphique',
    tags: ['Design Thinking', 'Jeu de Cartes', 'Idéation', 'Résolution'],
    summary: 'Jeu de cartes ludique et visuel pour animer des ateliers d\'idéation et diagnostiquer collectivement les blocages d\'un projet.',
    description: `Création d'un ensemble de supports graphiques et de cartes de jeu pour un atelier de Design Thinking. Ce workshop permet aux équipes créatives d'identifier les racines des problèmes de communication et de concevoir des solutions innovantes de façon collaborative.`
  },
  {
    id: 'canalbox-benin',
    title: 'Canalbox Bénin',
    client: 'Canalbox Bénin (Groupe Vivendi / GVA)',
    category: 'pro',
    categoryLabel: 'Brand & Digital',
    year: '2024',
    cover: 'MES PROJETS/CANALBOX PROJECTS/CANALBOX-01.png',
    images: [
      'MES PROJETS/CANALBOX PROJECTS/CANALBOX-01.png',
      'MES PROJETS/CANALBOX PROJECTS/CANALBOX-02.png',
      'MES PROJETS/CANALBOX PROJECTS/CANALBOX-03.png',
      'MES PROJETS/CANALBOX PROJECTS/CANALBOX-04.png'
    ],
    role: 'Direction Artistique, Communication Digitale & Espace',
    tags: ['Communication Digitale', '+100 Visuels', 'Inauguration', 'Photocalls', 'Design Bureaux', 'Brochures & Print'],
    summary: 'Accompagnement 360° pour Canalbox Bénin : création de plus de 100 visuels pour les réseaux sociaux, supports imprimés, scénographie d\'inauguration et aménagement graphique des bureaux.',
    description: `Partenaire de Canalbox (Groupe Vivendi / GVA), fournisseur d'accès internet très haut débit en Afrique de l'Ouest, j'ai réalisé un accompagnement créatif complet mêlant communication digitale et identité spatiale :

• Communication Digitale & Social Media : Création de plus de 100 visuels hebdomadaires pour Instagram et Facebook, gestion éditoriale, mise en valeur des offres fibre optique et événements pour booster l'engagement en ligne. Conception de brochures de promotion et de mémos clients synthétisant les offres, tarifs et zones de couverture avec QR code direct.

• Événementiel, Scénographie & Aménagement : Pour l'inauguration très médiatisée au Bénin, conception des photocalls événementiels pour les shootings photo, création de tenues spécifiques pour les hôtesses d'accueil et design des projecteurs de réception. Habillage mural et aménagement graphique des bureaux Canalbox au Bénin dans le respect de leur charte dynamique : « Taffez, Streamez, Dansez, Idéalisez ! »`
  },
  {
    id: 'canal-plus',
    title: 'Canal+ Bénin',
    client: 'Canal+ Bénin',
    category: 'pro',
    categoryLabel: 'Campagnes Digitales',
    year: '2024',
    cover: 'MES PROJETS/CANAL+PROJECTS/CANAL+PROJECTS-01.png',
    images: [
      'MES PROJETS/CANAL+PROJECTS/CANAL+PROJECTS-01.png',
      'MES PROJETS/CANAL+PROJECTS/CANAL+PROJECTS-02.png'
    ],
    role: 'Direction Artistique & Visuels Réseaux Sociaux',
    tags: ['Campagnes Digitales', 'Netflix dans Canal+', 'Tabaski', 'Ligue des Champions'],
    summary: 'Visuels promotionnels et célébrations pour Canal+ Bénin (Tabaski, Pâques, Ascension, LDC) et support démo pour l\'offre Netflix.',
    description: `Canal+ est un groupe audiovisuel proposant films, séries, sports et documentaires via ses chaînes et plateformes. Il se distingue par ses contenus premium, son innovation et sa présence internationale. J'ai contribué à la réalisation de visuels digitaux pour les réseaux sociaux principalement Facebook de Canal+ Bénin (offres décodeur, Tabaski, Pâques, Ascension, Ligue des Champions). Lors du lancement de la nouveauté « Netflix débarque dans Canal+ », j'ai prototypé et participé à l'organisation complète de la démonstration pour valoriser l'expérience des abonnés.`
  },
  {
    id: 'coffee-loffee',
    title: 'Coffee Loffee',
    client: 'Projet Personnel / Concept Brand',
    category: 'branding',
    categoryLabel: 'Branding Global',
    year: '2024',
    cover: 'MES PROJETS/COFFEE LOFEE/coffeeloffee copie-01.png',
    images: [
      'MES PROJETS/COFFEE LOFEE/coffeeloffee copie-01.png',
      'MES PROJETS/COFFEE LOFEE/coffeeloffee copie.png',
      'MES PROJETS/COFFEE LOFEE/coffeeloffee copie-02.png',
      'MES PROJETS/COFFEE LOFEE/coffeeloffee copie-06.png',
      'MES PROJETS/COFFEE LOFEE/coffeeloffee copie-09.png',
      'MES PROJETS/COFFEE LOFEE/coffeeloffee copie-16.png',
      'MES PROJETS/COFFEE LOFEE/coffeeloffee copie-17.png',
      'MES PROJETS/COFFEE LOFEE/coffeeloffee copie-23.png',
      'MES PROJETS/COFFEE LOFEE/coffeeloffee copie-25.png',
      'MES PROJETS/COFFEE LOFEE/coffeeloffee copie-26.png'
    ],
    role: 'Identité Visuelle, Packaging & Univers de Marque',
    tags: ['Identité Visuelle', 'Packaging Gobelets', 'Tote Bag', 'Cupcakes', 'Menu'],
    summary: 'Coffee shop fictif où la musique et le café se rencontrent dans une ambiance chaleureuse, immersive et inspirante.',
    description: `Coffee Loffee est un coffee shop fictif où la musique et le café se rencontrent dans une ambiance joyeuse et immersive (« Hot in freeze time »). Ce projet éveille les sens, stimule la créativité et propose une expérience chaleureuse, sensorielle, inspirante et captivante : création du logotype, de l'identité visuelle, des packagings de gobelets, sacs en toile (tote bags), boîtes de cupcakes et déclinaisons de menu.`
  },
  {
    id: 'demeter-bowl',
    title: 'Demeter\'s Bowl',
    client: 'Projet Personnel / Concept Food',
    category: 'branding',
    categoryLabel: 'Packaging & Brand',
    year: '2024',
    cover: 'MES PROJETS/DEMETER BOWL/DEMETER\'S BOWLfinal2.png',
    images: [
      'MES PROJETS/DEMETER BOWL/DEMETER\'S BOWLfinal2.png',
      'MES PROJETS/DEMETER BOWL/DEMETER\'S BOWLfinals.png',
      'MES PROJETS/DEMETER BOWL/DEMETER\'S BOWLfinals-07.png',
      'MES PROJETS/DEMETER BOWL/DEMETER\'S BOWLfinals-08.png',
      'MES PROJETS/DEMETER BOWL/DEMETER\'S BOWLfinals-09.png',
      'MES PROJETS/DEMETER BOWL/DEMETER\'S BOWLfinals-13.png',
      'MES PROJETS/DEMETER BOWL/DEMETER\'S BOWLfinals-14.png',
      'MES PROJETS/DEMETER BOWL/DEMETER\'S BOWLfinals-15.png',
      'MES PROJETS/DEMETER BOWL/DEMETER\'S BOWLfinals-16.png'
    ],
    role: 'Identité Visuelle & Packagings Fraîcheur',
    tags: ['Salad Bar', 'Packaging Éco-conçu', 'Mythologie', 'Food Branding'],
    summary: 'Branding inspiré de la déesse des moissons : symbole de fraîcheur, d\'abondance et de vitalité pour des bols de salades saines.',
    description: `Dans la mythologie, Déméter est la déesse des moissons, symbole de fraîcheur, d'abondance et de vitalité. C'est cette énergie qui a inspiré Demeter's Bowl : un branding fictif pensé comme une offrande moderne à la nature, mais aussi comme un reflet personnel. Conception d'identités graphiques fraîches, contenants alimentaires durables pour salades à composer et univers visuel en point de vente (« Refresh your mind »).`
  },
  {
    id: 'trellix-iconic',
    title: 'Trellix - Iconic Love',
    client: 'Trellix Technologies',
    category: 'pro',
    categoryLabel: 'Identité & Web',
    year: '2022',
    cover: 'MES PROJETS/DESIGN TRELLIX/DESIGN TRELLIX-01.png',
    images: [
      'MES PROJETS/DESIGN TRELLIX/DESIGN TRELLIX-01.png',
      'MES PROJETS/DESIGN TRELLIX/DESIGN TRELLIX-02.png',
      'MES PROJETS/DESIGN TRELLIX/DESIGN TRELLIX-03.png'
    ],
    role: 'Identité Visuelle, Packaging & Site WordPress',
    tags: ['Produits Soin', 'WordPress', 'Packagings', 'Iconographie Beans'],
    summary: 'Création de la marque Iconic Love (soins de la peau), conception des packagings et réalisation du site web sur WordPress.',
    description: `Trellix est une entreprise technologique qui développe des solutions destinées à aider les organisations à former leurs jeunes talents. Chez Trellix, j'ai réalisé divers projets créatifs, dont la création de la marque Iconic Love (produits pour la peau) : identité visuelle, conception des packagings adaptés et développement du site sur WordPress. J'ai également fait de l'iconographie numérique à long terme pour Beans (+600 icônes), axée sur les programmes de fidélité et parrainage.`
  },
  {
    id: 'waste-tobag',
    title: 'Waste Tobag',
    client: 'SGDS Bénin',
    category: 'academic',
    categoryLabel: 'Design Éco-citoyen',
    year: '2023',
    cover: 'MES PROJETS/WASTE TOBAG/ WASTE TOBAG.png',
    images: [
      'MES PROJETS/WASTE TOBAG/ WASTE TOBAG.png'
    ],
    role: 'Design d\'Usage & Illustrations Didactiques',
    tags: ['SGDS Bénin', 'Poubelle Engageante', 'Gestion des Déchets', '+7 Illustrations'],
    summary: 'Poubelle engageante pour sensibiliser les populations à la gestion des déchets plastiques, avec +7 illustrations de mise en scène.',
    description: `Projet réalisé avec la SGDS (Société de Gestion des Déchets et de la Salubrité Bénin). Waste Tobag a été conçu pour accompagner la population à la gestion des déchets plastiques après utilisation dans les espaces communautaires. Réalisation du dispositif de poubelle engageante et de plus de 7 illustrations de mise en scène didactiques créées par mes soins (Day 1, Week 1, Later...).`
  },
  {
    id: 'home-hotel',
    title: 'HOME Residence Hotel',
    client: 'HOME Residence Hotel (Bénin)',
    category: 'pro',
    categoryLabel: 'Direction Artistique',
    year: '2025',
    cover: 'MES PROJETS/HOME/HOME-01.png',
    images: [
      'MES PROJETS/HOME/HOME-01.png',
      'MES PROJETS/HOME/HOME-02.png'
    ],
    role: 'Direction Artistique, Graphisme & Social Media',
    tags: ['Direction Artistique', 'Événementiel Fin d\'Année', 'Rooftop', 'Stories'],
    summary: 'Visuels pour les grands événements de fin d\'année 2025 (Menu de Noël, Le Live de Noël Rooftop, Sparkles Night) et templates stories.',
    description: `Home est un établissement hôtelier élégant et moderne, offrant un cadre raffiné, confortable et chaleureux. J'y ai travaillé en freelance sur plusieurs projets, parmi lesquels se trouve la création de visuels pour leurs grands événements de fin d'année 2025, renforçant leur image prestigieuse (Menu de Noël, Le Live de Noël sur le Rooftop, Sparkles Night). J'ai également conçu des propositions de templates stories pour dynamiser leur communication digitale quotidienne.`
  },
  {
    id: 'illustrations-perso',
    title: 'Illustrations & Inspirations',
    client: 'Créations Personnelles & Inspirations',
    category: 'illustration',
    categoryLabel: 'Inspirations & Art',
    year: '2025',
    hideFromTrack: true, // Visible uniquement via la carte Inspirations
    cover: 'MES ILLUSTRATIONS PERSOS/Illumes.png',
    images: [
      'MES ILLUSTRATIONS PERSOS/Illumes.png',
      'MES ILLUSTRATIONS PERSOS/Illumes-02.png'
    ],
    role: 'Illustration, Inspirations & Lettrage Pop',
    tags: ['Inspirations', 'Affiches d\'Art', 'Lettrage', 'Textures', 'Vibe Pop'],
    summary: 'Explorations graphiques personnelles et inspirations mêlant messages vibrants, typographie expressive et palettes chaleureuses.',
    description: `Explorations libres et carnet d'inspirations autour des messages du quotidien, de la positivité et du design d'affiches (« Positive Energy with vitamine D », « Sweets Decisions », « Poker Face »). Une recherche constante d'harmonie entre composition audacieuse et vibration des couleurs.`
  }
];

// 2. AVIS CLIENTS (REVIEWS)
const REVIEWS_DATA = [
  {
    quote: "Notre collaboration a été fluide et efficace du début à la fin. Chaque détail était pensé avec soin, et les résultats ont largement dépassé nos attentes.",
    author: "Direction Marketing",
    role: "CANALBOX BÉNIN • 2024"
  },
  {
    quote: "Helciane a su sublimer l'image de notre hôtel pour les grands événements de fin d'année. Créativité, élégance et réactivité irréprochables.",
    author: "Direction Générale",
    role: "HOME RESIDENCE HOTEL • 2025"
  },
  {
    quote: "Une direction artistique pointue et des livrables de très haute qualité. La marque et les packagings créés ont immédiatement séduit nos clients.",
    author: "Lead Product",
    role: "TRELLIX TECHNOLOGIES • 2022"
  }
];

let currentReviewIndex = 0;

function updateReview(index) {
  const quoteEl = document.getElementById('reviewQuoteText');
  const nameEl = document.getElementById('reviewAuthorName');
  const roleEl = document.getElementById('reviewAuthorRole');
  if (!quoteEl || !nameEl || !roleEl) return;

  const rev = REVIEWS_DATA[index];
  quoteEl.style.opacity = '0';
  setTimeout(() => {
    quoteEl.textContent = rev.quote;
    nameEl.textContent = rev.author;
    roleEl.textContent = rev.role;
    quoteEl.style.opacity = '1';
  }, 120);
}

// Helper to sanitize path for HTML attributes
function encodePath(path) {
  return path.split('/').map(segment => encodeURIComponent(segment).replace(/'/g, '%27')).join('/');
}

// 3. RENDU DU CARROUSEL DE PROJETS
function renderProjectsTrack() {
  const track = document.getElementById('projectsTrack');
  if (!track) return;
  track.innerHTML = '';

  PROJECTS_DATA.filter(p => !p.hideFromTrack).forEach(p => {
    const item = document.createElement('div');
    item.className = 'project-bento-item';
    item.setAttribute('tabindex', '0');
    item.setAttribute('role', 'button');
    item.setAttribute('title', `Ouvrir ${p.title}`);
    item.dataset.projectId = p.id;

    item.innerHTML = `
      <img class="project-bento-cover" src="${encodePath(p.cover)}" alt="${p.title}" loading="lazy" />
      <div class="project-floating-pill">
        <span class="pill-cat">${p.categoryLabel}</span>
        <span class="pill-name">${p.title}</span>
        <span class="pill-year">${p.year}</span>
      </div>
    `;

    item.addEventListener('click', (e) => {
      e.stopPropagation();
      openProjectModal(p.id);
    });
    item.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openProjectModal(p.id);
      }
    });

    track.appendChild(item);
  });
}

// 3.1 GESTION DU DÉFILEMENT AUTOMATIQUE DU CARROUSEL
let autoScrollTimer = null;
let isAutoScrollPaused = false;

function startAutoScroll() {
  stopAutoScroll();
  autoScrollTimer = setInterval(() => {
    const track = document.getElementById('projectsTrack');
    const modal = document.getElementById('projectModal');
    // Ne pas défiler si en pause manuelle ou si une modale est ouverte
    if (!track || isAutoScrollPaused || (modal && modal.classList.contains('open'))) return;

    // Déplacement fluide équivalent à la largeur d'une carte + marge (~370px)
    const cardStep = 370;
    const maxScroll = track.scrollWidth - track.clientWidth;

    // Si on a atteint la fin, retour fluide au début, sinon carte suivante
    if (track.scrollLeft >= maxScroll - 25) {
      track.scrollTo({ left: 0, behavior: 'smooth' });
    } else {
      track.scrollBy({ left: cardStep, behavior: 'smooth' });
    }
  }, 3200);
}

function stopAutoScroll() {
  if (autoScrollTimer) {
    clearInterval(autoScrollTimer);
    autoScrollTimer = null;
  }
}

function resetAutoScrollDelay() {
  isAutoScrollPaused = true;
  stopAutoScroll();
  setTimeout(() => {
    isAutoScrollPaused = false;
    startAutoScroll();
  }, 3500);
}

// 4. MODAL CASE STUDY CONTROLLER
let currentProject = null;
let currentImageIndex = 0;

function openProjectModal(projectId) {
  let project = PROJECTS_DATA.find(p => p.id === projectId);
  if (!project) {
    if (projectId === 'canalbox-inauguration' || projectId === 'canalbox-digital') {
      project = PROJECTS_DATA.find(p => p.id === 'canalbox-benin');
    } else if (projectId === 'canal-plus-canalbox') {
      project = PROJECTS_DATA.find(p => p.id === 'canalbox-benin') || PROJECTS_DATA.find(p => p.id === 'canal-plus');
    }
  }
  if (!project) return;

  currentProject = project;
  currentImageIndex = 0;

  if (window.location.hash !== `#project-${projectId}`) {
    history.replaceState(null, null, `#project-${projectId}`);
  }

  const modal = document.getElementById('projectModal');
  const modalCategory = document.getElementById('modalCategory');
  const modalTitle = document.getElementById('modalTitle');
  const modalDescription = document.getElementById('modalDescription');
  const modalClient = document.getElementById('modalClient');
  const modalYear = document.getElementById('modalYear');
  const modalRole = document.getElementById('modalRole');
  const modalTags = document.getElementById('modalTags');

  modalCategory.textContent = project.categoryLabel;
  modalTitle.textContent = project.title;
  modalDescription.textContent = project.description;
  modalClient.textContent = project.client;
  modalYear.textContent = project.year;
  modalRole.textContent = project.role;

  modalTags.innerHTML = project.tags.map(t => `<span class="project-tag">${t}</span>`).join('');

  updateModalImage();
  renderThumbnails();

  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
  isAutoScrollPaused = true;
}

function updateModalImage() {
  if (!currentProject) return;
  const activeImg = document.getElementById('modalActiveImage');
  const prevBtn = document.getElementById('galleryPrevBtn');
  const nextBtn = document.getElementById('galleryNextBtn');

  activeImg.style.opacity = '0';
  setTimeout(() => {
    activeImg.src = encodePath(currentProject.images[currentImageIndex]);
    activeImg.alt = `${currentProject.title} - Vue ${currentImageIndex + 1}`;
    activeImg.style.opacity = '1';
  }, 120);

  if (currentProject.images.length <= 1) {
    prevBtn.style.display = 'none';
    nextBtn.style.display = 'none';
  } else {
    prevBtn.style.display = 'grid';
    nextBtn.style.display = 'grid';
  }

  document.querySelectorAll('.gallery-thumb').forEach((th, i) => {
    th.classList.toggle('active', i === currentImageIndex);
  });
}

function renderThumbnails() {
  const container = document.getElementById('modalThumbnails');
  if (!container || !currentProject) return;
  container.innerHTML = '';

  if (currentProject.images.length <= 1) {
    container.style.display = 'none';
    return;
  }
  container.style.display = 'flex';

  currentProject.images.forEach((img, idx) => {
    const thumb = document.createElement('div');
    thumb.className = `gallery-thumb ${idx === currentImageIndex ? 'active' : ''}`;
    thumb.innerHTML = `<img src="${encodePath(img)}" alt="Vignette ${idx + 1}" loading="lazy" />`;
    thumb.addEventListener('click', () => {
      currentImageIndex = idx;
      updateModalImage();
    });
    container.appendChild(thumb);
  });
}

function closeProjectModal() {
  const modal = document.getElementById('projectModal');
  if (!modal) return;
  modal.classList.remove('open');
  document.body.style.overflow = '';
  currentProject = null;
  if (window.location.hash.startsWith('#project-')) {
    history.replaceState(null, null, window.location.pathname);
  }
  isAutoScrollPaused = false;
}

// 5. MODAL HELPERS GÉNÉRIQUES (SERVICES, PROCESS, FAQ)
function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (!modal) return;
  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (!modal) return;
  modal.classList.remove('open');
  document.body.style.overflow = '';
}

// 6. INITIALISATION & LISTENERS
function initApp() {
  // Rendu du carrousel de projets
  renderProjectsTrack();

  // Détection d'un projet ciblé dans l'URL (#project-id)
  if (window.location.hash && window.location.hash.startsWith('#project-')) {
    const targetId = window.location.hash.replace('#project-', '');
    openProjectModal(targetId);
  }

  // Carrousel flèches de défilement horizontal et délégation de clic
  const track = document.getElementById('projectsTrack');
  const prevArrow = document.getElementById('carouselPrevBtn');
  const nextArrow = document.getElementById('carouselNextBtn');

  if (track) {
    track.addEventListener('click', (e) => {
      const item = e.target.closest('.project-bento-item');
      if (item && item.dataset.projectId) {
        openProjectModal(item.dataset.projectId);
      }
    });
  }

  if (prevArrow && track) {
    prevArrow.addEventListener('click', () => {
      track.scrollBy({ left: -370, behavior: 'smooth' });
      resetAutoScrollDelay();
    });
  }

  if (nextArrow && track) {
    nextArrow.addEventListener('click', () => {
      track.scrollBy({ left: 370, behavior: 'smooth' });
      resetAutoScrollDelay();
    });
  }

  // Lancement du défilement automatique et pause au survol / toucher
  startAutoScroll();

  const scrollWrapper = document.querySelector('.projects-scroll-wrapper');
  if (scrollWrapper) {
    scrollWrapper.addEventListener('mouseenter', () => {
      isAutoScrollPaused = true;
    });
    scrollWrapper.addEventListener('mouseleave', () => {
      isAutoScrollPaused = false;
    });
    scrollWrapper.addEventListener('touchstart', () => {
      isAutoScrollPaused = true;
    }, { passive: true });
    scrollWrapper.addEventListener('touchend', () => {
      setTimeout(() => { isAutoScrollPaused = false; }, 2500);
    }, { passive: true });
  }

  // Navigation dans les avis clients
  const revPrev = document.getElementById('reviewPrevBtn');
  const revNext = document.getElementById('reviewNextBtn');

  if (revPrev) {
    revPrev.addEventListener('click', () => {
      currentReviewIndex = (currentReviewIndex - 1 + REVIEWS_DATA.length) % REVIEWS_DATA.length;
      updateReview(currentReviewIndex);
    });
  }

  if (revNext) {
    revNext.addEventListener('click', () => {
      currentReviewIndex = (currentReviewIndex + 1) % REVIEWS_DATA.length;
      updateReview(currentReviewIndex);
    });
  }

  // Boutons d'ouverture des modales
  const btnProcess = document.getElementById('btnOpenProcess');
  if (btnProcess) btnProcess.addEventListener('click', () => openModal('processModal'));

  const btnServices = document.getElementById('btnOpenServices');
  if (btnServices) btnServices.addEventListener('click', () => openModal('servicesModal'));

  const btnFAQ = document.getElementById('btnOpenFAQ');
  if (btnFAQ) btnFAQ.addEventListener('click', () => openModal('faqModal'));

  const btnInsights = document.getElementById('btnOpenInsights');
  if (btnInsights) btnInsights.addEventListener('click', () => openProjectModal('illustrations-perso'));

  const btnScrollProjects = document.getElementById('btnScrollProjects');
  if (btnScrollProjects && track) {
    btnScrollProjects.addEventListener('click', () => {
      track.scrollBy({ left: 340, behavior: 'smooth' });
    });
  }

  // Modal Gallery Buttons
  const prevBtn = document.getElementById('galleryPrevBtn');
  const nextBtn = document.getElementById('galleryNextBtn');
  const closeBtn = document.getElementById('modalCloseBtn');
  const modalBackdrop = document.getElementById('projectModal');

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      if (!currentProject) return;
      currentImageIndex = (currentImageIndex - 1 + currentProject.images.length) % currentProject.images.length;
      updateModalImage();
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      if (!currentProject) return;
      currentImageIndex = (currentImageIndex + 1) % currentProject.images.length;
      updateModalImage();
    });
  }

  if (closeBtn) closeBtn.addEventListener('click', closeProjectModal);

  // Fermeture des modales au clic en dehors du conteneur
  document.querySelectorAll('.modal-backdrop').forEach(m => {
    m.addEventListener('click', (e) => {
      if (e.target === m) {
        m.classList.remove('open');
        document.body.style.overflow = '';
        currentProject = null;
      }
    });
  });

  // Clavier (Échap, Flèches)
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal-backdrop').forEach(m => m.classList.remove('open'));
      document.body.style.overflow = '';
      currentProject = null;
    } else if (currentProject) {
      if (e.key === 'ArrowRight') {
        currentImageIndex = (currentImageIndex + 1) % currentProject.images.length;
        updateModalImage();
      } else if (e.key === 'ArrowLeft') {
        currentImageIndex = (currentImageIndex - 1 + currentProject.images.length) % currentProject.images.length;
        updateModalImage();
      }
    }
  });

  // Dynamic Glassmorphic Spotlight Sheen Effect
  const bentoCards = document.querySelectorAll('.bento-box, .stat-pill-item, .project-bento-item');
  bentoCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });
  });
}

if (document.getElementById('projectsTrack')) {
  initApp();
} else if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}


