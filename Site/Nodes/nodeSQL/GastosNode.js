const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const porta = 3000; //porta padrão
const sql = require('mssql');
const conexaoStr = "Server=regulus;Database=BD18200;User Id=BD18200;Password=f3l1p3l3o;";

//conexao com BD
sql.connect(conexaoStr)
   .then(conexao => global.conexao = conexao)
   .catch(erro => console.log(erro));

// configurando o body parser para pegar POSTS mais tarde
app.use(bodyParser.urlencoded({ extended: true}));
app.use(bodyParser.json());

//acrescentando informacoes de cabecalho para suportar o CORS
app.use(function(req, res, next) { res.header("Access-Control-Allow-Origin", "*"); res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept"); res.header("Access-Control-Allow-Methods", "GET, POST, HEAD, OPTIONS, PATCH, DELETE"); next(); });

//definindo as rotas
const rota = express.Router();
rota.get('/', (requisicao, resposta) => resposta.json({ mensagem: 'Funcionando!'}));
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

rota.get('/VendaL1', (requisicao, resposta) =>{
execSQL('SELECT * FROM MedicoS2L1', resposta);
})

//o simbolo ? indica que id na rota abaixo é opcional
rota.get('/MedicoS2L1/:id?', (requisicao, resposta) => {
let filtro = '';
if (requisicao.params.id)
filtro = ' WHERE codMedico=' + parseInt(requisicao.params.id);
execSQL('SELECT * from MedicoS2L1' + filtro, resposta);
})



// testar no POSTMAN
rota.delete('/MedicoS2L1/:id', (requisicao, resposta) =>{ execSQL('DELETE MedicoS2L1 WHERE codMedico=' + parseInt(requisicao.params.id), resposta); resposta.end(resposta.json({ mensagem: 'Deletado!'})); })

rota.post('/MedicoS2L1', (requisicao, resposta) =>{ const id = parseInt(requisicao.body.id); const nome = requisicao.body.nome.substring(0,150); const cpf = requisicao.body.cpf.substring(0,11); execSQL(`INSERT INTO Clientes(ID, Nome, CPF) VALUES(${id},'${nome}','${cpf}')`, resposta); resposta.end(resposta.json({ mensagem: 'Incluído!'})); })

rota.patch('/MedicoS2L1/:id', (requisicao, resposta) =>{ const id = parseInt(requisicao.params.id); const nome = requisicao.body.nome.substring(0,150); const cpf = requisicao.body.cpf.substring(0,11); execSQL(`UPDATE MedicoS2L1 SET Nome='${nome}', CPF='${cpf}' WHERE ID=${id}`, resposta); resposta.end(resposta.json({ mensagem: 'Alterado!'})); })



//INSERIR NO BANCO DE DADOS

rota.post('/MedicoS2L1', (requisicao, resposta) =>{
const codMedico = parseInt(requisicao.body.codMedico);
const nome = requisicao.body.nome.substring(0,150);
const CRM = parseInt(requisicao.body.CRM)
execSQL(`INSERT INTO MedicoS2L1(codMedico, nome, CRM) VALUES(${codMedico},'${nome}','${CRM}')`, resposta);
})