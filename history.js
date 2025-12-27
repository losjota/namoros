// Carregar história salva
function loadHistory() {
    const saved = localStorage.getItem('coupleHistory');
    if (saved) {
        const history = JSON.parse(saved);
        Object.keys(history).forEach(event => {
            const eventData = history[event];
            if (eventData.date) {
                const dateInput = document.getElementById(`date-${event}`);
                if (dateInput) dateInput.value = eventData.date;
            }
            if (eventData.text) {
                const textArea = document.getElementById(`text-${event}`);
                if (textArea) textArea.value = eventData.text;
            }
            if (eventData.photo) {
                const preview = document.getElementById(`preview-${event}`);
                if (preview) {
                    preview.src = eventData.photo;
                    preview.style.display = 'block';
                }
            }
        });
    }
    
    // Adicionar listeners para salvar automaticamente
    document.querySelectorAll('.event-date, .event-text').forEach(element => {
        element.addEventListener('change', saveHistory);
    });
}

// Salvar história
function saveHistory() {
    const events = ['primeira-conversa', 'primeiro-encontro', 'pedido-namoro', 'pedido-casamento', 'casamento'];
    const history = {};
    
    events.forEach(event => {
        const dateInput = document.getElementById(`date-${event}`);
        const textArea = document.getElementById(`text-${event}`);
        const photoInput = document.getElementById(`photo-${event}`);
        const preview = document.getElementById(`preview-${event}`);
        
        history[event] = {
            date: dateInput ? dateInput.value : '',
            text: textArea ? textArea.value : '',
            photo: preview && preview.src ? preview.src : ''
        };
    });
    
    localStorage.setItem('coupleHistory', JSON.stringify(history));
    
    // Mostrar feedback
    const btn = event.target;
    if (btn && btn.classList.contains('btn-primary')) {
        const originalText = btn.textContent;
        btn.textContent = '✅ Salvo!';
        btn.style.background = '#4caf50';
        setTimeout(() => {
            btn.textContent = originalText;
            btn.style.background = '';
        }, 2000);
    }
}

// Preview de múltiplas imagens (para casamento)
document.addEventListener('DOMContentLoaded', function() {
    loadHistory();
    
    const casamentoInput = document.getElementById('photo-casamento');
    if (casamentoInput) {
        casamentoInput.addEventListener('change', function(e) {
            const previewContainer = document.getElementById('preview-casamento');
            previewContainer.innerHTML = '';
            
            Array.from(e.target.files).forEach(file => {
                const reader = new FileReader();
                reader.onload = function(event) {
                    const img = document.createElement('img');
                    img.src = event.target.result;
                    img.className = 'event-photo';
                    img.style.display = 'block';
                    previewContainer.appendChild(img);
                };
                reader.readAsDataURL(file);
            });
        });
    }
});

