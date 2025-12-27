// music.js - Player de música simples
const audio = new Audio();
let isPlaying = false;

function playMusic(src) {
    audio.src = src;
    audio.play();
    isPlaying = true;
}

function pauseMusic() {
    audio.pause();
    isPlaying = false;
}

function togglePlay() {
    if (isPlaying) {
        pauseMusic();
    } else {
        playMusic('music.mp3'); // Exemplo
    }
}

// Exemplo de uso
document.addEventListener('DOMContentLoaded', () => {
    const button = document.createElement('button');
    button.textContent = 'Tocar Música';
    button.onclick = togglePlay;
    document.body.appendChild(button);
});