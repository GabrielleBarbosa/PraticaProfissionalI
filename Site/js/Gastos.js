var tipoAtual = "";  //tipo de gasto que a pessoa está
var salario;
var valorNegativo;   // o total de todos os gastos
var valorGuardado;
var nome = "";

//////////////////////////////////////////////////////////////////////////////
listarGastos = function (tipo) {

    tipoAtual = tipo;
    $("#valores").empty();

    $.ajax({
        url : "http://localhost:3000/Gasto/" + tipo

    }).done(function(dados){

        $.each(dados, function(key, val) {
            
            //variável tr para dar um append de linha na tabela
            tr = $("<tr/>");

            // --- criar botao ALTERAR que vai ser um link
            btnAlterar = $("<a />").attr({
                    title: "Alterar gasto",
                    href:  "#modalAlteracao"
            });

            icone = $("<img />").attr({ class: "botao",
                                        title: "Alterar gasto",
                                        src: "Imagens/edit.png" });
            btnAlterar.append(icone);
            btnAlterar.click(function(){
                abrirModal(val.nome, val.valor);
            });
            // fim do botao alterar

            // --- criar botao EXCLUIR que vai ser um link
            var btnExcluir = $("<a />").attr({
                                        title: "Excluir gasto",
                                        href:  "#" });

            icone = $("<img />").attr({ class: "botao",
                                        title: "Excluir gasto",
                                        src: "Imagens/delete.png" });
            btnExcluir.append(icone);
            btnExcluir.click(function(){
                abrirModalExclusao(val.nome);
            });
            // fim do botao excluir
            
            // --- botao Confirma 
            var btnConfirma = $("<a />").attr({
                                        title: "Confirmar pagamento",
                                        href:  "#" });

            icone = $("<img />").attr({ class: "botao",
                                        title: "Confirmar pagamento",
                                        src: "Imagens/confirmaPagamento_icon.png" });
            btnConfirma.append(icone);
            btnConfirma.click(function(){
                abrirModalConfirma(val.nome);
            });
            // fim do botao confirma

            tdBotoes = $("<td />");

            tdBotoes.append(btnAlterar);
            tdBotoes.append(btnExcluir);
            tdBotoes.append(btnConfirma);
            
            //colunas da tabela
            if(val.nome == "Total")
            {
                tr.append($("<td style='color: red;' />").text(val.nome));
                if (val.valor == null)
                    tr.append($("<td />").text("R$ 0.00"));
                else
                    tr.append($("<td />").text("R$ " + val.valor));
                tr.append("<td></td>");
            }
            else
            {
                tr.append($("<td />").text(val.nome));
                if (val.valor != null)
                    tr.append($("<td />").text("R$ " + val.valor));
                
                tr.append(tdBotoes);
            }

             

            //adiciona a linha acima montada na tabela
            $("tbody").append(tr);
        });
    }); //ajax
        
}; 

/////////////////////////ATUALIZAR VALORES//////////////////////////////////////////
function atualizarValores()
{
    var xmlhttp = new XMLHttpRequest();
    var url = "http://localhost:3000/SLP/";
    
    var cont = 0;
    xmlhttp.onreadystatechange=function()
    {
        var s =  JSON.stringify(this.responseText);
        cont++;
        
        if(cont > 2)
        {
            var s =  JSON.parse(this.responseText);
            salario = parseFloat(s[0].salario);
            valorNegativo = parseFloat(s[0].valorNegativo);
            valorGuardado = parseFloat(s[0].totalDinheiroGuardado);
        }
    }

    xmlhttp.open("GET", url,true);
    xmlhttp.send();
}

/////////////////////////////////////ADICIONAR AO CAIXA(DINHEIRO GUARDADO)/////////////////////////////////////////////
adicionarAoCaixa = function(caixa){ 
        $.ajax({
            url: "http://localhost:3000/SLP/"+caixa,
            type: 'POST'
        }).done(function(){
            //chamar listarItem
            listarGastos(tipoAtual);

        }); //done
    listarGastos(tipoAtual);
    atualizarValores();
};

/////////////////////////////////////EXCLUIR GASTOS/////////////////////////////////////////////
excluir = function(nome){ 
            $.ajax({
                url: "http://localhost:3000/GastoUsuario/"+nome+"/"+tipoAtual,
                type: 'DELETE'
            }).done(function(){
                //chamar listarItem
                listarGastos(tipoAtual);

            }); //done
    listarGastos(tipoAtual);
    atualizarValores();
    modalExclusao.style.display = "none";
};
    
