/**
 * FooterComponent - Web Component pour le pied de page
 * 
 * Contient les informations de copyright et un bouton "Retour en haut"
 * Le bouton apparaît/disparaît en fonction du scroll
 * Gère le scroll lisse vers le haut de la page
 */

class FooterComponent extends HTMLElement {
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
     * Lance le rendu du composant et la configuration du bouton "retour en haut"
     */
    connectedCallback() {
        this.render();
        this.setupBackToTop();
    }

    /**
     * Méthode de rendu - Crée la structure HTML du footer dans le Shadow DOM
     * Charge le CSS du composant via une balise <link>
     */
    render() {
        // Charge la feuille de styles du composant
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'js/web-components/footer/footer-component.css';
        this.shadowRoot.appendChild(link);

        // Styles internes minimalistes pour le Shadow DOM
        const style = document.createElement('style');
        style.textContent = `
            :host {
                display: block;
            }
        `;
        this.shadowRoot.appendChild(style);

        // Structure HTML du footer
        const template = document.createElement('div');
        template.innerHTML = `
            <footer role="contentinfo">
                <div class="container">
                    <p>Magic Home Service © 2026 - Eure-et-Loir</p>
                    <a href="#main-content" class="back-to-top" id="back-to-top" title="Revenir au début de la page">Retour en haut ↑</a>
                    <br/>
                    <br/>
                    <button id="install-app-btn" class="install-btn" title="Installer l'app sur votre appareil">📲 Installer l'app</button>
                </div>
            </footer>
        `;
        this.shadowRoot.appendChild(template);
    }

    /**
     * Configure la fonctionnalité "Retour en haut"
     * - Affiche/masque le bouton en fonction du scroll (à partir de 300px)
     * - Gère le clic pour scroller en douceur vers le haut
     */
    setupBackToTop() {
        const backToTop = this.shadowRoot.querySelector('.back-to-top');
        
        // Événement de scroll: affiche/masque le bouton
        window.addEventListener('scroll', () => {
            // Affiche le bouton si l'utilisateur a scrollé plus de 300px
            if (window.scrollY > 300) {
                backToTop.classList.add('visible');
            } else {
                backToTop.classList.remove('visible');
            }
        });

        // Au clic du bouton: scroll lisse vers le haut
        backToTop.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'  // Animation fluide
            });
        });
    }
}

// Enregistre le Web Component
customElements.define('footer-component', FooterComponent);
