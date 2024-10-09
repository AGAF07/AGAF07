const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const moment = require('moment');

const client = new Client({
    authStrategy: new LocalAuth()
});

client.on('qr', (qr) => {
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    console.log('Cliente está pronto!');
});

client.on('message', message => {
    const lowerCaseMsg = message.body.toLowerCase();
    const currentHour = moment().hour();
    let greeting;

    if (currentHour < 12) {
        greeting = 'Bom dia';
    } else if (currentHour < 18) {
        greeting = 'Boa tarde';
    } else {
        greeting = 'Boa noite';
    }

    if (['oi', 'olá', 'bom dia', 'boa tarde', 'boa noite'].includes(lowerCaseMsg)) {
        message.reply(`${greeting}, bem vindo ao atendimento ao provedor net\n\nPor favor, selecione uma opção digitando o número correspondente:\n\n1 - JÁ SOU CLIENTE\n2 - AINDA NÃO SOU CLIENTE\n\nOu digite #sair para encerrar o atendimento.`);
    } else if (message.body === '1') {
        message.reply('Olá, seja bem vindo ao Provedor *net*!\nPara ser atendido, por favor *escolha uma das opções abaixo*:\n\n1 - 2a via de Boleto\n2 - Suporte técnico\n3 - Desbloqueio em confiança\n4 - Planos e preços\n5 - Falar com atendente\n\nDigite #menu a qualquer tempo para retornar ao menu.');
    } else if (message.body === '2') {
        message.reply(`📝 FICHA DE  CADASTRO.

▪️Plano escolhido:
▪️Como conheceu a online-fibra:

📋 DADOS PESSOAIS

▪️Nome:
▪️CPF:
▪️RG:
▪️Data de Nascimento:
▪️E-mail:

📪 ENDEREÇO COMPLETO.

▪️Rua:
▪️Número:

▪️Complemento:
▪️Bairro:
▪️Cidade:
▪️Cep:
▪️Ponto de referência:

📞 TELEFONES DE CONTATO.

▪️1° Número do Whatsapp:
▪️2° Telefone para recado:

🗓 DATA DE VENCIMENTO.

▪️ 5/ 20:

📸 Foto do documento legível,  frente e verso e a selfie segurando o documento ao lado do rosto:`);
    } else if (message.body === '1' || message.body === '2' || message.body === '3' || message.body === '4' || message.body === '5') {
        switch (message.body) {
            case '1':
                message.reply('Por favor, acesse nosso site para emitir a 2a via do seu boleto: [https://www.netpremier.net](https://www.netpremier.net/)');
                break;
            case '2':
                message.reply('Por favor, aguarde um momento enquanto transferimos para um de nossos atendentes.');
                break;
            case '3':
                message.reply('Acesse o site: https://financeirobsc.com.br/ para Desbloqueio de confiança');
                break;
            case '4':
                message.reply('Por favor, aguarde um momento enquanto transferimos para um de nossos atendentes.');
                break;
            case '5':
                message.reply('Por favor, aguarde um momento enquanto transferimos para um de nossos atendentes.');
                break;
        }
    } else if (message.body === '#sair') {
        message.reply('Atendimento encerrado. Se precisar de mais alguma coisa, é só mandar uma mensagem.');
    } else if (message.body === '#menu') {
        message.reply('Por favor, selecione uma opção digitando o número correspondente:\n\n1 - JÁ SOU CLIENTE\n2 - AINDA NÃO SOU CLIENTE\n\nOu digite #sair para encerrar o atendimento.');
    }
});

client.initialize();