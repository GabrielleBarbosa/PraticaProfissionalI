// Get the modal
var modal = document.getElementById('modalInc');

// Get the button that opens the modal
var btnInclusao = document.getElementById("btnInclusao");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// Get the link CANCELAR
var btnCancelar = document.getElementById("btnCancelar");

var btnCadastrar = document.getElementById("btnCadastrar");

// Aponta para tabela do index.php 
var tblItens = $("#tblListar");

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
    cadastrar($("#formCadastro"));
};

listarClientes("tbody");


