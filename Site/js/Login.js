//////////////////////////////////////////////////////////
function efetuarLogin()
{
    location.href = "Gastos.html";
    document.getElementById("menu").innerHTML = ("<li><a href='Gastos.html'>Seus Gastos</a></li><li><a href='Home.html'>Home</a></li><li><a href='Login.html'>Login</a></li><li><a href='Relatorio.html'>Relatórios</a></li><li><a href='Cadastro.html' class='waves-effect waves-light btn'>Cadastre-se<i class='material-icons right'></i></a></li>");
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

        xmlhttp.onreadystatechange=function()
        {
            var senha =  JSON.parse(this.responseText);
            if(senha[0] == "123")
            {
                if($("#senha").val() == senha[0])
                    efetuarLogin();
                else 
                    alert("sua mãe");
            }
            else
                alert("Email ou senha incorretos");
        }
        
        xmlhttp.open("GET", url,true);
        xmlhttp.send();
        
    }
    else
        alert("Digite os dados corretamente");
}

