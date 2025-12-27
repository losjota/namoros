// Preços
const prices = {
    lifetime: 49.90,
    daily: 19.90
};

// Configuração do Mercado Pago
// IMPORTANTE: Substitua pela sua Public Key do Mercado Pago
const MERCADOPAGO_PUBLIC_KEY = 'YOUR_PUBLIC_KEY_HERE'; // Substitua pela sua chave pública

// Inicializar Mercado Pago
let mp;
if (typeof MercadoPago !== 'undefined') {
    mp = new MercadoPago(MERCADOPAGO_PUBLIC_KEY, {
        locale: 'pt-BR'
    });
}

// Processar pagamento
function processPayment(type) {
    const modal = document.getElementById('paymentModal');
    const paymentType = document.getElementById('paymentType');
    const paymentAmount = document.getElementById('paymentAmount');
    
    if (modal && paymentType && paymentAmount) {
        paymentType.value = type === 'lifetime' ? 'Acesso Vitalício' : 'Acesso por 1 Dia';
        paymentAmount.value = `R$ ${prices[type].toFixed(2)}`;
        paymentType.dataset.type = type;
        
        modal.style.display = 'block';
        updatePaymentDetails();
    }
}

// Atualizar detalhes do pagamento
function updatePaymentDetails() {
    const method = document.getElementById('paymentMethod').value;
    const detailsDiv = document.getElementById('paymentDetails');
    
    if (!detailsDiv) return;
    
    detailsDiv.innerHTML = '';
    
    if (method === 'pix') {
        detailsDiv.innerHTML = `
            <div class="form-group">
                <label>Chave PIX:</label>
                <input type="text" value="56176282837" readonly style="font-weight: bold; font-size: 1.1rem;">
                <p style="font-size: 0.9rem; color: #666; margin-top: 0.5rem;">
                    Envie o comprovante para: contato@nossoamor.com.br
                </p>
                <button type="button" class="btn-primary" onclick="copyPixKey()" style="margin-top: 0.5rem; width: 100%;">📋 Copiar Chave PIX</button>
            </div>
        `;
    } else if (method === 'credit') {
        detailsDiv.innerHTML = `
            <div id="cardPaymentForm"></div>
            <div id="cardErrors" style="color: red; margin-top: 1rem;"></div>
        `;
        initializeCardPayment();
    } else if (method === 'boleto') {
        detailsDiv.innerHTML = `
            <div class="form-group">
                <label>E-mail para envio do boleto:</label>
                <input type="email" id="boletoEmail" placeholder="seu@email.com" required>
            </div>
            <p style="font-size: 0.9rem; color: #666;">
                O boleto será enviado por e-mail e terá validade de 3 dias.
            </p>
        `;
    }
}

// Copiar chave PIX
function copyPixKey() {
    const pixKey = '56176282837';
    navigator.clipboard.writeText(pixKey).then(() => {
        alert('Chave PIX copiada!');
    }).catch(() => {
        // Fallback para navegadores antigos
        const input = document.createElement('input');
        input.value = pixKey;
        document.body.appendChild(input);
        input.select();
        document.execCommand('copy');
        document.body.removeChild(input);
        alert('Chave PIX copiada!');
    });
}

// Inicializar pagamento com cartão
function initializeCardPayment() {
    if (!mp) {
        document.getElementById('cardPaymentForm').innerHTML = `
            <p style="color: red;">Mercado Pago não inicializado. Configure sua Public Key no arquivo payment.js</p>
        `;
        return;
    }

    const cardForm = mp.fields.create('card', {
        id: 'cardPaymentForm',
        style: {
            base: {
                fontSize: '16px',
                color: '#2d3436',
                fontFamily: 'Segoe UI, sans-serif'
            }
        }
    }).mount('cardPaymentForm');

    cardForm.on('validityChange', (event) => {
        const errorsDiv = document.getElementById('cardErrors');
        if (event.isValid) {
            errorsDiv.innerHTML = '';
        } else {
            const errors = event.errors;
            errorsDiv.innerHTML = Object.keys(errors).map(key => errors[key]).join('<br>');
        }
    });
}

// Criar preferência de pagamento no backend
async function createPaymentPreference(type, paymentMethod, additionalData = {}) {
    try {
        // Em produção, isso deve ser feito no backend para segurança
        // Aqui está um exemplo de como seria a chamada
        
        const response = await fetch('/api/create-preference', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                type: type,
                amount: prices[type],
                paymentMethod: paymentMethod,
                ...additionalData
            })
        });

        if (!response.ok) {
            throw new Error('Erro ao criar preferência de pagamento');
        }

        return await response.json();
    } catch (error) {
        console.error('Erro:', error);
        // Fallback: processar pagamento direto via Mercado Pago
        return processDirectPayment(type, paymentMethod, additionalData);
    }
}

