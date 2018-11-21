//////////////////////////////////////////////////////////
var texto="";
function efetuarCadastro(form)
{
    var nome = $("#nome");
    var tel = $("#tel");
    var email = $("#email");
    var cpf = $("#cpf");

    var regExTel = /^(?:\+\d{2}\s?)??\(?\d{2}?\)?\s?\d{4,5}-?\d{4}$/;
    var regExCpf = /^\d{3}.\d{3}.\d{3}-\d{2}$/;
    var regExEmail = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    var validaEmail = regExEmail.test(email.val());
    var validaTel = regExTel.test(tel.val());
    var validaCpf = regExCpf.test(cpf.val());

    if(validaSenha() && validaEmail && validaTel && validaCpf && nome.val() != "")
    {
        if(verificarEmail(email.val()));
        {
            cadastrar(form);
            //window.location.href = "CadastroEfetuado.html";
        }
    }
    else 
       abrirModal("Digite os campos corretamente");
}

verificarEmail = function(email){
    
    var xmlhttp = new XMLHttpRequest();
    var url = "http://localhost:3000/Acesso/" + email;

    xmlhttp.onreadystatechange=function()
    {
        var s = JSON.stringify(this.responseText);
        alert(s);
        if(s != "")
        {
            abrirModal("Email já está cadastrado no sistema");
            return false;
        }
        else 
            return true;
    }

    xmlhttp.open("GET", url,true);
    xmlhttp.send();
}

function validaSenha()
{
    var senha1 = $("#senha").val();
    var senha2 = $("#senha2").val();
    if(senha1 === "" || senha2 === "")
    {
        senha1===""?$("#senha").focus():$("#senha2").focus();
        return false;
    }
    else if(senha1 !== senha2)
    {
        $("#senha").focus();
        return false;
    }
    return true;
}

/////////////////////////////CADASTRO DO USUÁRIO/////////////////////////////////////////
cadastrar = function(form){
    $.post( "http://localhost:3000/Usuario", form.serialize() ).done(function(data){
        if (!data.erro) {
            form.each(function(data){
                this.reset();
            });
        }
        alert(data.mensagem);
    });
};

/////////////////////////////MODAL AVISO////////////////////////////////////////////
var modal = document.getElementById("modalAviso");
var span = document.getElementsByClassName("close")[0];

abrirModal = function(texto){
    $("h5").html(texto);
    modal.style.display = "block";
}

window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
};

span.onclick = function(){
    modal.style.display = "none";
}


