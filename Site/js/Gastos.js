var tipoAtual = "";

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

/////////////////////////////////////
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
    
/////////////////////////////////////
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
///////////////////////////////////
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





