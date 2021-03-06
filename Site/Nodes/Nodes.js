const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const porta = 3000; //porta padrão
const sql = require('mssql');
const conexaoStr = "Server=regulus.cotuca.unicamp.br;Database=PR118183;User Id=PR118183;Password=PR118183;";
var email = "";

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


//alterar informações de usuário
rota.post('/UsuarioAlterar', (requisicao, resposta) => {

    const nome = requisicao.body.nome.substring(0, 50);
    const tel = requisicao.body.tel.substring(0, 20);
    const emailAntigo = requisicao.body.email.substring(0, 50);
    const emailNovo = requisicao.body.emailNovo.substring(0,50);
    const senha = requisicao.body.senha.substring(0, 15);

    execSQL(
        `exec AlterarDados_sp 
             @nome='${nome}',
             @tel='${tel}',
             @emailNovo='${emailNovo}',
             @senha='${senha}',
             @emailAntigo='${emailAntigo}'
        `,
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
                `,
        resposta
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

rota.post('/SLP', (requisicao, resposta) => {
    const salario = parseFloat(requisicao.body.salario.substring(0, 20));

    execSQL(
            `update SLP set salario = ${salario} where codUsuario in(select codUsuario from Usuario where email='${email}')`,
            resposta
            );
})




//VERIFICAR SE SALARIO É NULL

rota.get('/SLP',(requisicao,resposta) =>{
    execSQL(
            `SELECT salario,valorNegativo,totalDinheiroGuardado from SLP where codUsuario in(select codUsuario from Usuario where email='${email}')`,
            resposta
            );    
})

//MUDAR O STATUS DO ACESSO PARA LOGADO OU DESLOGADO

rota.post('/Acesso/:logado',(requisicao, resposta)=>{
    const logado = requisicao.params.logado.substring(0,1);
    
    execSQL(
                `update Acesso set logado='${logado}' where email='${email}'`,
                resposta
            );
})

//VERIFICAR SE STATUS É LOGADO

rota.get('/Logado',(requisicao, resposta)=>{
    execSQL(
                `select logado from Acesso where email='${email}'`,
                resposta
            );
})



//ADICIONAR DINHEIRO AO CAIXA DO USUÁRIO

rota.post('/SLP/:caixa',(requisicao,resposta)=>{
    const caixa  = requisicao.params.caixa;
   execSQL(
            `
                GuardarDinheiroNoCaixa_sp
                @email = '${email}',
                @caixa = ${caixa}
                
            `, 
            resposta
          );
})

//CONFIRMAR O PAGAMENTO DE UM GASTO

rota.post('/SLP/:nome/:tipo', (requisicao, resposta)=>{
    const nome = requisicao.params.nome;
    const tipo = requisicao.params.tipo;
    
    execSQL(
                `exec confirmarPagamento_sp 
                @nomeGasto='${nome}',
                @tipoGasto='${tipo}',
                @emailUsuario='${email}'`,
                resposta
           )
})

