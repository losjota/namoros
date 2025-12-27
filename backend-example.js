// Exemplo de backend Node.js para processar pagamentos com Mercado Pago
// Instale as dependências: npm install express mercadopago cors

const express = require('express');
const mercadopago = require('mercadopago');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Configure sua Access Token do Mercado Pago
// Obtenha em: https://www.mercadopago.com.br/developers/panel/credentials
mercadopago.configure({
    access_token: 'YOUR_ACCESS_TOKEN_HERE' // Substitua pela sua Access Token
});

// Rota para criar preferência de pagamento
app.post('/api/create-preference', async (req, res) => {
    try {
        const { type, amount, paymentMethod, email } = req.body;

        // Configurar preferência de pagamento
        const preference = {
            items: [
                {
                    title: type === 'lifetime' ? 'Acesso Vitalício - Nosso Amor' : 'Acesso por 1 Dia - Nosso Amor',
                    quantity: 1,
                    unit_price: amount,
                    currency_id: 'BRL'
                }
            ],
            back_urls: {
                success: 'https://seusite.com/pagamento-sucesso.html',
                failure: 'https://seusite.com/pagamento-erro.html',
                pending: 'https://seusite.com/pagamento-pendente.html'
            },
            auto_return: 'approved',
            payment_methods: {
                excluded_payment_methods: paymentMethod === 'credit' ? [] : [{ id: 'credit_card' }],
                excluded_payment_types: paymentMethod === 'pix' ? [] : [{ id: 'ticket' }, { id: 'bank_transfer' }],
                installments: 1
            },
            notification_url: 'https://seusite.com/api/webhook',
            statement_descriptor: 'NOSSO AMOR',
            external_reference: `payment_${type}_${Date.now()}`
        };

        // Adicionar e-mail se for boleto
        if (paymentMethod === 'boleto' && email) {
            preference.payer = {
                email: email
            };
        }

        const response = await mercadopago.preferences.create(preference);
        
        res.json({
            success: true,
            preferenceId: response.body.id,
            initPoint: response.body.init_point,
            sandboxInitPoint: response.body.sandbox_init_point
        });
    } catch (error) {
        console.error('Erro ao criar preferência:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Webhook para receber notificações de pagamento
app.post('/api/webhook', async (req, res) => {
    try {
        const { type, data } = req.body;

        if (type === 'payment') {
            const payment = await mercadopago.payment.findById(data.id);
            
            // Processar pagamento aprovado
            if (payment.body.status === 'approved') {
                // Ativar acesso do usuário
                const externalReference = payment.body.external_reference;
                // Salvar no banco de dados que o pagamento foi aprovado
                console.log('Pagamento aprovado:', externalReference);
            }
        }

        res.status(200).send('OK');
    } catch (error) {
        console.error('Erro no webhook:', error);
        res.status(500).send('Error');
    }
});

// Rota para verificar status do pagamento
app.get('/api/payment-status/:paymentId', async (req, res) => {
    try {
        const { paymentId } = req.params;
        const payment = await mercadopago.payment.findById(paymentId);
        
        res.json({
            status: payment.body.status,
            statusDetail: payment.body.status_detail
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});

