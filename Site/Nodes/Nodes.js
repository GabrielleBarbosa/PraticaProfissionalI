const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const porta = 3000; //porta padrão
const sql = require('mssql');
const conexaoStr = "Server=regulus.cotuca.unicamp.br;Database=PR118183;User Id=PR118183;Password=PR118183;";
var email = "felipemelchior112@gmail.com";
var logado = false;

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

//cadastrar
rota.post('/Usuario', (requisicao, resposta) => {

    const cpf = requisicao.body.cpf.substring(0, 14);
    const nome = requisicao.body.nome.substring(0, 50);
    const tel = requisicao.body.tel.substring(0, 15);
    email = requisicao.body.email.substring(0, 50);
    const senha = requisicao.body.senha.substring(0, 15);

    execSQL
        (` 
      INSERT INTO Usuario(nome,CPF,telefone,email,senha) 

      VALUES(
            '${nome}',
            '${cpf}',
            '${tel}',
            '${email}',
            '${senha}'
            ) 
      INSERT INTO Acesso(email,senha)
      VALUES(
            '${email}',
            '${senha}'
            ) 
      `, resposta);

})


//Conferir Realização Cadastro
rota.get('/Usuario/:email',(requisicao,resposta) =>{
    
    email = requisicao.params.email;
    execSQL(`SELECT * FROM  Usuario where email = '${email}'`)
})


//login

rota.get('/Acesso/:email', (requisicao, resposta) => {
    email = requisicao.params.email;


    execSQL(
        `SELECT senha from Acesso where email = '${email}'`,
        resposta
    );

})


//PRA VER SE FEZ LOGIN
rota.get('/Logado', (requisicao, resposta) => {
    execSQL(`print '${logado}'`, resposta);
})

rota.post('/Logado/:logado', (requisicao, resposta) => {
    logado = requisicao.params.logado;
})


//alterar informações de usuário
rota.patch('/Usuario/:email', (requisicao, resposta) => {

    const nome = requisicao.body.nome.substring(0, 50);
    const cpf = requisicao.body.cpf.substring(0, 14);
    const tel = requisicao.body.tel.substring(0, 20);
    email = requisicao.body.email.substring(0, 50);
    const senha = requisicao.body.senha.substring(0, 15);

    execSQL(
        `UPDATE Usuario SET 
             nome='${nome}', 
             CPF='${cpf}',
             telefone='${tel}',
             email='${email}',
             senha='${senha}' 
             WHERE email=${email}`,
        resposta);
})

rota.get('/Usuario/', (requisicao, resposta) => {

    execSQL(
        `SELECT * FROM Usuario where email = '${email}'`,
        resposta

    );
})



//Inserir gastos

rota.post('/Gasto/:tipo', (requisicao, resposta) => {
    const tipoGasto = requisicao.params.tipo;
    const nomeGasto = requisicao.body.nome.substring(0, 50);
    const valor = parseFloat(requisicao.body.valor.substring(0, 20));

    execSQL(
        `exec InserirGasto_sp
            @valor = ${valor},
            @nome = '${nomeGasto}',
            @tipo = '${tipoGasto}',
            @email = '${email}'`,
        resposta
    );
})

//APAGAR GASTOS


rota.delete('/GastoUsuario/:nome/:tipo', (requisicao, resposta) => {

    const tipo = requisicao.params.tipo;
    const nome = requisicao.params.nome;

    execSQL(
        `
                ExcluirGasto_sp
                @nome = '${nome}',
                @tipo = '${tipo}',
                @email = '${email}'
                `
    );

})


//AlterarGastos(especificamente, o valor)
rota.post('/Gasto/:nome/:tipo', (requisicao, resposta) =>{
    
    const valor = parseFloat(requisicao.body.valorNovo.substring(0,50));
    const nome = requisicao.params.nome.substring(0,50);
    const tipo = requisicao.params.tipo.substring(0,20);
    execSQL(
            `
            exec AlterarGasto_sp
            @nome = '${nome}',
            @valor = ${valor},
            @tipo = '${tipo}',
            @email = '${email}'`,
            resposta
            );
})



//mostrar nome e valor na tabela de gastos de um tipo específico
rota.get('/Gasto/:tipo', (requisicao, resposta) => {
    const tipo = requisicao.params.tipo;

    execSQL(
        `exec NomePreco_sp '${email}', '${tipo}'`,
        resposta
    );
})


//INSERIR SALÁRIO

rota.post('/Salarios', (requisicao, resposta) => {
    const salario = requsicao.body.salario.substring(0, 20);

    execSQL(
        `INSERT INTO Salarios values(${codUsuario},${salario})`,
        resposta
    );
})




