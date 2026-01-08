/**
 * Script principal - Initialisation et gestion des éléments globaux
 * 
 * Ce fichier gère:
 * - L'initialisation au chargement de la page
 * - Les écouteurs d'événements pour les formulaires
 * - Les interactions non couvertes par les Web Components
 */

// Attendre que le DOM soit complètement chargé
document.addEventListener('DOMContentLoaded', () => {
        
    /* ===========================
       FORMULAIRE DE CONTACT
       (S'il existe sur la page)
       =========================== */
    
    const contactForm = document.querySelector('#contact-form');
    const feedback = document.querySelector('#form-feedback');

    if (contactForm) {
        /**
         * Valide un seul champ du formulaire
         * Affiche le message d'erreur si invalide
         * @param {HTMLElement} field - Le champ à valider
         * @returns {boolean} true si valide
         */
        const validateField = (field) => {
            const errorMessage = field.parentElement.querySelector('.error-message');
            const value = field.value.trim();
            let isValid = true;
            let errorText = "";

            switch (field.type) {
                case 'email':
                    // Validation email (RFC 5322 simplifiée)
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    isValid = emailRegex.test(value);
                    errorText = "Veuillez entrer une adresse email valide.";
                    break;
                case 'tel':
                    // Validation téléphone (minimum 10 chiffres)
                    const phoneRegex = /^\d{10,}$/;
                    isValid = phoneRegex.test(value.replace(/\s|-|\.|\(/g, ''));
                    errorText = "Veuillez entrer un numéro valide (minimum 10 chiffres).";
                    break;
                case 'text':
                    // Validation nom (minimum 2 caractères)
                    isValid = value.length >= 2;
                    errorText = "Veuillez entrer un nom valide (minimum 2 caractères).";
                    break;
                case 'select-one':
                    // Validation select
                    isValid = field.value !== "";
                    errorText = "Veuillez sélectionner une option.";
                    break;
                case 'textarea':
                    // Validation message (minimum 10 caractères)
                    isValid = value.length >= 10;
                    errorText = "Veuillez entrer un message (minimum 10 caractères).";
                    break;
                default:
                    isValid = value.length > 0;
                    errorText = "Ce champ est requis.";
            }

            // Affiche ou masque l'erreur
            if (!isValid && errorMessage) {
                field.classList.add('error');
                errorMessage.textContent = errorText;
            } else if (errorMessage) {
                field.classList.remove('error');
                errorMessage.textContent = "";
            }

            return isValid;
        };

        /**
         * Valide tous les champs du formulaire
         * @returns {boolean} true si tous les champs sont valides
         */
        const validateForm = () => {
            const fields = contactForm.querySelectorAll('[required]');
            let allValid = true;

            fields.forEach(field => {
                if (!validateField(field)) {
                    allValid = false;
                }
            });

            return allValid;
        };

        // Validation en temps réel lors de la sortie du champ
        contactForm.querySelectorAll('[required]').forEach(field => {
            field.addEventListener('blur', () => validateField(field));
        });

        // Compteur de caractères pour le textarea
        const messageField = document.querySelector('#message');
        if (messageField) {
            const charCount = document.querySelector('.char-count');
            messageField.addEventListener('input', () => {
                if (charCount) {
                    charCount.textContent = messageField.value.length + "/1000";
                }
            });
        }

        // Au clic du bouton soumettre
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // Valide tous les champs
            if (!validateForm()) {
                if (feedback) {
                    feedback.textContent = "Veuillez remplir tous les champs correctement.";
                    feedback.classList.add('error');
                    feedback.classList.remove('success', 'loading');
                }
                return;
            }

            // Affiche un message de chargement
            if (feedback) {
                feedback.textContent = "Envoi en cours...";
                feedback.classList.add('loading');
                feedback.classList.remove('success', 'error');
            }
            
            try {
                // Simulation du délai d'envoi réseau
                // En production, cela ferait un appel à une API
                setTimeout(() => {
                    if (feedback) {
                        feedback.textContent = "Merci ! Votre message a été envoyé avec succès. Nous vous recontacterons rapidement.";
                        feedback.classList.add('success');
                        feedback.classList.remove('loading', 'error');
                    }
                    // Réinitialise le formulaire
                    contactForm.reset();
                    // Réinitialise le compteur
                    const charCount = document.querySelector('.char-count');
                    if (charCount) {
                        charCount.textContent = "0/1000";
                    }
                }, 1000);
            } catch (error) {
                console.error('Erreur lors de l\'envoi du formulaire:', error);
                if (feedback) {
                    feedback.textContent = "Erreur lors de l'envoi. Veuillez réessayer.";
                    feedback.classList.add('error');
                    feedback.classList.remove('loading', 'success');
                }
            }
        });
    }

});