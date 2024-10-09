// VAMOS INICIAR O CHAT BOT LER O CODIGO QR ADICIONAR VIDEOS
// Importação das bibliotecas
const qrcode = require('qrcode-terminal');
const { Client, MessageMedia } = require('whatsapp-web.js');
const Groq = require('groq-sdk');
const fs = require('fs');

// Defina sua chave de API para a Groq
const OPENAI_API_KEY = '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';
const groq = new Groq({ apiKey: OPENAI_API_KEY });

// Inicialização do cliente WhatsApp
const client = new Client({
    puppeteer: {
        executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
    }
});

// Função para criar um delay
const delay = ms => new Promise(res => setTimeout(res, ms)); //vr1

// Exibe o QR Code para login no WhatsApp
client.on('qr', qr => {
    qrcode.generate(qr, { small: true });
});

// Mensagem quando o bot está pronto
client.on('ready', () => {
    console.log('Chatbot conectado com sucesso.');
});

// FIM DO QR CODE MAIS API DA GROQ
// INICIAR O TREINAMENTO
// Inicializa o cliente
client.initialize();

// Base de dados de variações para respostas do chatbot
const variaçõesRespostas = [
    { input: "quanto custa o iptv da brux play?", output: "Nossos planos de IPTV custam 5000 KZ para 30 dias, 10.000 KZ para 60 dias e 14.850 KZ para 90 dias." }, //vr2
    { input: "custa quanto o iptv", output: "Os preços do IPTV são 5000 KZ por 30 dias, 10.000 KZ por 60 dias e 14.850 KZ por 90 dias." }, //vr2
    { input: "valor iptv brux", output: "O preço do IPTV é 5000 KZ para 30 dias." }, //vr2
    // ... (adicione outras variações conforme necessário)
];

// Função para treinar o chatbot com as variações
const treinarVariações = () => {
    variaçõesRespostas.forEach((resposta) => {
        // client.addTrainingPhrase(resposta.input, resposta.output); // Este método não existe, remova ou substitua por método correto
    });
};

// Chamada da função para treinar com as variações definidas
treinarVariações(); //vr3

// Função para obter a resposta da API Groq
async function getGroqChatCompletion(userMessage) {
    try {
        const chatCompletion = await groq.chat.completions.create({
            messages: [
                {
                    role: "user",
                    content: userMessage,
                },
            ],
            model: "llama3-8b-8192", // Use o modelo desejado
        });

        // Retorna o conteúdo da resposta
        return chatCompletion.choices[0]?.message?.content || "Desculpe, não consegui processar sua solicitação.";
    } catch (error) {
        console.error('Erro ao chamar a API Groq:', error);
        return null; // Retorna null em caso de erro
    }
}

// Escuta mensagens e processa a resposta
client.on('message', async msg => {
    // Verifica se a mensagem é de um usuário
    if (msg.from.endsWith('@c.us')) {
        console.log("Mensagem recebida: ", msg.body);

        try {
            // Simula a digitação antes de responder
            await client.sendPresenceAvailable(msg.from);
            await delay(4000); // Delay para simular digitação

            // Responde usando as variações predefinidas
            const variação = variaçõesRespostas.find(v => msg.body.toLowerCase().includes(v.input.toLowerCase()));
            if (variação) {
                await msg.reply(variação.output); // Responde usando a variação
            } else {
                // Responde com a conclusão da API Groq se não encontrou variação
                const responseMessage = await getGroqChatCompletion(msg.body);
                if (responseMessage) {
                    await msg.reply(responseMessage); // Responde ao usuário com a mensagem da API
                }
            }
        } catch (error) {
            console.error('Erro ao processar a mensagem:', error);
            // Mensagem de erro não é enviada ao cliente
        } finally {
            await client.sendPresenceUnavailable(msg.from);
        }
    }
});
