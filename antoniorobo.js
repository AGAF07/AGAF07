const qrcode = require('qrcode-terminal');
const { Client, LocalAuth, MessageMedia } = require('whatsapp-web.js');
const path = require('path');

// Inicializa o cliente do WhatsApp com autenticação local
const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', // Caminho do Chrome para enviar videos
    }
});

let nomesUsuarios = {}; // Armazena o nome dos usuários por número

// Gera o QR Code para login
client.on('qr', (qr) => {
    qrcode.generate(qr, { small: true });
    console.log('Escaneie o QR Code para conectar ao WhatsApp.');
});

// Cliente pronto
client.on('ready', () => {
    console.log('Cliente conectado e pronto para uso!');
});

// Função para simular digitação
const simularDigitacao = async (chat, tempo = 2000) => {
    await chat.sendStateTyping();
    return new Promise(resolve => setTimeout(resolve, tempo));
};

// Função para capturar o nome do usuário
const capturarNome = async (msg) => {
    const contato = await msg.getContact();
    const nome = contato.pushname || "Cliente"; // Nome ou "Cliente" padrão
    nomesUsuarios[msg.from] = nome; // Armazena o nome do usuário pelo número
    return nome;
};

// Resposta automática às mensagens recebidas
client.on('message', async (msg) => {
    const chat = await msg.getChat();
    const mensagemRecebida = msg.body.toLowerCase(); // Converte a mensagem para minúsculas

    // Captura o nome do usuário na primeira interação
    if (!nomesUsuarios[msg.from]) {
        await capturarNome(msg);
    }
    const nomeUsuario = nomesUsuarios[msg.from] || "Cliente"; // Recupera o nome do usuário ou "Cliente"

    // Função para responder de acordo com o horário
    const saudacaoPorHora = () => {
        const hora = new Date().getHours();
        if (hora < 12) return 'Bom dia';
        if (hora < 18) return 'Boa tarde';
        return 'Boa noite';
    };

    // Respostas para saudação com variações de entrada
    if (["oi", "olá", "quero testar", "quero teste", "dão teste", "posso ter mais informações","quero"].some(palavra => mensagemRecebida.includes(palavra))) {
        await simularDigitacao(chat); // Simula digitação
        msg.reply(`${saudacaoPorHora()}, ${nomeUsuario}! 👋 Bem-vindo ao atendimento da *Agaf Play*.\nComo posso ajudar você hoje? 😊`);
        return;
    }

    // Menu principal
    if (["menu", "informações", "app", "vídeos", "teste","Testar","testar","Têm teste", "pagamento", "revendedor", "gostaria de testar","eu quria testar","Vocês fazem teste, Como testar o vosso serviço"].some(palavra => mensagemRecebida.includes(palavra))) {
        await simularDigitacao(chat);
        msg.reply(`Olá, ${nomeUsuario}! Seja bem-vindo ao *Brux Play*! 🖥️\nPor favor, selecione uma opção digitando o número correspondente:\n
1️⃣ Informações  
2️⃣ Aplicativos  
3️⃣ Vídeo Aulas  
4️⃣ Solicitar Teste  
5️⃣ Pagamentos  
6️⃣ Ser um Revendedor  
Ou digite *#sair* para encerrar o atendimento.`);
        return;
    }

    // Opções detalhadas
    switch (mensagemRecebida) {
        case '1':
            await simularDigitacao(chat);
            msg.reply(`💬 *Informação Brux Play* ℹ️

O *Brux Play* é sua plataforma de entretenimento, com TV ao vivo, filmes, séries e muito mais! 🎥📺⚽  

Disponível em smartphones, Smart TVs, computadores e tablets.  
*Baixe agora:* https://linktr.ee/lojapg  

Oferecemos *teste gratuito*. Estamos à disposição, ${nomeUsuario}! 😊`);
            break;

        case '2':
            await simularDigitacao(chat);
            msg.reply(`📲 *Aplicativos Disponíveis*

2️⃣∘1️⃣ *Android*    
2️⃣∘2️⃣ *iOS*   
2️⃣∘3️⃣ *Smart TV*   
2️⃣∘4️⃣ *TV Box*              
2️⃣∘5️⃣ *PC*    
Digite o número da opção para receber a imagem ou *#voltar* para retornar ao menu inicial.`);
            break;

        case '2.1': // Enviar imagem "Android"
            await simularDigitacao(chat);
            try {
                const imgAndroid = MessageMedia.fromFilePath(path.resolve(__dirname, 'imagem/android.png'));
                await client.sendMessage(msg.from, imgAndroid, { caption: `📲 *Aplicativo Android*, ${nomeUsuario}!` });
            } catch (error) {
                console.error('Erro ao enviar imagem Android:', error);
                msg.reply('Erro ao carregar a imagem do aplicativo Android.');
            }
            break;

        case '2.2': // Enviar imagem "iOS"
            await simularDigitacao(chat);
            try {
                const imgIOS = MessageMedia.fromFilePath(path.resolve(__dirname, 'imagem/ios.png'));
                await client.sendMessage(msg.from, imgIOS, { caption: `📲 *Aplicativo iOS*, ${nomeUsuario}!` });
            } catch (error) {
                console.error('Erro ao enviar imagem iOS:', error);
                msg.reply('Erro ao carregar a imagem do aplicativo iOS.');
            }
            break;

        case '2.3': // Enviar imagem "Smart TV"
            await simularDigitacao(chat);
            try {
                const imgSmartTV = MessageMedia.fromFilePath(path.resolve(__dirname, 'imagem/smarttv.png'));
                await client.sendMessage(msg.from, imgSmartTV, { caption: `📲 *Aplicativo Smart TV*, ${nomeUsuario}!` });
            } catch (error) {
                console.error('Erro ao enviar imagem Smart TV:', error);
                msg.reply('Erro ao carregar a imagem do aplicativo Smart TV.');
            }
            break;

        case '2.4': // Enviar imagem "TV Box"
            await simularDigitacao(chat);
            try {
                const imgTVBox = MessageMedia.fromFilePath(path.resolve(__dirname, 'imagem/tvbox.png'));
                await client.sendMessage(msg.from, imgTVBox, { caption: `📲 *Aplicativo TV Box*, ${nomeUsuario}!` });
            } catch (error) {
                console.error('Erro ao enviar imagem TV Box:', error);
                msg.reply('Erro ao carregar a imagem do aplicativo TV Box.');
            }
            break;

        case '2.5': // Enviar imagem "PC/Mac"
            await simularDigitacao(chat);
            try {
                const imgPCMac = MessageMedia.fromFilePath(path.resolve(__dirname, 'imagem/pcmac.png'));
                await client.sendMessage(msg.from, imgPCMac, { caption: `📲 *Aplicativo PC/Mac*, ${nomeUsuario}!` });
            } catch (error) {
                console.error('Erro ao enviar imagem PC/Mac:', error);
                msg.reply('Erro ao carregar a imagem do aplicativo PC/Mac.');
            }
            break;

        case '3': // Vídeo Aulas
            await simularDigitacao(chat);
            msg.reply(`🎥 *Vídeo Aulas*  

3️⃣∘1️⃣ *Login Xtream*  
3️⃣∘2️⃣ *Login M3U*
3️⃣∘3️⃣ *Login Normal*
Digite o número da opção para receber o vídeo ou *#voltar* para retornar ao menu inicial.`);
            break;

        case '3.1': // Enviar vídeo "Login Xtream"
            await simularDigitacao(chat);
            try {
                const videoXtream = MessageMedia.fromFilePath(path.resolve(__dirname, 'video/xtreamcode.mp4'));
                await client.sendMessage(msg.from, videoXtream, { caption: `🎥 *Login Xtream*, ${nomeUsuario}!` });
            } catch (error) {
                console.error('Erro ao enviar vídeo Xtream:', error);
                msg.reply('Erro ao carregar o vídeo do Login Xtream.');
            }
            break;

        case '3.2': // Enviar vídeo "Login M3U"
            await simularDigitacao(chat);
            try {
                const videoM3U = MessageMedia.fromFilePath(path.resolve(__dirname, 'video/iptvm3u.mp4'));
                await client.sendMessage(msg.from, videoM3U, { caption: `🎥 *Login M3U*, ${nomeUsuario}!` });
            } catch (error) {
                console.error('Erro ao enviar vídeo M3U:', error);
                msg.reply('Erro ao carregar o vídeo do Login M3U.');
            }
            break;

            case '3.3': // Enviar vídeo "Login Normal"
            await simularDigitacao(chat);
            try {
                const videoNormal = MessageMedia.fromFilePath(path.resolve(__dirname, 'video/iptv.mp4'));
                await client.sendMessage(msg.from, videoNormal, { caption: `🎥 *Login Normal*, ${nomeUsuario}!` });
            } catch (error) {
                console.error('Erro ao enviar vídeo Normal:', error);
                msg.reply('Erro ao carregar o vídeo do Login Normal.');
            }
            break;

        case '4':
            await simularDigitacao(chat);
            msg.reply(`🛠️ *Solicitar Teste*  
Escolha uma opção:  
4️⃣∘1️⃣ IPTV
4️⃣∘2️⃣ P2P 

Digite o número da opção para continuar.`);
            break;

            case '5':
                await simularDigitacao(chat);
                msg.reply(`💳 *Preços da Assinatura*  
     *30 Dias: 5000 KZ*  
     *60 Dias: 10.000 KZ*  
     *90 Dias: 14.850 KZ*  
    
    🏦 *Nome do Beneficiário*: António Gaspar.  
    💳 *IBAN BAI*: 0040 0000 24007364101 39  
    📌 *Kwik*: 944876128  
    📌 *Multicaixa Express*: 944876128  
    
    Aceitamos *apenas pagamentos instantâneos*.  
    Digite *#voltar* para retornar ao menu inicial.`);
                break;

        case '6': // Revendedor
            await simularDigitacao(chat);
            msg.reply(`📦 *Seja um Revendedor!*  

Entre em contato com nossa equipe de vendas para maiores detalhes.`);
            break;

        case '#voltar':
            await simularDigitacao(chat);
            msg.reply(`Voltando ao menu principal...`);
            break;

        case '#sair':
            await simularDigitacao(chat);
            msg.reply(`Até mais, ${nomeUsuario}! 👋`);
            break;

        default:
            msg.reply('Não entendi o comando. Por favor, digite *menu* para visualizar as opções disponíveis.');
            break;
    }
});

// Inicia o cliente WhatsApp
client.initialize();
