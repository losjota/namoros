// Configurações e dados do casal
let coupleData = {
    coupleName: 'Nome do Casal',
    romanticQuote: '"Uma frase marcante sobre o início do nosso relacionamento..."',
    startDate: new Date().toISOString().split('T')[0],
    relationshipType: 'namoro'
};

// Carregar dados salvos
function loadData() {
    const saved = localStorage.getItem('coupleData');
    if (saved) {
        coupleData = JSON.parse(saved);
        updateUI();
    }
}

// Salvar dados
function saveData() {
    localStorage.setItem('coupleData', JSON.stringify(coupleData));
    updateUI();
}

// Atualizar interface
function updateUI() {
    if (document.getElementById('coupleName')) {
        document.getElementById('coupleName').textContent = coupleData.coupleName;
    }
    if (document.getElementById('romanticQuote')) {
        document.getElementById('romanticQuote').textContent = coupleData.romanticQuote;
    }
    if (document.getElementById('relationshipType')) {
        const typeText = coupleData.relationshipType === 'namoro' ? 'namorando' : 'casados';
        document.getElementById('relationshipType').textContent = typeText;
    }
    updateCounter();
}

// Atualizar contador
function updateCounter() {
    if (!document.getElementById('startDateInput') && !coupleData.startDate) return;
    
    const startDate = new Date(coupleData.startDate);
    const now = new Date();
    const diff = now - startDate;
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const months = Math.floor(days / 30.44);
    const years = Math.floor(days / 365.25);
    
    const remainingDays = days % 30;
    const remainingMonths = months % 12;
    
    animateCounter('years', years);
    animateCounter('months', remainingMonths);
    animateCounter('days', remainingDays);
}

// Animar contador
function animateCounter(id, targetValue) {
    const element = document.getElementById(id);
    if (!element) return;
    
    const currentValue = parseInt(element.textContent) || 0;
    const increment = targetValue > currentValue ? 1 : -1;
    const duration = 1000;
    const steps = Math.abs(targetValue - currentValue);
    const stepDuration = duration / steps;
    
    let current = currentValue;
    const timer = setInterval(() => {
        current += increment;
        element.textContent = current;
        
        if (current === targetValue) {
            clearInterval(timer);
        }
    }, stepDuration);
}

// Abrir configurações
function openSettings() {
    const modal = document.getElementById('settingsModal');
    if (!modal) return;
    
    document.getElementById('coupleNameInput').value = coupleData.coupleName;
    document.getElementById('romanticQuoteInput').value = coupleData.romanticQuote;
    document.getElementById('startDateInput').value = coupleData.startDate;
    document.getElementById('relationshipTypeSelect').value = coupleData.relationshipType;
    
    modal.style.display = 'block';
}

// Fechar configurações
function closeSettings() {
    const modal = document.getElementById('settingsModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// Salvar configurações
document.addEventListener('DOMContentLoaded', function() {
    loadData();
    
    const form = document.getElementById('settingsForm');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            coupleData.coupleName = document.getElementById('coupleNameInput').value;
            coupleData.romanticQuote = document.getElementById('romanticQuoteInput').value;
            coupleData.startDate = document.getElementById('startDateInput').value;
            coupleData.relationshipType = document.getElementById('relationshipTypeSelect').value;
            
            saveData();
            closeSettings();
        });
    }
    
    // Atualizar contador a cada minuto
    setInterval(updateCounter, 60000);
    
    // Fechar modal ao clicar fora
    window.onclick = function(event) {
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            if (event.target === modal) {
                modal.style.display = 'none';
            }
        });
    };
});

// Preview de imagem
function previewImage(input, previewId) {
    const preview = document.getElementById(previewId);
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) {
            preview.src = e.target.result;
            preview.style.display = 'block';
        };
        reader.readAsDataURL(input.files[0]);
    }
}

