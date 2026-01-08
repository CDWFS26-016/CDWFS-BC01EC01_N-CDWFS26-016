/**
 * HeaderComponent - Web Component pour l'en-tête et la navigation
 * 
 * Utilise le Shadow DOM pour encapsuler les styles et la structure
 * Responsive:
 * - Écran >= 1024px: Navigation horizontale normale
 * - Écran < 1024px: Menu burger avec animation 3 barres <-> croix
 */

class HeaderComponent extends HTMLElement {
    /**
     * Constructeur du composant
     * Initialise le Shadow DOM en mode ouvert
     */
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    /**
     * Appelé automatiquement quand l'élément est inséré dans le DOM
     * Lance le rendu du composant et la configuration du menu toggle
     */
    connectedCallback() {
        this.render();
        this.setupMenuToggle();
    }

    /**
     * Méthode de rendu - Crée la structure HTML du header dans le Shadow DOM
     * Charge le CSS du composant via une balise <link>
     */
    render() {
        // Charge la feuille de styles du composant
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'js/web-components/header/header-component.css';
        this.shadowRoot.appendChild(link);

        // Styles internes minimalistes pour le Shadow DOM
        const style = document.createElement('style');
        style.textContent = `
            :host {
                display: block;
            }
        `;
        this.shadowRoot.appendChild(style);

        // Structure HTML du header
        const template = document.createElement('div');
        template.innerHTML = `
            <header role="banner">
                <div class="container header-flex">
                    <!-- Logo et marque -->
                    <div class="logo">
                        <a href="index.html">
                            <img src="img/logo.svg" alt="Magic Home Service - Logo" class="logo-svg">
                        </a>
                    </div>
                    
                    <!-- Bouton burger menu (toujours visible) -->
                    <button class="menu-toggle" aria-expanded="false" aria-controls="main-nav" aria-label="Ouvrir le menu de navigation">
                        <span class="hamburger"></span>
                    </button>

                    <!-- Navigation - Affichée/cachée selon la taille d'écran et l'état du menu -->
                    <nav id="main-nav" role="navigation" aria-label="Menu principal" class="nav-menu">
                        <ul>
                            <li><a href="index.html#services">Services</a></li>
                            <li><a href="index.html#tarifs">Tarifs</a></li>
                            <li><a href="prestation.html">Prestations</a></li>
                            <li><a href="avis.html">Avis</a></li>
                            <li><a href="contact.html">Contact</a></li>
                        </ul>
                    </nav>
                </div>
            </header>
        `;
        this.shadowRoot.appendChild(template);
    }

    /**
     * Configure les événements du bouton burger menu
     * Gère le toggle de la classe "is-active" pour l'animation
     * Ferme aussi le menu au clic sur un lien de navigation
     */
    setupMenuToggle() {
        // Sélection des éléments du Shadow DOM
        const menuToggle = this.shadowRoot.querySelector('.menu-toggle');
        const nav = this.shadowRoot.querySelector('.nav-menu');

        // Au clic du bouton burger
        menuToggle.addEventListener('click', () => {
            // Bascule l'état aria-expanded pour l'accessibilité
            const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
            menuToggle.setAttribute('aria-expanded', !isExpanded);
            
            // Ajoute/retire les classes pour afficher/masquer le menu et déclencher l'animation
            nav.classList.toggle('is-open');
            menuToggle.classList.toggle('is-active');
        });

        // Ferme le menu au clic sur un lien de navigation
        const navLinks = this.shadowRoot.querySelectorAll('nav a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                // Réinitialise l'état du menu
                menuToggle.setAttribute('aria-expanded', 'false');
                nav.classList.remove('is-open');
                menuToggle.classList.remove('is-active');
            });
        });
    }
}

// Enregistre le Web Component
customElements.define('header-component', HeaderComponent);
