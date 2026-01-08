/**
 * ReviewManager - Web Component pour le système d'avis clients
 * 
 * Fonctionnalités:
 * - Formulaire pour soumettre des avis avec validation
 * - Affichage des avis depuis un fichier JSON (avec fallback localStorage)
 * - Persistance des nouveaux avis dans localStorage
 * - Gestion des erreurs avec messages d'accessibilité
 * - Compteur de caractères pour le textarea
 */

class ReviewManager extends HTMLElement {
    /**
     * Constructeur du composant
     * Initialise le Shadow DOM et les propriétés
     */
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.formElement = null;
        this.reviewsListElement = null;
        this.feedbackElement = null;
        this.dataFile = 'js/json/avis.json';
    }

    /**
     * Appelé automatiquement quand l'élément est inséré dans le DOM
     * Récupère les attributs et initialise le composant
     */
    connectedCallback() {
        // Récupère les attributs optionnels du composant
        this.formId = this.getAttribute('form-id');
        this.listId = this.getAttribute('list-id');
        this.feedbackId = this.getAttribute('feedback-id');
        // Utilise l'attribut data-file ou la valeur par défaut
        this.dataFile = this.getAttribute('data-file') || 'js/json/avis.json';

        // Lance le processus d'initialisation
        this.render();
        this.initializeElements();
        this.initializeAndLoadReviews();
    }

    /**
     * Méthode de rendu - Crée la structure HTML du composant dans le Shadow DOM
     */
    render() {
        // Charge la feuille de styles du composant
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'js/web-components/review/review-component.css';
        this.shadowRoot.appendChild(link);

        // Styles internes minimalistes pour le Shadow DOM
        const style = document.createElement('style');
        style.textContent = `
            :host {
                display: block;
            }
        `;
        this.shadowRoot.appendChild(style);

        // Structure HTML du composant
        const template = document.createElement('div');
        template.innerHTML = `
            <!-- Conteneur du formulaire d'avis -->
            <div class="review-form-container">
                <h3>Partagez votre expérience</h3>
                <form class="review-form" novalidate>
                    <!-- Ligne 1: Nom et Prénom -->
                    <div class="form-row full-width-percentage">
                        <div class="form-group">
                            <label for="nom">Nom <span class="required">*</span></label>
                            <input type="text" id="nom" name="nom" required placeholder="Votre nom" maxlength="50" autocomplete="family-name">
                            <span class="error-message" role="alert"></span>
                        </div>
                        <div class="form-group">
                            <label for="prenom">Prénom <span class="required">*</span></label>
                            <input type="text" id="prenom" name="prenom" required placeholder="Votre prénom" maxlength="50" autocomplete="given-name">
                            <span class="error-message" role="alert"></span>
                        </div>
                    </div>

                    <!-- Ligne 2: Ville et Note -->
                    <div class="form-row full-width-percentage">
                        <div class="form-group">
                            <label for="ville">Ville <span class="required">*</span></label>
                            <input type="text" id="ville" name="ville" required placeholder="Votre ville" maxlength="50" autocomplete="address-level2">
                            <span class="error-message" role="alert"></span>
                        </div>
                        <div class="form-group">
                            <label for="note">Note <span class="required">*</span></label>
                            <select id="note" name="note" required>
                                <option value="">Sélectionnez une note</option>
                                <option value="5">⭐⭐⭐⭐⭐ Excellent (5/5)</option>
                                <option value="4">⭐⭐⭐⭐ Très bien (4/5)</option>
                                <option value="3">⭐⭐⭐ Bien (3/5)</option>
                                <option value="2">⭐⭐ Passable (2/5)</option>
                                <option value="1">⭐ Insuffisant (1/5)</option>
                            </select>
                            <span class="error-message" role="alert"></span>
                        </div>
                    </div>

                    <!-- Textarea pour l'avis -->
                    <div class="form-group full-width full-width-percentage">
                        <label for="avis">Votre avis <span class="required">*</span></label>
                        <textarea id="avis" name="avis" required placeholder="Décrivez votre expérience avec nos services..." rows="5" maxlength="500"></textarea>
                        <span class="char-count">0/500</span>
                        <span class="error-message" role="alert"></span>
                    </div>

                    <!-- Bouton d'envoi et zone de feedback -->
                    <button type="submit" class="btn-submit">Ajouter mon avis</button>
                    <div class="form-feedback" role="status" aria-live="polite"></div>
                </form>
            </div>

            <!-- Conteneur de la liste des avis -->
            <div class="reviews-list-container">
                <h3>Avis de nos clients</h3>
                <div class="reviews-list">
                    <p class="loading">Chargement des avis...</p>
                </div>
            </div>
        `;
        this.shadowRoot.appendChild(template);
    }

    /**
     * Initialise les éléments du DOM et attache les écouteurs d'événements
     */
    initializeElements() {
        const form = this.shadowRoot.querySelector('.review-form');
        this.formElement = form;
        this.reviewsListElement = this.shadowRoot.querySelector('.reviews-list');
        this.feedbackElement = this.shadowRoot.querySelector('.form-feedback');

        // Attache les écouteurs du formulaire
        this.attachFormListener();

        // Compteur de caractères pour le textarea
        const textarea = form.querySelector('textarea[name="avis"]');
        if (textarea) {
            textarea.addEventListener('input', (e) => {
                const count = e.target.value.length;
                const counter = form.querySelector('.char-count');
                if (counter) {
                    counter.textContent = `${count}/500`;
                }
            });
        }
    }

    /**
     * Attache les écouteurs d'événements du formulaire
     * - Soumission du formulaire
     * - Validation en temps réel au blur des champs
     */
    attachFormListener() {
        this.formElement.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleFormSubmit();
        });

        // Validation au blur de chaque champ
        const inputs = this.formElement.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
        });
    }

    /**
     * Valide un champ du formulaire
     * @param {HTMLElement} field - Le champ à valider
     * @returns {boolean} true si valide, false sinon
     */
    validateField(field) {
        const errorElement = field.parentElement.querySelector('.error-message');
        let isValid = true;
        let errorMsg = '';

        // Validation du champ vide
        if (!field.value.trim()) {
            isValid = false;
            errorMsg = 'Ce champ est obligatoire';
        } 
        // Validation du nom et prénom (minimum 2 caractères)
        else if (field.name === 'nom' || field.name === 'prenom') {
            if (field.value.trim().length < 2) {
                isValid = false;
                errorMsg = 'Minimum 2 caractères requis';
            }
        } 
        // Validation de la ville
        else if (field.name === 'ville') {
            if (field.value.trim().length < 2) {
                isValid = false;
                errorMsg = 'Veuillez entrer une ville valide';
            }
        } 
        // Validation de l'avis (minimum 10 caractères)
        else if (field.name === 'avis') {
            if (field.value.trim().length < 10) {
                isValid = false;
                errorMsg = 'L\'avis doit contenir au moins 10 caractères';
            }
        }

        // Affiche/masque les erreurs
        if (!isValid) {
            field.classList.add('error');
            if (errorElement) {
                errorElement.textContent = errorMsg;
            }
        } else {
            field.classList.remove('error');
            if (errorElement) {
                errorElement.textContent = '';
            }
        }

        return isValid;
    }

    /**
     * Valide tous les champs du formulaire
     * @returns {boolean} true si le formulaire est valide, false sinon
     */
    validateForm() {
        const inputs = this.formElement.querySelectorAll('input[required], textarea[required], select[required]');
        let isValid = true;

        inputs.forEach(input => {
            if (!this.validateField(input)) {
                isValid = false;
            }
        });

        return isValid;
    }

    /**
     * Gère la soumission du formulaire
     * Valide le formulaire et envoie les données
     */
    handleFormSubmit() {
        if (!this.validateForm()) {
            this.showFeedback('Veuillez corriger les erreurs du formulaire.', 'error');
            return;
        }

        this.showFeedback('Envoi de votre avis...', 'loading');

        const formData = new FormData(this.formElement);
        const reviewData = {
            nom: formData.get('nom'),
            prenom: formData.get('prenom'),
            ville: formData.get('ville'),
            avis: formData.get('avis'),
            note: formData.get('note'),
            date: new Date().toLocaleDateString('fr-FR')
        };

        // Envoie les données (simulation AJAX)
        this.sendReview(reviewData);
    }

    /**
     * Envoie les données de l'avis au serveur (simulation)
     * Sauvegarde dans localStorage et rechargement de la liste
     * @param {Object} reviewData - Les données de l'avis
     */
    async sendReview(reviewData) {
        try {
            // Simulation du délai d'envoi réseau
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Récupère les avis existants du localStorage
            let newReviews = JSON.parse(localStorage.getItem('reviews-new')) || [];
            
            // Ajoute le nouvel avis au début de la liste
            newReviews.unshift(reviewData);
            
            // Sauvegarde dans localStorage
            localStorage.setItem('reviews-new', JSON.stringify(newReviews));

            // Affiche un message de succès
            this.showFeedback('Merci ! Votre avis a été ajouté avec succès.', 'success');
            
            // Réinitialise le formulaire
            this.formElement.reset();

            // Réinitialise le compteur de caractères
            const counter = this.formElement.querySelector('.char-count');
            if (counter) counter.textContent = '0/500';

            // Recharge la liste des avis
            this.loadReviews();
        } catch (error) {
            console.error('Erreur lors de l\'envoi:', error);
            this.showFeedback('Erreur lors de l\'envoi. Veuillez réessayer.', 'error');
        }
    }

    /**
     * Initialise le chargement des avis depuis le fichier JSON
     * Avec fallback sur localStorage si le fichier n'est pas disponible
     */
    async initializeAndLoadReviews() {
        try {
            // Essaie de charger les avis depuis le fichier JSON
            const response = await fetch(this.dataFile);
            if (!response.ok) throw new Error('Erreur lors du chargement');
            const jsonReviews = await response.json();
            // Sauvegarde en cache dans localStorage
            localStorage.setItem('reviews-json', JSON.stringify(jsonReviews));
        } catch (error) {
            console.error('Erreur lors du chargement des avis JSON:', error);

            // Fallback: utilise les données depuis avis-data.js (variable globale)
            if (typeof window.AVIS_DATA !== 'undefined') {
                console.log('Utilisation du fallback AVIS_DATA');
                localStorage.setItem('reviews-json', JSON.stringify(window.AVIS_DATA));
            } else if (!localStorage.getItem('reviews-json')) {
                console.warn('Impossible de charger avis.json et AVIS_DATA non disponible');
            }
        }

        // Charge et affiche les avis
        this.loadReviews();
    }

    /**
     * Charge les avis depuis localStorage et les affiche
     */
    loadReviews() {
        this.showLoadingState();

        // Délai pour la transition visuelle
        setTimeout(() => {
            try {
                // Récupère les avis du fichier JSON (en cache)
                const jsonReviews = JSON.parse(localStorage.getItem('reviews-json')) || [];
                
                // Récupère les nouveaux avis ajoutés par les utilisateurs
                const newReviews = JSON.parse(localStorage.getItem('reviews-new')) || [];
                
                // Fusionne les deux: nouveaux avis en premier, puis avis du JSON
                const allReviews = [...newReviews, ...jsonReviews];
                
                // Affiche les avis
                this.displayReviews(allReviews);
            } catch (error) {
                console.error('Erreur lors du chargement des avis:', error);
                this.reviewsListElement.innerHTML = '<div class="no-reviews">Erreur lors du chargement des avis.</div>';
            }
        }, 300);
    }

    /**
     * Affiche la liste des avis à l'écran
     * @param {Array} reviews - Tableau des avis à afficher
     */
    displayReviews(reviews) {
        // Si pas d'avis, affiche un message
        if (!reviews || reviews.length === 0) {
            this.reviewsListElement.innerHTML = '<div class="no-reviews">Aucun avis pour le moment. Soyez le premier à partager votre expérience !</div>';
            return;
        }

        // Génère le HTML pour chaque avis
        this.reviewsListElement.innerHTML = reviews.map(review => `
            <div class="review-card">
                <div class="review-header">
                    <div>
                        <div class="review-author">${this.escapeHtml(review.prenom)} ${this.escapeHtml(review.nom)}</div>
                        <div class="review-location">📍 ${this.escapeHtml(review.ville)}</div>
                    </div>
                    <div>
                        <div class="review-rating">${this.getStarRating(review.note)}</div>
                        <div class="review-date">${review.date}</div>
                    </div>
                </div>
                <div class="review-text">"${this.escapeHtml(review.avis)}"</div>
            </div>
        `).join('');
    }

    /**
     * Génère les étoiles à afficher selon la note
     * @param {number} note - La note (1-5)
     * @returns {string} Les étoiles en HTML
     */
    getStarRating(note) {
        const stars = '⭐';
        return stars.repeat(parseInt(note));
    }

    /**
     * Affiche un message de feedback utilisateur
     * @param {string} message - Le message à afficher
     * @param {string} type - Le type de message (success, error, loading)
     */
    showFeedback(message, type) {
        this.feedbackElement.textContent = message;
        this.feedbackElement.className = `form-feedback ${type}`;

        // Masque le message après 3 secondes (sauf pour "loading")
        if (type !== 'loading') {
            setTimeout(() => {
                this.feedbackElement.className = 'form-feedback';
            }, 3000);
        }
    }

    /**
     * Affiche un état de chargement
     */
    showLoadingState() {
        this.reviewsListElement.innerHTML = '<p class="loading">Chargement des avis...</p>';
    }

    /**
     * Échappe les caractères HTML pour éviter les injections XSS
     * @param {string} text - Le texte à échapper
     * @returns {string} Le texte échappé
     */
    escapeHtml(text) {
        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };
        return text.replace(/[&<>"']/g, m => map[m]);
    }
}

// Enregistre le Web Component
customElements.define('review-manager', ReviewManager);
