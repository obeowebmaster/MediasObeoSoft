document.addEventListener('DOMContentLoaded', () => {
    let modal;
    let currentGallery = [];
    let currentIndex = 0;

    // Fonction pour créer dynamiquement le modal au moment du clic
    function createModal() {
        const modalHTML = `
        <div id="modal" class="modal">
            <div class="modal-content">
                <span class="close">&times;</span>
                <div class="media-container">
                    <img id="modal-image" src="" alt="Media">
                    <video id="modal-video" controls>
                        <source id="video-source" src="" type="video/mp4">
                        Your browser does not support the video tag.
                    </video>
                </div>
                <div class="modal-info">
                    <div class="modal-text">
                        <h3 id="modal-title"></h3>
                        <p id="modal-description"></p>
                    </div>
                    <div class="modal-position">
                        <span id="modal-position"></span>
                    </div>
                </div>
                <div class="arrow arrow-left" id="prev">&#10094;</div>
                <div class="arrow arrow-right" id="next">&#10095;</div>
            </div>
        </div>`;

        document.body.insertAdjacentHTML('beforeend', modalHTML);

        // Récupère les éléments du modal
        modal = document.getElementById('modal');
        const closeBtn = modal.querySelector('.close');
        const nextBtn = modal.querySelector('#next');
        const prevBtn = modal.querySelector('#prev');

        // Ajoute les écouteurs pour fermer et naviguer
        closeBtn.addEventListener('click', closeModal);
        nextBtn.addEventListener('click', showNext);
        prevBtn.addEventListener('click', showPrev);

        window.addEventListener('keydown', keyboardNavigation);
        window.addEventListener('click', outsideClick);
    }

    // Fonction pour mettre à jour le contenu du modal avec l'élément courant
    function updateModalContent(type, src, title, description) {
        const modalImage = modal.querySelector('#modal-image');
        const modalVideo = modal.querySelector('#modal-video');
        const videoSource = modal.querySelector('#video-source');
        const modalTitle = modal.querySelector('#modal-title');
        const modalDescription = modal.querySelector('#modal-description');
        const modalPosition = modal.querySelector('#modal-position');

        modalTitle.textContent = title;
        modalDescription.textContent = description;

        // Mise à jour de la position
        modalPosition.textContent = `${currentIndex + 1} / ${currentGallery.length}`;

        if (type === 'image') {
            modalImage.src = src;
            modalImage.style.display = 'block';
            modalVideo.style.display = 'none';
        } else if (type === 'video') {
            videoSource.src = src;
            modalVideo.load();
            modalVideo.style.display = 'block';
            modalImage.style.display = 'none';
        }

        modal.style.display = 'block'; // Affiche le modal
    }

    // Ouvre le modal pour l'élément à l'index courant
    function openModal(index) {
        currentIndex = index;
        const currentThumb = currentGallery[currentIndex];

        if (!currentThumb) {
            console.error('Élément introuvable dans la galerie actuelle à l\'index ' + index);
            return;
        }

        const type = currentThumb.getAttribute('data-type');
        const src = currentThumb.getAttribute('data-src');
        const title = currentThumb.getAttribute('data-title');
        const description = currentThumb.getAttribute('data-description');

        // Si le modal n'a pas encore été créé, on le crée
        if (!modal) {
            createModal();
        }

        // Met à jour le contenu du modal
        updateModalContent(type, src, title, description);
    }

    // Navigation vers l'élément suivant
    function showNext() {
        currentIndex = (currentIndex + 1) % currentGallery.length;
        openModal(currentIndex);
    }

    // Navigation vers l'élément précédent
    function showPrev() {
        currentIndex = (currentIndex - 1 + currentGallery.length) % currentGallery.length;
        openModal(currentIndex);
    }

    // Ferme le modal et le supprime du DOM
    function closeModal() {
        modal.style.display = 'none'; // Cache le modal
        modal.remove(); // Supprime le modal du DOM
        modal = null; // Réinitialise la variable modal
        window.removeEventListener('keydown', keyboardNavigation);
        window.removeEventListener('click', outsideClick);
    }

    // Ferme le modal si l'utilisateur clique à l'extérieur
    function outsideClick(e) {
        if (e.target === modal) {
            closeModal();
        }
    }

    // Navigation via le clavier
    function keyboardNavigation(e) {
        if (modal && modal.style.display === 'block') {
            if (e.key === 'ArrowRight') {
                showNext();
            } else if (e.key === 'ArrowLeft') {
                showPrev();
            } else if (e.key === 'Escape') {
                closeModal();
            }
        }
    }

    // Définit la galerie active (groupe)
    function setCurrentGallery(galleryElement) {
        currentGallery = Array.from(galleryElement.querySelectorAll('.thumb'));
    }

    // Initialise les événements pour les vignettes (thumbnails)
    document.querySelectorAll('.thumb').forEach((thumb) => {
        thumb.addEventListener('click', (e) => {
            const galleryElement = e.currentTarget.closest('.gallery'); // Trouve la galerie parent
            setCurrentGallery(galleryElement); // Définit la galerie active
            const galleryIndex = currentGallery.indexOf(e.currentTarget); // Trouve l'index de l'élément cliqué
            openModal(galleryIndex); // Ouvre le modal avec cet index
        });
    });
});
