var tipoAtual = "";  //tipo de gasto que a pessoa está
var salario;
var valorNegativo;   // o total de todos os gastos

/////////////////////////////////////
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
                excluir(val.nome);
            });
            // fim do botao excluir

            tdBotoes = $("<td />");

            tdBotoes.append(btnAlterar);
            tdBotoes.append(btnExcluir);
            
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

/////////////////////////VERIFICAR SALARIO//////////////////////////////////////////
function verificarSalario()
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

            if(salario != 0)
            {
                $("#btnInsercaoSalario").hide();
                $("#btnSituacao").show();
                $("#btnAlteracaoSalario").show();
            }
            else
            {
                $("#btnSituacao").hide();
                $("#btnAlteracaoSalario").hide();
                $("#btnInsercaoSalario").show();
            }
        }
    }

    xmlhttp.open("GET", url,true);
    xmlhttp.send();
}

/////////////////////////////////////EXCLUIR GASTOS/////////////////////////////////////////////
excluir = function(nome){ 
    if(confirm("Tem certeza que deseja excluir?")){
            $.ajax({
                url: "http://localhost:3000/Gasto/"+nome+"/"+tipoAtual,
                type: 'DELETE'
            }).done(function(){
                //chamar listarItem
                listarGastos(tipoAtual);

            }); //done
    }
    listarGastos(tipoAtual);
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
    $("#modalAlt").closeModal();
    listarGastos(tipoAtual);
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
    $("#modalAlt").closeModal();
    listarGastos(tipoAtual);
};

//////////////////ALTERA E INSERE SALARIO////////////////////////////////////////
salarioIA = function(form){
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
    $("#modalInserirSalario").closeModal();
    verificarSalario();
}

/////////////////////////////////////////MODAL INCLUSAO//////////////////////////////////////////////////////
// Get the modal
var modal = document.getElementById('modalInc');

// Get the button that opens the modal
var btnInclusao = document.getElementById("btnInclusao");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// Get the link CANCELAR
var btnCancelar = document.getElementById("btnCancelar");

var btnCadastrar = document.getElementById("btnIncluir");

// When the user clicks on the button, open the modal 
btnInclusao.onclick = function() {
    modal.style.display = "block";
    
};

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
    modal.style.display = "none";
};

// When the user clicks on <span> (x), close the modal
btnCancelar.onclick = function() {
    modal.style.display = "none";
};

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
};

// When the user clicks on the button, open the modal 
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
var modal2 = document.getElementById('modalAlt');

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
    modal2.style.display = "block";
};

// When the user clicks on <span> (x), close the modal
span2.onclick = function() {
    modal2.style.display = "none";
    listarGastos(tipoAtual);
};

// When the user clicks on <span> (x), close the modal
btnCancelar2.onclick = function() {
    modal2.style.display = "none";
};

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == modal2) {
        modal2.style.display = "none";
    }
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

/////////////////////////////////////////MODAL AVISO/////////////////////////////////////////////////////////////////////////////
var modalAviso = document.getElementById("modalAviso");
var span3 = document.getElementsByClassName("close")[2];
var btnCancelar3 = document.getElementById("btnCancelar3");
var btnDeslogar = document.getElementById("btnDeslogar");
var pagina;

abrirModalAviso = function(texto, texto2){
    pagina = texto;
    $("h5").html(texto2);
    modalAviso.style.display = "block";
}

window.onclick = function(event) {
    if (event.target == modalAviso) {
        modalAviso.style.display = "none";
    }
};

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


//////////////////////////////////MODAL SALARIO/////////////////////////////////////////////////////////////////////////

var modalSalario = document.getElementById("modalSalario");
var span4 = document.getElementsByClassName("close")[3];
var btnCancelar4 = document.getElementById("btnCancelar4");
var btnSalario = document.getElementById("btnSalario");


abrirModalSalario = function(texto){
    if(texto == "inserir")
    {
        $("#h3Salario").html("Insira seu salário");
        $("h7").html("");
    }
    else
    {
        $("#h3Salario").html("Altere seu salário");
        $("h7").html("Salário antigo:" + salario);
    }
    
    modalSalario.style.display = "block";
}

window.onclick = function(event) {
    if (event.target == modal2) {
        modalSalario.style.display = "none";
    }
};

span4.onclick = function(){
    modalSalario.style.display = "none";
}

btnSalario.onclick = function(){
    salarioIA($("#frmInserirSalario"));
}

btnCancelar4.onclick = function(){
    modalSalario.style.display = "none";
}
//////////////////////////////////MODAL SITUACAO////////////////////////////////////////////////////////////////////////

var modalSituacao = document.getElementById("modalSituacao");
var span5 = document.getElementsByClassName("close")[4];


abrirModalSituacao = function(){
    var slp = salario-valorNegativo;
    $("#h5TotalDosGastos").html(valorNegativo);
    
    if(slp< 0)
        $("#h5Situacao").html("Sua situação financeira não está boa, você possui um saldo negativo. <br>Saldo: "+slp);
    else
        $("#h5Situacao").html("Por enquanto você possui dinheiro sobrando! <br>Saldo: " +slp); 
    
    modalSituacao.style.display = "block";
}

window.onclick = function(event) {
    if (event.target == modalSituacao) {
        modalSituacao.style.display = "none";
    }
};

span5.onclick = function(){
    modalSituacao.style.display = "none";
}

