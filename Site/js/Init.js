/////////////////////////////////////////MODAL//////////////////////////////////////////////////////
// Get the modal
var modal = document.getElementById('modalInc');

// Get the button that opens the modal
var btnInclusao = document.getElementById("btnInclusao");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// Get the link CANCELAR
var btnCancelar = document.getElementById("btnCancelar");

var btnCadastrar = document.getElementById("btnIncluir");

// Aponta para tabela do Gastos.html 
var tblItens = $("#tabela");

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
    var regExValor = /^[0-9]*,[0-9]{2}$/;
    var validaValor = regExValor.test($("#valor").val());

    if(validaValor && $("#nome").val() != "")
        incluir($("#formInclusao"));
    else
        alert("Não foi possível incluir, verifique os dados! \nOBS: o valor deve ter duas casas decimais");
};

listarGastos(tipoAtual);