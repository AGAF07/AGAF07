//Cria o leitor de código qr junto com Leitor de video

const qrcode = require('qrcode-terminal');
const { Client, Buttons, List, MessageMedia } = require('whatsapp-web.js'); 
const client = new Client({puppeteer: {executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',}});

client.on('qr', qr => {
    qrcode.generate(qr, {small: true});
});

client.on('ready', () => {
    console.log('Chatbot conectado com sucesso.');
});

client.initialize();

const delay = ms => new Promise(res => setTimeout(res, ms)); 

// Função para obter a saudação de acordo com o período do dia
function getSaudacao() {
    const horas = new Date().getHours();
    if (horas < 12) {
        return 'Bom dia';
    } else if (horas < 18) {
        return 'Boa tarde';
    } else {
        return 'Boa noite';
    }
}

client.on('message', async msg => {
    // O código executa para todas as mensagens recebidas
    if (msg.from.endsWith('@c.us')) {
        // Aqui você coloca o código que o robô deve executar para qualquer mensagem
        console.log("Robô ativado com a mensagem: ", msg.body);
        
        // Exemplo: resposta automática
        msg.reply('Robô ativado!');
    }
});

client.on('message', async msg => {
    // Variável com as palavras de entrada para ativar o robô
    const palavrasChave = /(Aqui |coloca| as| palavras| de| entrada |para| ativar |o robô)/i;

    // O código executa apenas uma vez para cada mensagem
    if (msg.from.endsWith('@c.us') && !msg.body.match(palavrasChave)) {
        return; // Se não for uma palavra-chave, ignora
    }

    const chat = await msg.getChat();
    const contact = await msg.getContact();
    const nome = contact.pushname ? contact.pushname.split(" ")[0] : 'amigo'; // Pega o primeiro nome ou usa 'amigo'

    // Saudação personalizada com nome e período do dia
    const saudacao = getSaudacao();
    await delay(3000);
    await chat.sendStateTyping(); 
    await delay(3000);
    await client.sendMessage(msg.from, `${saudacao}, ${nome}! Seja muito bem-vindo(a).`);

    await delay(3000);
    await chat.sendStateTyping(); 
    await delay(3000);
    await client.sendMessage(msg.from, 'Você está no funil básico do treinamento Chatbot projetado pelo Jardel.');

    await delay(3000);
    await chat.sendStateTyping(); 
    await delay(3000);
    await client.sendMessage(msg.from, 'Agora eu vou te mandar um áudio gravado como se fosse fresquinho!');

    await delay(5000);
    await chat.sendStateRecording(); 
    await delay(5000);

    const audio = MessageMedia.fromFilePath('./Áudio.ogg'); // Aqui coloca o nome do arquivo de áudio
    await client.sendMessage(msg.from, audio, {sendAudioAsVoice: true}); 

    await delay(4000);
    await chat.sendStateTyping(); 
    await client.sendMessage(msg.from, 'Agora quero te mandar uma imagem');

    await delay(3000);

    const imagem = MessageMedia.fromFilePath('./Imagem.png'); // Aqui coloca o nome do arquivo de imagem
    await client.sendMessage(msg.from, imagem, {caption: 'Aqui é a legenda'});

    await delay(3000);
    await chat.sendStateTyping(); 
    await client.sendMessage(msg.from, 'Agora quero te mandar um PDF');

    const pdf = MessageMedia.fromFilePath('./PDF.pdf'); // Aqui coloca o nome do arquivo PDF
    await client.sendMessage(msg.from, pdf); 

    await delay(3000);
    await chat.sendStateTyping(); 
    await client.sendMessage(msg.from, 'Agora quero te mandar um vídeo');

    const video = MessageMedia.fromFilePath('./Vídeo.mp4'); // Aqui coloca o nome do arquivo de vídeo
    await client.sendMessage(msg.from, video, {caption: 'Legenda do vídeo'});

    await chat.sendStateTyping(); 
    await client.sendMessage(msg.from, 'Prontinho! Agora use sua criatividade para criar sequências de respostas com textos, áudios, imagens... O céu é o limite!');
});
