// Carregar textos
function loadTexts() {
    const saved = localStorage.getItem('coupleTexts');
    if (saved) {
        const texts = JSON.parse(saved);
        texts.forEach((text, index) => {
            addTextItem(text, index);
        });
    }
}

// Adicionar item de texto
function addTextItem(textData, index = null) {
    const list = document.getElementById('textsList');
    if (!list) return;
    
    const item = document.createElement('div');
    item.className = 'text-item';
    item.dataset.index = index !== null ? index : list.children.length;
    item.dataset.category = textData.category;
    
    const categoryNames = {
        'romantic': 'Romântica',
        'promise': 'Promessa',
        'declaration': 'Declaração',
        'future': 'Carta para o Futuro',
        'reflection': 'Reflexão'
    };
    
    item.innerHTML = `
        <div class="text-item-header">
            <div>
                <div class="text-item-title">${textData.title}</div>
                <div class="text-item-date">${textData.date || new Date().toLocaleDateString('pt-BR')}</div>
            </div>
        </div>
        <span class="text-item-category">${categoryNames[textData.category] || textData.category}</span>
        <div class="text-item-content">${textData.content}</div>
    `;
    
    list.appendChild(item);
    saveTexts();
}

// Filtrar textos por categoria
function filterTexts(category, buttonElement) {
    const items = document.querySelectorAll('.text-item');
    const buttons = document.querySelectorAll('.category-btn');
    
    buttons.forEach(btn => btn.classList.remove('active'));
    if (buttonElement) {
        buttonElement.classList.add('active');
    }
    
    items.forEach(item => {
        if (category === 'all' || item.dataset.category === category) {
            item.style.display = 'block';
        } else {
            item.style.display = 'none';
        }
    });
}

// Abrir modal de adicionar texto
function openAddTextModal() {
    const modal = document.getElementById('addTextModal');
    if (modal) {
        modal.style.display = 'block';
        document.getElementById('addTextForm').reset();
        document.getElementById('textDate').value = new Date().toISOString().split('T')[0];
        document.getElementById('modalTextTitle').textContent = 'Escrever Texto';
    }
}

// Fechar modal de adicionar texto
function closeAddTextModal() {
    const modal = document.getElementById('addTextModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// Salvar textos
function saveTexts() {
    const items = document.querySelectorAll('.text-item');
    const texts = [];
    
    items.forEach(item => {
        const index = item.dataset.index;
        const saved = JSON.parse(localStorage.getItem('coupleTexts') || '[]');
        if (saved[index]) {
            texts.push(saved[index]);
        }
    });
    
    localStorage.setItem('coupleTexts', JSON.stringify(texts));
}

// Adicionar texto via formulário
document.addEventListener('DOMContentLoaded', function() {
    loadTexts();
    
    const form = document.getElementById('addTextForm');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const textData = {
                title: document.getElementById('textTitle').value,
                category: document.getElementById('textCategory').value,
                content: document.getElementById('textContent').value,
                date: document.getElementById('textDate').value || new Date().toISOString().split('T')[0]
            };
            
            const saved = JSON.parse(localStorage.getItem('coupleTexts') || '[]');
            saved.push(textData);
            localStorage.setItem('coupleTexts', JSON.stringify(saved));
            
            addTextItem(textData, saved.length - 1);
            closeAddTextModal();
        });
    }
});

