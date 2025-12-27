# Configuração do Gateway de Pagamento

Este site está configurado para processar pagamentos reais através do **Mercado Pago**.

## Configuração Básica (Frontend)

1. **Obtenha suas credenciais do Mercado Pago:**
   - Acesse: https://www.mercadopago.com.br/developers/panel/credentials
   - Crie uma conta ou faça login
   - Copie sua **Public Key** (chave pública)

2. **Configure no arquivo `payment.js`:**
   - Abra o arquivo `payment.js`
   - Localize a linha: `const MERCADOPAGO_PUBLIC_KEY = 'YOUR_PUBLIC_KEY_HERE';`
   - Substitua `YOUR_PUBLIC_KEY_HERE` pela sua Public Key do Mercado Pago

## Configuração Completa (Backend - Recomendado)

Para processar pagamentos de forma segura, você precisa de um backend. Siga os passos:

### 1. Instalar Dependências

```bash
npm install express mercadopago cors
```

### 2. Configurar Backend

1. Use o arquivo `backend-example.js` como base
2. Obtenha sua **Access Token** do Mercado Pago (não a Public Key!)
3. Substitua `YOUR_ACCESS_TOKEN_HERE` no arquivo do backend
4. Configure as URLs de retorno (success, failure, pending)
5. Configure a URL do webhook para receber notificações

### 3. Executar Backend

```bash
node backend-example.js
```

### 4. Atualizar Frontend

No arquivo `payment.js`, atualize a função `createPaymentPreference` para apontar para seu backend:

```javascript
const response = await fetch('https://seu-backend.com/api/create-preference', {
    // ...
});
```

## Modo de Teste (Sandbox)

O Mercado Pago oferece um ambiente de testes:

1. Use as credenciais de **teste** (sandbox)
2. Para testar pagamentos:
   - Cartão de teste: 5031 7557 3453 0604
   - CVV: 123
   - Validade: 11/25
   - Nome: APRO

## Formas de Pagamento Suportadas

- ✅ **PIX**: Processado diretamente (chave: 56176282837)
- ✅ **Cartão de Crédito**: Via Mercado Pago
- ✅ **Boleto**: Via Mercado Pago

## Importante

⚠️ **NUNCA** exponha sua Access Token no frontend!
- Use apenas a Public Key no frontend
- A Access Token deve ficar apenas no backend

## Suporte

Para dúvidas sobre integração com Mercado Pago:
- Documentação: https://www.mercadopago.com.br/developers/pt/docs
- Suporte: https://www.mercadopago.com.br/developers/pt/support