/////////////////////////////////////INCLUIR GASTOS////////////////////////////////////////////////
incluir = function(form, tipo){
    $.post( "http://localhost:3000/Gasto/" + tipo, form.serialize() ).done(function(data){
        if (!data.erro) {
            form.each(function(data){
                    this.reset();
            });
            
        }
        alert(data.mensagem);
    });
    form.each(function(){
            this.reset();
    });
    modalInclusao.style.display = "none";
    listarGastos(tipoAtual);
    atualizarValores();
};   

///////////////////////////////////ALTERAR GASTOS/////////////////////////////////////////////
alterar = function(form, nome){
     $.post( "http://localhost:3000/Gasto/" + nome + "/" + tipoAtual, form.serialize() ).done(function(data){
        if (!data.erro) {
            form.each(function(){
                    this.reset();
            });
        }
        alert(data.mensagem);

    });
    form.each(function(){
            this.reset();
    });
    modalAlteracao.style.display = "none";
    listarGastos(tipoAtual);
    atualizarValores();
};

//////////////////ALTERA E INSERE SALARIO////////////////////////////////////////
salarioIA = function(form, salario){
    $.post("http://localhost:3000/SLP/",
    form.serialize()).done(function(data){
        if(!data.erro) {
            form.each(function(){
                    this.reset();
            });
        }
        alert(data.mensagem);
    });
    form.each(function(){
            this.reset();
    });
    adicionarAoCaixa(salario);
    modalGanhos.style.display = "none";
    atualizarValores();
}
/////////////////////////////////////////CONFIRMA PAGAMENTO////////////////////////////////////////////////////
confirmarPagamento = function(nome){ 
            $.ajax({
                url: "http://localhost:3000/SLP/"+nome+"/"+tipoAtual,
                type: 'POST'
            }).done(function(){
                //chamar listarItem
                listarGastos(tipoAtual);
            }); //done
    listarGastos(tipoAtual);
    atualizarValores();
    modalConfirma.style.display = "none";
};
/////////////////////////////////////////MODAL INCLUSAO//////////////////////////////////////////////////////
// pega o modal
var modalInclusao = document.getElementById('modalInc');

//pega o botao que abre o modal
var btnInclusao = document.getElementById("btnInclusao");

// pega o span('x' que fecha o modal)
var span = document.getElementsByClassName("close")[0];

// pega o link CANCELAR
var btnCancelar = document.getElementById("btnCancelar");

var btnCadastrar = document.getElementById("btnIncluir");

//quando clicar no botão, o modal abre
btnInclusao.onclick = function() {
    modalInclusao.style.display = "block";
    
};

//quando o usuário clicar no 'x', o modal fecha
span.onclick = function() {
    modalInclusao.style.display = "none";
};

//quando o usuário clicar no botão cancelar, o modal fecha
btnCancelar.onclick = function() {
    modalInclusao.style.display = "none";
};

btnCadastrar.onclick = function() {
    var regExValor = /^[0-9]*\.[0-9]{2}$/;
    var validaValor = regExValor.test($("#valor").val());
    
    var tipo = $("input[name='tipo']:checked").val();

    alert(tipo);
    
    if(validaValor && $("#nome").val() != "")
        incluir($("#formInclusao"), tipo);
    else
        alert("Não foi possível incluir, verifique os dados! \nOBS: o valor deve ter duas casas decimais(99.99)");
};

/////////////////////////////////////////MODAL ALTERAÇÃO//////////////////////////////////////////////////////
// Get the modal
var modalAlteracao = document.getElementById('modalAlt');

// Get the <span> element that closes the modal
var span2 = document.getElementsByClassName("close")[1];

// Get the link CANCELAR
var btnCancelar2 = document.getElementById("btnCancelar2");

var btnAlteracao = document.getElementById("btnAlteracao");

var nomeA = "";

// When the user clicks on the button, open the modal 
abrirModal = function(n, v) {
    nomeA = n;
    $("#nomeAlt").text("Gasto: " + n);
    $("#tipoAlt").text("Tipo: " + tipoAtual);
    $("#valorAlt").text("ValorAntigo: " + v);
    modalAlteracao.style.display = "block";
};

// When the user clicks on <span> (x), close the modal
span2.onclick = function() {
    modal2.style.display = "none";
    listarGastos(tipoAtual);
};

// When the user clicks on <span> (x), close the modal
btnCancelar2.onclick = function() {
    modalAlteracao.style.display = "none";
};

// When the user clicks on the button, open the modal 
btnAlteracao.onclick = function() {
    var regExValor = /^[0-9]*\.[0-9]{2}$/;
    var validaValor = regExValor.test($("#valorNovo").val());
    
    if(validaValor)
        alterar($("#formAlteracao"), nomeA);
    else
        alert("Não foi possível alterar, verifique os dados! \nOBS: o valor deve ter duas casas decimais(99.99)");
};

