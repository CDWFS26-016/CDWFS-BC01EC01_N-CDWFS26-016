/**
 * Script PWA - Gère l'installation de l'app
 * 
 * - Enregistre le Service Worker
 * - Gère le bouton d'installation personnalisé
 * - Écoute l'événement beforeinstallprompt
 */

let deferredPrompt = null;
const installButton = document.getElementById('install-app-btn');

/* ===========================
   ENREGISTREMENT SERVICE WORKER
   =========================== */

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js')
      .then((registration) => {
        console.log('Service Worker enregistré:', registration);
      })
      .catch((error) => {
        console.error('Service Worker - Erreur:', error);
      });
  });
}

/* ===========================
   GESTION DE L'INSTALLATION PWA
   =========================== */

// Événement: avant que le navigateur affiche le prompt d'installation
window.addEventListener('beforeinstallprompt', (event) => {
  // Empêche le prompt automatique du navigateur
  event.preventDefault();
  
  // Sauvegarde l'événement pour l'utiliser plus tard
  deferredPrompt = event;
  
  // Affiche le bouton d'installation personnalisé
  if (installButton) {
    installButton.style.display = 'inline-block';
  }
});

// Événement: clique sur le bouton d'installation personnalisé
if (installButton) {
  installButton.addEventListener('click', async () => {
    if (!deferredPrompt) {
      return;
    }

    // Affiche le prompt d'installation natif du navigateur
    deferredPrompt.prompt();
    
    // Attend la réponse de l'utilisateur
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`Installation PWA: ${outcome}`);
    
    // Réinitialise et masque le bouton
    deferredPrompt = null;
    if (installButton) {
      installButton.style.display = 'none';
    }
  });
}

// Événement: app installée avec succès
window.addEventListener('appinstalled', () => {
  console.log('App installée avec succès');
  if (installButton) {
    installButton.style.display = 'none';
  }
});
