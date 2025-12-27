// Carregar galeria
function loadGallery() {
    const saved = localStorage.getItem('coupleGallery');
    if (saved) {
        const gallery = JSON.parse(saved);
        gallery.forEach((item, index) => {
            addGalleryItem(item.photo, item.caption, index);
        });
    }
}

// Adicionar item à galeria
function addGalleryItem(photoSrc, caption = '', index = null) {
    const grid = document.getElementById('galleryGrid');
    if (!grid) return;
    
    const item = document.createElement('div');
    item.className = 'gallery-item';
    item.dataset.index = index !== null ? index : grid.children.length;
    
    item.innerHTML = `
        <img src="${photoSrc}" alt="Foto do casal">
        <div class="gallery-item-caption">${caption || 'Sem legenda'}</div>
    `;
    
    item.addEventListener('click', function() {
        openPhotoModal(photoSrc, caption, item.dataset.index);
    });
    
    grid.appendChild(item);
    saveGallery();
}

// Upload de fotos
function handleGalleryUpload(event) {
    const files = Array.from(event.target.files);
    files.forEach(file => {
        const reader = new FileReader();
        reader.onload = function(e) {
            addGalleryItem(e.target.result);
        };
        reader.readAsDataURL(file);
    });
}

// Abrir modal de foto
function openPhotoModal(photoSrc, caption, index) {
    const modal = document.getElementById('photoModal');
    const modalPhoto = document.getElementById('modalPhoto');
    const photoCaption = document.getElementById('photoCaption');
    
    if (modal && modalPhoto && photoCaption) {
        modalPhoto.src = photoSrc;
        photoCaption.value = caption;
        photoCaption.dataset.index = index;
        modal.style.display = 'block';
    }
}

// Fechar modal de foto
function closePhotoModal() {
    const modal = document.getElementById('photoModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// Atualizar legenda da foto
function updatePhotoCaption() {
    const captionInput = document.getElementById('photoCaption');
    if (!captionInput) return;
    
    const index = captionInput.dataset.index;
    const gallery = JSON.parse(localStorage.getItem('coupleGallery') || '[]');
    
    if (gallery[index]) {
        gallery[index].caption = captionInput.value;
        localStorage.setItem('coupleGallery', JSON.stringify(gallery));
        
        // Atualizar na galeria
        const galleryItems = document.querySelectorAll('.gallery-item');
        if (galleryItems[index]) {
            const captionDiv = galleryItems[index].querySelector('.gallery-item-caption');
            if (captionDiv) {
                captionDiv.textContent = captionInput.value || 'Sem legenda';
            }
        }
    }
}

// Salvar galeria
function saveGallery() {
    const items = document.querySelectorAll('.gallery-item');
    const gallery = [];
    
    items.forEach(item => {
        const img = item.querySelector('img');
        const caption = item.querySelector('.gallery-item-caption');
        if (img) {
            gallery.push({
                photo: img.src,
                caption: caption ? caption.textContent : ''
            });
        }
    });
    
    localStorage.setItem('coupleGallery', JSON.stringify(gallery));
}

// Carregar ao iniciar
document.addEventListener('DOMContentLoaded', function() {
    loadGallery();
});

