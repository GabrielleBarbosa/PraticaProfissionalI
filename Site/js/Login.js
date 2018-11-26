//////////////////////////////////////////////////////////
function efetuarLogin()
{
    mudarSituacao("s");
    location.href = "Gastos.html";
}


//////////////////////////////////////////////////////////////////////
function enviarEmail()
{
    var email = $("#email").val();
    var regExEmail = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    var validaEmail = regExEmail.test(email);

    if(validaEmail && $("#senha").val() != "")
    {
        var xmlhttp = new XMLHttpRequest();
        var url = "http://localhost:3000/Acesso/"+ email;
        var cont = 0;
        xmlhttp.onreadystatechange=function()
        {
            var s = JSON.stringify(this.responseText);
            cont++;
                
            if(cont > 2)
            {
                if(s != '""')
                {
                    var senha =  JSON.parse(this.responseText);
                    if($("#senha").val() == senha[0].senha)
                        efetuarLogin();
                    else 
                        abrirModal("Email ou senha incorretos");
                }
                else
                    abrirModal("Email ou senha incorretos");
            }

        }
        
        xmlhttp.open("GET", url,true);
        xmlhttp.send();
    }
    else
        abrirModal("Digite os dados corretamente");
}

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


