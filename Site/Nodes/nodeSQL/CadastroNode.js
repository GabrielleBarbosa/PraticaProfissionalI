const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const porta = 3000; //porta padrão
const sql = require('mssql');
const conexaoStr = "Server=regulus;Database=PR118183;User Id=PR118183;Password=PR118183;";

//conexao com BD
sql.connect(conexaoStr)
    .then(conexao => global.conexao = conexao)
    .catch(erro => console.log(erro));

// configurando o body parser para pegar POSTS mais tarde
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

//acrescentando informacoes de cabecalho para suportar o CORS
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "GET, POST, HEAD, OPTIONS, PATCH, DELETE");
    next();
});

//definindo as rotas
const rota = express.Router();
rota.get('/', (requisicao, resposta) => resposta.json({
    mensagem: 'Funcionando!'
}));
app.use('/', rota);

//inicia servidor
app.listen(porta);
console.log('API Funcionando!');

function execSQL(sql, resposta) {
    global.conexao.request()
        .query(sql)
        .then(resultado => resposta.json(resultado.recordset))
        .catch(erro => resposta.json(erro));
}

rota.get('/Usuario', (requisicao, resposta) => {
    execSQL('SELECT * FROM Usuario', resposta);
})

//o simbolo ? indica que id na rota abaixo é opcional
rota.get('/Usuario/:id?', (requisicao, resposta) => {
    let filtro = '';
    if (requisicao.params.id)
        filtro = ' WHERE codUsuario=' + parseInt(requisicao.params.id);
    execSQL('SELECT * from Usuario' + filtro, resposta);
})



// testar no POSTMAN
rota.delete('/Usuario/:id', (requisicao, resposta) => {
    execSQL('DELETE Usuario WHERE codUsuario=' + parseInt(requisicao.params.id), resposta);
    resposta.end(resposta.json({
        mensagem: 'Deletado!'
    }));
})

rota.post('/Usuario', (requisicao, resposta) => {
    const nome = requisicao.body.nome.substring(0,50);
    const cpf = requisicao.body.cpf.substring(0, 14);
    const tel = requisicao.body.tel.substring(0,15);
    const email = requisicao.body.email.substring(0,50);
    const senha  =requisicao.body.senha.substring(0,15);
    execSQL(`INSERT INTO Usuario(nome,CPF,telefone,email,senha) VALUES('${nome}','${cpf}','${tel}', '${email}','${senha}')`, resposta);
})

//alterar configurações, não serve pro cadastro

rota.patch('/Usuario/:id', (requisicao, resposta) => {
    const nome = requisicao.body.nome.substring(0,50);
    const cpf = requisicao.body.cpf.substring(0, 14);
    const tel = requisicao.body.tel.substring(0,20);
    const email = requisicao.body.email.substring(0,50);
    const senha  =requisicao.body.senha.substring(0,15);
    execSQL(`UPDATE Usuario SET nome='${nome}', CPF='${cpf}',telefone='${tel}',email='${email}',senha='${senha}' WHERE email=${email}`, resposta);
    resposta.end(resposta.json({
        mensagem: 'Alterado!'
    }));
})