//////////////////////////////////MODAL EXCLUSAO///////////////////////////////////////////////////////////////////////////

var modalExclusao = document.getElementById("modalExclusao");
var span6 = document.getElementsByClassName("close")[2];
var btnCancelar5 = document.getElementById("btnCancelar5");
var btnExclusao = document.getElementById("btnExclusao");

abrirModalExclusao = function(n){
    nome = n;
    modalExclusao.style.display = "block";
}

span6.onclick = function(){
    modalExclusao.style.display = "none";
}

btnExclusao.onclick = function(){
    excluir(nome)
}

btnCancelar5.onclick = function(){
    modalExclusao.style.display = "none";
}

/////////////////////////////////////////MODAL AVISO/////////////////////////////////////////////////////////////////////////////
var modalAviso = document.getElementById("modalAviso");
var span3 = document.getElementsByClassName("close")[3];
var btnCancelar3 = document.getElementById("btnCancelar3");
var btnDeslogar = document.getElementById("btnDeslogar");
var pagina;

abrirModalAviso = function(texto, texto2){
    pagina = texto;
    $("h5").html(texto2);
    modalAviso.style.display = "block";
}
span3.onclick = function(){
    modalAviso.style.display = "none";
}

btnDeslogar.onclick = function(){
    mudarSituacao("n");
    location.href = pagina;
}

btnCancelar3.onclick = function(){
    modalAviso.style.display = "none";
}


//////////////////////////////////MODAL INSERIR GANHOS/////////////////////////////////////////////////////////////////////////

var modalGanhos = document.getElementById("modalGanhos");
var span4 = document.getElementsByClassName("close")[4];
var btnCancelar4 = document.getElementById("btnCancelar4");
var btnGanhos = document.getElementById("btnGanhos");


abrirModalSalario = function(texto){
    
    $("#h3Salario").html("Adicione seu salário/Adicione dinheiro ao caixa");
    $("h7").html("Último salário recebido:" + salario);
    
    
    modalGanhos.style.display = "block";
}

span4.onclick = function(){
    modalGanhos.style.display = "none";
}

btnGanhos.onclick = function(){
    var regExValor = /^[0-9]*\.[0-9]{2}$/;
    var validaValorSalario = regExValor.test($("#salario").val());
    var validaValorGanho = regExValor.test($("#dinheiro").val());
    
    if(!validaValorSalario && !validaValorGanho)
        alert("Não foi possível alterar, verifique os dados! \n\nOBS: Pelo menos um dos valores deve estar preenchido e ter duas casas decimais(99.99)");
    else
    {
        var salario = $("#salario").val();
        var dinheiro = $("#dinheiro").val();
        
        if(validaValorSalario)
            salarioIA($("#frmInserirSalario"), salario);
        if(validaValorGanho)
            adicionarAoCaixa(dinheiro);
        
        $("#frmModalSituacao").each = function(){
            this.reset();
        }
    }
}

btnCancelar4.onclick = function(){
    modalGanhos.style.display = "none";
}

//////////////////////////////////MODAL SITUACAO////////////////////////////////////////////////////////////////////////

var modalSituacao = document.getElementById("modalSituacao");
var span5 = document.getElementsByClassName("close")[5];


abrirModalSituacao = function(){
    var slp = valorGuardado-valorNegativo;
    
    if(slp< 0)
        $("#h4Situacao").html("Sua situação financeira não está boa, você possui um saldo negativo.");
    else
        $("#h4Situacao").html("Por enquanto você possui dinheiro sobrando!"); 
    
    $("#h5TotalDosGastos").html("Total dos Gastos: " + valorNegativo);
    $("#h5TotalGuardado").html("Total Guardado: " + valorGuardado);
    $("#h5Saldo").html("Saldo: " +slp);
    
    modalSituacao.style.display = "block";
}

span5.onclick = function(){
    modalSituacao.style.display = "none";
}

//////////////////////////////////MODAL CONFIRMA PAGAMENTO////////////////////////////////////////////////////////////////////////

var modalConfirma = document.getElementById("modalConfirma");
var btnConfirmaPagamento = document.getElementById("btnConfirmaPagamento");
var btnCancelar6 = document.getElementById("btnCancelar6");
var span6 = document.getElementsByClassName("close")[6];

abrirModalConfirma = function(n){
    nome = n;
    alert(nome);
    modalConfirma.style.display = "block";
}

btnConfirmaPagamento.onclick = function(){
    confirmarPagamento(nome);
}

span6.onclick = function(){
    modalConfirma.style.display = "none";
}

btnCancelar6.onclick = function(){
    modalConfirma.style.display = "none";
}

