/**
 * CarouselManager - Gestion du carousel custom
 * 
 * Fonctionnalités:
 * - Navigation au clic sur les boutons précédent/suivant
 * - Indicateurs cliquables
 * - Accessibilité clavier et ARIA
 */

class CarouselManager {
    /**
     * Constructeur - Initialise le carousel
     * @param {string} containerSelector - Sélecteur du conteneur carousel
     */
    constructor(containerSelector = '.carousel-container') {
        this.container = document.querySelector(containerSelector);
        if (!this.container) return;

        this.track = this.container.querySelector('.carousel-track');
        this.slides = Array.from(this.track.querySelectorAll('.carousel-slide'));
        this.prevBtn = this.container.querySelector('.carousel-prev');
        this.nextBtn = this.container.querySelector('.carousel-next');
        this.indicators = Array.from(document.querySelectorAll('.indicator'));

        this.currentIndex = 0;
        this.totalSlides = this.slides.length;

        this.init();
    }

    /**
     * Initialise les écouteurs d'événements
     */
    init() {
        // Boutons de navigation
        this.prevBtn?.addEventListener('click', () => this.previousSlide());
        this.nextBtn?.addEventListener('click', () => this.nextSlide());

        // Indicateurs
        this.indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => this.goToSlide(index));
        });

        // Navigation au clavier
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') this.previousSlide();
            if (e.key === 'ArrowRight') this.nextSlide();
        });
    }

    /**
     * Va au slide précédent
     */
    previousSlide() {
        this.currentIndex = (this.currentIndex - 1 + this.totalSlides) % this.totalSlides;
        this.updateCarousel();
    }

    /**
     * Va au slide suivant
     */
    nextSlide() {
        this.currentIndex = (this.currentIndex + 1) % this.totalSlides;
        this.updateCarousel();
    }

    /**
     * Va à un slide spécifique
     * @param {number} index - L'index du slide à afficher
     */
    goToSlide(index) {
        this.currentIndex = index;
        this.updateCarousel();
    }

    /**
     * Met à jour la position du carousel et les indicateurs
     */
    updateCarousel() {
        // Déplace la piste
        const offset = -this.currentIndex * 100;
        this.track.style.transform = `translateX(${offset}%)`;

        // Met à jour les indicateurs
        this.indicators.forEach((indicator, index) => {
            if (index === this.currentIndex) {
                indicator.classList.add('active');
                indicator.setAttribute('aria-current', 'true');
            } else {
                indicator.classList.remove('active');
                indicator.removeAttribute('aria-current');
            }
        });
    }
}

// Initialise le carousel au chargement du DOM
document.addEventListener('DOMContentLoaded', () => {
    new CarouselManager('.carousel-container');
});