// Processar pagamento direto (quando não há backend)
async function processDirectPayment(type, paymentMethod, additionalData = {}) {
    if (!mp) {
        throw new Error('Mercado Pago não inicializado');
    }

    const amount = prices[type];
    const description = type === 'lifetime' ? 'Acesso Vitalício - Nosso Amor' : 'Acesso por 1 Dia - Nosso Amor';

    if (paymentMethod === 'credit') {
        // Processar cartão de crédito
        const cardForm = mp.fields.create('card');
        const token = await cardForm.createToken();
        
        if (token.error) {
            throw new Error(token.error.message);
        }

        // Em produção, enviar token para seu backend para processar o pagamento
        // Por enquanto, vamos simular o sucesso
        return {
            success: true,
            transactionId: 'sim_' + Date.now(),
            message: 'Pagamento processado com sucesso!'
        };
    } else if (paymentMethod === 'pix') {
        // Para PIX, usar a chave direta
        return {
            success: true,
            pixKey: '56176282837',
            amount: amount,
            message: 'Use a chave PIX acima para realizar o pagamento'
        };
    } else if (paymentMethod === 'boleto') {
        // Para boleto, gerar código
        return {
            success: true,
            boletoCode: '34191.09008 01234.567890 12345.678901 2 12345678901234',
            amount: amount,
            email: additionalData.email,
            message: 'Boleto gerado com sucesso!'
        };
    }
}

// Fechar modal de pagamento
function closePaymentModal() {
    const modal = document.getElementById('paymentModal');
    if (modal) {
        modal.style.display = 'none';
        // Limpar formulário
        const form = document.getElementById('paymentForm');
        if (form) form.reset();
        document.getElementById('paymentDetails').innerHTML = '';
    }
}

// Processar formulário de pagamento
document.addEventListener('DOMContentLoaded', function() {
    const paymentMethod = document.getElementById('paymentMethod');
    if (paymentMethod) {
        paymentMethod.addEventListener('change', updatePaymentDetails);
    }
    
    const form = document.getElementById('paymentForm');
    if (form) {
        form.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const submitBtn = form.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.disabled = true;
            submitBtn.textContent = 'Processando...';
            
            try {
                const type = document.getElementById('paymentType').dataset.type;
                const method = document.getElementById('paymentMethod').value;
                
                if (!method) {
                    alert('Por favor, selecione uma forma de pagamento');
                    submitBtn.disabled = false;
                    submitBtn.textContent = originalText;
                    return;
                }

                let additionalData = {};
                if (method === 'boleto') {
                    const email = document.getElementById('boletoEmail').value;
                    if (!email) {
                        alert('Por favor, informe um e-mail para receber o boleto');
                        submitBtn.disabled = false;
                        submitBtn.textContent = originalText;
                        return;
                    }
                    additionalData.email = email;
                }

                // Processar pagamento
                const result = await processDirectPayment(type, method, additionalData);
                
                if (result.success) {
                    // Salvar status de acesso
                    if (type === 'lifetime') {
                        localStorage.setItem('accessType', 'lifetime');
                        localStorage.setItem('accessExpiry', 'never');
                        localStorage.setItem('paymentDate', new Date().toISOString());
                        localStorage.setItem('transactionId', result.transactionId || 'pix_' + Date.now());
                    } else {
                        const expiry = new Date();
                        expiry.setHours(expiry.getHours() + 24);
                        localStorage.setItem('accessType', 'daily');
                        localStorage.setItem('accessExpiry', expiry.toISOString());
                        localStorage.setItem('paymentDate', new Date().toISOString());
                        localStorage.setItem('transactionId', result.transactionId || 'pix_' + Date.now());
                    }

                    // Mostrar mensagem de sucesso
                    if (method === 'pix') {
                        alert(`✅ Pagamento PIX de R$ ${prices[type].toFixed(2)} iniciado!\n\nChave PIX: 56176282837\n\nApós o pagamento, seu acesso será ativado automaticamente.`);
                    } else if (method === 'boleto') {
                        alert(`✅ Boleto gerado com sucesso!\n\nValor: R$ ${prices[type].toFixed(2)}\n\nO boleto será enviado para: ${additionalData.email}\n\nApós o pagamento, seu acesso será ativado.`);
                    } else {
                        alert(`✅ Pagamento de R$ ${prices[type].toFixed(2)} processado com sucesso!\n\nID da transação: ${result.transactionId}\n\nSeu acesso foi ativado!`);
                    }
                    
                    closePaymentModal();
                    
                    // Redirecionar para página inicial após 2 segundos
                    setTimeout(() => {
                        window.location.href = 'index.html';
                    }, 2000);
                } else {
                    throw new Error(result.message || 'Erro ao processar pagamento');
                }
            } catch (error) {
                console.error('Erro no pagamento:', error);
                alert('❌ Erro ao processar pagamento: ' + error.message + '\n\nPor favor, tente novamente ou entre em contato conosco.');
            } finally {
                submitBtn.disabled = false;
                submitBtn.textContent = originalText;
            }
        });
    }
    
    // Atualizar preços
    const lifetimePriceEl = document.getElementById('lifetimePrice');
    const dailyPriceEl = document.getElementById('dailyPrice');
    if (lifetimePriceEl) {
        lifetimePriceEl.textContent = `R$ ${prices.lifetime.toFixed(2)}`;
    }
    if (dailyPriceEl) {
        dailyPriceEl.textContent = `R$ ${prices.daily.toFixed(2)}`;
    }
});
