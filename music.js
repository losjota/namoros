// Carregar músicas
function loadMusic() {
    const saved = localStorage.getItem('coupleMusic');
    if (saved) {
        const music = JSON.parse(saved);
        music.forEach((item, index) => {
            addMusicItem(item, index);
        });
    }
}

// Adicionar item de música
function addMusicItem(musicData, index = null) {
    const list = document.getElementById('musicList');
    if (!list) return;
    
    const item = document.createElement('div');
    item.className = 'music-item';
    item.dataset.index = index !== null ? index : list.children.length;
    
    let playerHTML = '';
    if (musicData.url) {
        if (musicData.url.includes('youtube.com') || musicData.url.includes('youtu.be')) {
            const videoId = extractYouTubeId(musicData.url);
            playerHTML = `<iframe width="100%" height="200" src="https://www.youtube.com/embed/${videoId}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
        } else {
            playerHTML = `<audio controls class="music-player"><source src="${musicData.url}" type="audio/mpeg">Seu navegador não suporta áudio.</audio>`;
        }
    } else if (musicData.file) {
        playerHTML = `<audio controls class="music-player"><source src="${musicData.file}" type="audio/mpeg">Seu navegador não suporta áudio.</audio>`;
    }
    
    item.innerHTML = `
        <div class="music-header">
            <div>
                <div class="music-title">${musicData.title}</div>
                <div class="music-artist">${musicData.artist}</div>
            </div>
        </div>
        ${playerHTML}
        ${musicData.meaning ? `<div class="music-meaning">${musicData.meaning}</div>` : ''}
    `;
    
    list.appendChild(item);
    saveMusic();
}

// Extrair ID do YouTube
function extractYouTubeId(url) {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
}

// Abrir modal de adicionar música
function openAddMusicModal() {
    const modal = document.getElementById('addMusicModal');
    if (modal) {
        modal.style.display = 'block';
        document.getElementById('addMusicForm').reset();
    }
}

// Fechar modal de adicionar música
function closeAddMusicModal() {
    const modal = document.getElementById('addMusicModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// Salvar música
function saveMusic() {
    const items = document.querySelectorAll('.music-item');
    const music = [];
    
    items.forEach(item => {
        const index = item.dataset.index;
        const saved = JSON.parse(localStorage.getItem('coupleMusic') || '[]');
        if (saved[index]) {
            music.push(saved[index]);
        }
    });
    
    localStorage.setItem('coupleMusic', JSON.stringify(music));
}

// Adicionar música via formulário
document.addEventListener('DOMContentLoaded', function() {
    loadMusic();
    
    const form = document.getElementById('addMusicForm');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const title = document.getElementById('musicTitle').value;
            const artist = document.getElementById('musicArtist').value;
            const url = document.getElementById('musicUrl').value;
            const fileInput = document.getElementById('musicFile');
            const meaning = document.getElementById('musicMeaning').value;
            
            let fileData = null;
            if (fileInput.files && fileInput.files[0]) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    fileData = e.target.result;
                    const musicData = {
                        title,
                        artist,
                        url: url || null,
                        file: fileData,
                        meaning
                    };
                    
                    const saved = JSON.parse(localStorage.getItem('coupleMusic') || '[]');
                    saved.push(musicData);
                    localStorage.setItem('coupleMusic', JSON.stringify(saved));
                    
                    addMusicItem(musicData, saved.length - 1);
                    closeAddMusicModal();
                };
                reader.readAsDataURL(fileInput.files[0]);
            } else {
                const musicData = {
                    title,
                    artist,
                    url: url || null,
                    file: null,
                    meaning
                };
                
                const saved = JSON.parse(localStorage.getItem('coupleMusic') || '[]');
                saved.push(musicData);
                localStorage.setItem('coupleMusic', JSON.stringify(saved));
                
                addMusicItem(musicData, saved.length - 1);
                closeAddMusicModal();
            }
        });
    }
});

