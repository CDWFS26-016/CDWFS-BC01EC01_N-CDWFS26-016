# Magic Home Service - Site Professionnel

**Projet:** CDWFS BC01EC01_N° CDWFS26-016
**Candidat:** CDWFS26-016
**Sujet:** Nouveau site web sans framework html/css/js Magic Home Service (MHS) respectant normes d'a11y, ux, etc

---

## 📋 Table des matières

- [Vue d'ensemble](#vue-densemble)
- [Technologies](#technologies)
- [Architecture](#architecture)
- [Web Components](#web-components)
- [Structure du projet](#structure-du-projet)
- [Fonctionnalités](#fonctionnalités)
- [Installation & Déploiement](#installation--déploiement)
- [Accessibilité & SEO](#accessibilité--seo)
- [Performance](#performance)

---

## 🎯 Vue d'ensemble

Magic Home Service est un site professionnel moderne et responsive pour une entreprise de rénovation intérieure basée en Eure-et-Loir. Le site met en avant les services (peinture, isolation thermique, rénovation, enduits), les tarifs, les avis clients, et un système de contact/devis.

**Domaine:** devis-reno-concept.fr  
**Pages:** 4 pages principales + Web Components réutilisables

---

## 🛠️ Technologies

### Stack Frontend
- **HTML5** - Sémantique, microdata Schema.org, OpenGraph
- **CSS3** - Flexbox, Grid, Variables CSS, Responsive Design
- **JavaScript ES6+** - Vanilla JS (aucun framework)
- **Web Components** - Shadow DOM, Custom Elements

### Optimisations
- **Images:** Format AVIF moderne + fallback JPG
- **Responsive:** Mobile-first, breakpoints à 768px et 480px
- **Accessibilité:** WCAG 2.1 Level AA, ARIA labels, keyboard navigation

---

## 🏗️ Architecture

### Principes de conception

```
┌─────────────────────────────────────┐
│     pages HTML (4 pages)             │
├─────────────────────────────────────┤
│  Header (sticky) | Footer (sticky)  │
├─────────────────────────────────────┤
│    Web Components (Shadow DOM)       │
│  - header-component                 │
│  - footer-component                 │
│  - review-manager                   │
├─────────────────────────────────────┤
│  CSS Modularisé                     │
│  - style.css (global)               │
│  - prestation.css (page-specific)   │
│  - carousel.css (carousel)          │
│  - component.css (components)       │
├─────────────────────────────────────┤
│  JavaScript Vanilla                 │
│  - carousel.js (gestion carousel)   │
│  - script.js (formulaires)          │
│  - web-components/*.js              │
└─────────────────────────────────────┘
```

### Modèle de couleurs

```css
--primary-color: #2c3e50;    /* Bleu foncé */
--accent-color: #8b5cf6;     /* Violet */
--text-color: #333;          /* Texte sombre */
--text-light: #666;          /* Texte clair */
--bg-light: #f4f4f4;         /* Fond clair */
```

---

## 🧩 Web Components

### 1. HeaderComponent
**Fichier:** `js/web-components/header/header-component.js`

Composant réutilisable pour l'en-tête sticky avec navigation responsive.

```javascript
class HeaderComponent extends HTMLElement {
  // Shadow DOM mode: open
  // Features:
  // - Navigation horizontale (≥1024px)
  // - Menu burger animé (<1024px)
  // - Animation 3-barres ↔ croix
  // - Logo SVG
  // - Accessibilité ARIA
}
```

**Features:**
- Sticky positioning (z-index: 50)
- Navigation responsive avec breakpoint 1024px
- Animation burger menu (3 barres → croix)
- Encapsulation Shadow DOM complète
- Accessibilité: `aria-expanded`, `aria-controls`, keyboard support

**Utilisation:**
```html
<header-component></header-component>
<script src="js/web-components/header/header-component.js"></script>
```

---

### 2. FooterComponent
**Fichier:** `js/web-components/footer/footer-component.js`

Composant footer avec bouton "Retour en haut" (back-to-top).

**Features:**
- Sticky footer
- Bouton back-to-top visible après 300px de scroll
- Animation smooth scroll
- Accessibilité complète

---

### 3. ReviewManager
**Fichier:** `js/web-components/review/review-component.js`

Système complet de gestion des avis clients avec formulaire et affichage.

**Features:**
```javascript
// Formulaire avec validation en temps réel
- Nom, Prénom (min 2 caractères)
- Ville
- Note (1-5 étoiles)
- Avis (min 10 caractères, max 500)

// Affichage des avis
- Récupération depuis JSON (avis.json)
- Fallback localStorage
- Fallback AVIS_DATA global (avis-data.js)

// Données persistantes
- localStorage: "reviews-json" (données JSON)
- localStorage: "reviews-new" (avis utilisateurs)

// Accessibilité
- ARIA labels, roles, live regions
- XSS protection (escapeHtml)
- Keyboard navigation
- Focus management
```

**Shadow DOM:**
- Styles encapsulés (form-related CSS)
- Centrage horizontal avec max-width: min(800px, 70%)
- Responsive 100% sur mobile

---

## 📁 Structure du projet

```
CDWFS_BC01EC01_N_CDWFS26_016/
│
├── 📄 HTML Pages
│   ├── index.html           (Homepage avec hero, services, pricing)
│   ├── prestation.html      (Services détaillés + carousel + vidéo)
│   ├── avis.html            (Page avis dédiée)
│   └── contact.html         (Formulaire contact)
│
├── 🎨 CSS/
│   ├── style.css            (440+ lines - styles globaux)
│   ├── prestation.css       (Styles page prestation, table tarifs)
│   └── carousel.css         (Carousel + vidéo)

│
├── ⚙️ JavaScript/
│   ├── script.js            (Validation formulaires contact)
│   ├── carousel.js          (Gestion carousel custom)
│   ├── avis-data.js         (Données avis fallback)
│   │
│   └── web-components/
│       ├── header/
│       │   ├── header-component.js
│       │   └── header-component.css
│       ├── footer/
│       │   ├── footer-component.js
│       │   └── footer-component.css
│       └── review/
│           ├── review-component.js
│           ├── review-component.css
│           └── ../json/
│               └── avis.json        (Données avis)
│
├── 🖼️ Images/
│   ├── logo.svg             (Logo vectoriel coloré)
│   ├── logo-old.jpg
│   ├── exemple01.avif       (Services - Rénovation)
│   ├── exemple02.avif       (Services - Peinture)
│   ├── exemple03.avif       (Services - Isolation)
│   ├── exemple04.jpg        (Services - Enduits)
│   ├── img01.avif
│   ├── img02.jpg, img03.avif
│   └── imgbanner.jpg        (Poster vidéo)
│
├── 🎬 Video/
│   └── vid.mp4              (Vidéo présentation)
│
├── .gitignore              (Exclusions Git)
└── README.md               (Ce fichier)
```

---

## ✨ Fonctionnalités

### Pages

#### 1️⃣ **index.html** - Homepage
- Hero section avec CTA
- Grille 4 services avec images AVIF (pas toutes)
- Section tarifs (4 cartes)
- CTA "Études-Conseils-Devis-Expertise"
- Section avis/contact fusionnée (2 blocs 50%)
- SEO: Canonical, OG tags, JSON-LD LocalBusiness

#### 2️⃣ **prestation.html** - Services détaillés
- 4 cartes services détaillées (avec listes)
- Table tarifs détaillée (7 lignes de services)
- **Carousel custom** (4 images):
  - Navigation boutons (❮/❯)
  - Indicateurs cliquables
  - Keyboard navigation (flèches)
  - Responsive: 400px → 280px → 220px
- **Vidéo**:
  - Contrôles HTML5
  - Poster imgbanner.jpg
  - Crop hauteur 500px → 350px → 250px
- Section avis/contact (2 blocs)

#### 3️⃣ **avis.html** - Reviews
- Page dédiée aux avis
- Web Component review-manager
- Formulaire + liste d'avis
- CTA contact simple

#### 4️⃣ **contact.html** - Formulaire contact
- Formulaire 6 champs:
  - Email, Téléphone, Nom
  - Sujet (select dropdown)
  - Message (textarea 1000 caractères)
- Validation en temps réel + blur
- Compteur caractères dynamique
- **Coordonnées minimalistes** (bordure simple):
  - Zone d'intervention
  - Téléphone
  - Email
  - Instagram

---

### Formulaires

#### Contact (script.js)
```javascript
Validation:
- Email: format valide
- Téléphone: 10+ chiffres
- Nom: 2+ caractères
- Sujet: obligatoire
- Message: 10-1000 caractères

UX:
- Validation au blur + submit
- Compteur caractères live
- Messages feedback (success/error/loading)
- Auto-reset après succès
- ARIA live regions
```

#### Avis (review-component.js)
```javascript
Validation:
- Nom/Prénom: 2+ caractères
- Ville: 2+ caractères
- Note: 1-5
- Avis: 10-500 caractères

Persistance:
- localStorage "reviews-json" (données JSON)
- localStorage "reviews-new" (nouveaux avis)

Affichage:
- Fusion avis JSON + utilisateurs
- XSS protection (escapeHtml)
- Formatage dates FR (toLocaleDateString)
```

---

### Carousel Custom
**Fichier:** `js/carousel.js`

```javascript
Features:
- Classe CarouselManager
- Navigation: prev/next buttons, indicateurs cliquables
- Keyboard: flèches gauche/droite
- Accessibilité: ARIA labels, roles, focus management
- Responsive: 400px → 280px → 220px

Méthodes publiques:
- previousSlide()
- nextSlide()
- goToSlide(index)
- updateCarousel()
```

---

## 🌐 Pages & Navigation

### Structure des URLs
```
/ (index.html)
├── #services     (section services)
├── #tarifs       (section tarifs)
├── #avis-home    (section avis)
└── #contact      (CTA contact)

/prestation.html
├── Services détaillés
├── Carousel
├── Vidéo
├── Avis/Contact
└── Footer

/avis.html
├── Page dédiée avis
├── Formulaire + liste
└── CTA Contact

/contact.html
├── Formulaire contact
└── Coordonnées minimalistes
```

### Menu Navigation
```
Services (→ index.html#services)
Tarifs (→ index.html#tarifs)
Prestations (→ prestation.html)
Avis (→ avis.html)
Contact (→ contact.html)
```

---

## ♿ Accessibilité & SEO

### Accessibilité (WCAG 2.1 Level AA)

**HTML5 Sémantique:**
- `<main>`, `<section>`, `<article>`, `<nav>`, `<header>`, `<footer>`
- Headings hierarchy (h1 → h6)
- Skip link (`.skip-link`)

**ARIA:**
- `aria-label` sur boutons, icônes
- `aria-expanded` (menu burger)
- `aria-controls` (relations)
- `aria-live="polite"` (messages formulaire)
- `role="alert"` (erreurs)
- `role="status"` (feedback)

**Keyboard Navigation:**
- Focus visible: 2px outline violet
- Tab order logique
- Flèches carousel (ArrowLeft/ArrowRight)
- Enter sur boutons/links

**Images:**
- Alt text descriptif sur toutes les images
- Format moderne AVIF (compression)
- Taille optimisée (200px services)

### SEO

**On-Page:**
- Canonical URLs sur toutes les pages
- Meta descriptions (155-160 caractères)
- Meta keywords pertinents
- OpenGraph tags (og:title, og:description, og:image, og:url)
- Twitter Card (twitter:card, title, description, image)

**Structured Data (JSON-LD):**
```json
{
  "@type": "LocalBusiness",
  "name": "Magic Home Service",
  "telephone": "+33612345678",
  "email": "contact@devis-reno-concept.fr",
  "url": "https://devis-reno-concept.fr",
  "address": {
    "@type": "PostalAddress",
    "addressRegion": "Eure-et-Loir"
  },
  "aggregateRating": {
    "ratingValue": "4.8",
    "ratingCount": "5"
  }
}
```

**Technique:**
- Responsive design (Mobile-first)
- Page speed: AVIF images, CSS minified ready
- Clean URLs
- Structured navigation
- Sitemap-ready structure

---

## 📊 Performance

### Images
- **Format:** AVIF (moderne, compressé) + fallback JPG
- **Services:** 200px height, object-fit: cover
- **Carousel:** 400px responsive
- **Vidéo poster:** imgbanner.jpg

### CSS
- **Modularisé:** style.css (global) + page-specific
- **CSS Variables:** Maintenance facile
- **Responsive:** Mobile-first design
- **Critical:** Inlined dans Shadow DOM

### JavaScript
- **Vanilla JS:** Zéro dépendance
- **Asynchrone:** Chargement défér
- **Web Components:** Lazy loading possible
- **Minifiable:** Prêt pour minification

### Responsive Breakpoints
```css
Desktop:  ≥1024px  (navigation horizontale)
Tablet:   768px    (formulaire 100%, carousel 280px)
Mobile:   480px    (boutons 100%, vidéo 250px)
```

---

## 🚀 Installation

### Installation locale

```bash
# 1. Cloner ou télécharger le projet
git clone [repo]
cd CDWFS_BC01EC01_N_CDWFS26_016

# 2. Accéder
"Juste lancer index.html"
```

---

## 📄 Fichiers Clés

| Fichier | Utilité |
|---------|---------|
| `style.css` | Styles globaux |
| `header-component.js` | Navigation sticky + menu burger |
| `review-component.js` | Système complet avis |
| `carousel.js` | Carrousel custom |
| `script.js` | Validation formulaires |
| `prestation.css` | Styles page prestation |
| `carousel.css` | Styles carousel + vidéo |

---

## 🔍 Références Techniques

### Web Components utilisés
1. **HeaderComponent** - Navigation responsive
2. **FooterComponent** - Footer sticky
3. **ReviewManager** - Système avis complet

### APIs utilisées
- Fetch API (chargement JSON avis)
- localStorage (persistance données)
- FormData API (gestion formulaires)
- Document API (manipulation DOM)

### Patterns
- Shadow DOM (encapsulation styles)
- Custom Elements (composants réutilisables)
- Module pattern (organisation code)
- Observer pattern (carousel navigation)

---

## 📋 Checklist Qualité

- ✅ Responsive design (3 breakpoints)
- ✅ Accessibilité WCAG AA
- ✅ SEO optimisé (canonical, OG, JSON-LD)
- ✅ Web Components réutilisables
- ✅ Formulaires validés
- ✅ Images optimisées (AVIF) (pas toutes)
- ✅ Aucune dépendance externe
- ✅ Code commenté en français
- ✅ .gitignore configuré
- ✅ Carousel custom
- ✅ Vidéo HTML5
- ✅ Avis persistants (localStorage)

---

## 📧 Support & Maintenance

Pour toute question ou modification du projet **CDWFS26-016**, consulter la documentation technique dans les commentaires du code (francais).

---

## Notes PWA

Quelques fichiers de tentatives de mise en place PWA sont intégrés et non référencés dans ce document
Leur mise en place était un test sur quelques minutes uniquement
La liste est :
- `manifest.json`
- `service-worker.js`
- `js/pwa-install.js`

---

**Dernière mise à jour:** 8 janvier 2026  

