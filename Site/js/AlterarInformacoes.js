//////////////////////////////////////////////////////////
var texto="";
var email="";
var emailNovo="";
var senhaAntiga;
function efetuarAlteracoes(form)
{
    var nome = $("#nome");
    var tel = $("#tel");
    email = $("#email");
    emailNovo = $("#emailNovo");

    var regExTel = /^(?:\+\d{2}\s?)??\(?\d{2}?\)?\s?\d{4,5}-?\d{4}$/;
    var regExEmail = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    var validaEmail = regExEmail.test(email.val());
    var validaEmailNovo = regExEmail.test(emailNovo.val());
    var validaTel = regExTel.test(tel.val());

    if(validaSenha() && validaEmail && validaTel && nome.val() != "")
    {
        verificarEmailAntigo(form);
    }
    else 
       abrirModal("Verifique se os campos estão preenchidos corretamente!");
}

/////////////////////////////////////////////////////////////

verificarEmailAntigo = function(form){
    
    var xmlhttp = new XMLHttpRequest();
    var url = "http://localhost:3000/Acesso/"+ email.val();
    var cont = 0; 
    xmlhttp.onreadystatechange=function()
    {
        var a = JSON.stringify(this.responseText);
        cont++;
        
        if (cont > 2)
        {
            if(a != '""')
            {
                var a = JSON.parse(this.responseText);
                senhaAntiga = a[0].senha;
                verificarEmailNovo();
            }
            else
            {
                abrirModal("Email antigo não consta no registro");
            }
        }
            
    }

    xmlhttp.open("GET", url,true);
    xmlhttp.send();
}

function verificarEmailNovo()
{
    var xmlhttp = new XMLHttpRequest();
    var url = "http://localhost:3000/Acesso/"+ emailNovo.val();
    alert(emailNovo.val());
    var cont = 0; 
    xmlhttp.onreadystatechange=function()
    {
        var a = JSON.stringify(this.responseText);
        alert(senhaAntiga);
        if(a != '""')
        {
            abrirModal("Email novo já consta no registro de outra conta");
        }
        else
        {
            if(senhaAntiga == $("#senha1").val())
                {
                     alterar($("#formularioAlt"));
                }
            else 
               abrirModal("Senha não compatível com o email antigo fornecido");
        }
        
            
    }
    xmlhttp.open("GET", url,true);
    xmlhttp.send();
}

/////////////////////////////////////////////////////////////

function validaSenha()
{
    var senhaNova = $("#senha").val();
    var senhaAntiga = $("#senha1").val();
    var senhaConfirma = $("#senha2").val();
    if(senhaNova === "" || senhaAntiga === "" ||senhaConfirma ==="")
    {
        senhaAntiga===""?$("#senhaNova").focus():$("#senhaConfirma").focus();
        return false;
    }
    else if(senhaNova !== senhaConfirma)
    {
        $("#senha").focus();
        return false;
    }
    else if(senhaNova == senhaAntiga)
    {
        $("#senha").focus();
        return false;
    }
    return true;
}

//////////////////////////////////////////////////////////////////////
alterar = function(form){
    $.post( "http://localhost:3000/UsuarioAlterar", form.serialize() ).done(function(data){
        if (!data.erro) {
            //window.location.href = "AlteracaoEfetuada.html";
        }
        alert(data.mensagem);
    });
};

/////////////////////////////////////////////////////////////////////////
var modal = document.getElementById("modalAviso");
var span = document.getElementsByClassName("close")[0];

abrirModal = function(texto){
    $("#h5ModalAviso").html(texto);
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