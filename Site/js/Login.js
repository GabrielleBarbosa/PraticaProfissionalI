//////////////////////////////////////////////////////////
function efetuarLogin()
{
    document.getElementById("menu").innerHTML = ("<li><a href='Gastos.html'>Seus Gastos</a></li><li><a href='Home.html'>Home</a></li><li><a href='Login.html'>Login</a></li><li><a href='Cadastro.html' class='waves-effect waves-light btn'>Cadastre-se<i class='material-icons right'></i></a></li>");
}


//////////////////////////////////////////////////////////////////////
function EnviarEmail(){
    var xmlhttp = new XMLHttpRequest();
    var url = "http://localhost:3000/Acesso/"+ $("#email").val();
    xmlhttp.open("GET", url,true);
    xmlhttp.send();
    
    xmlhttp.onreadystatechange=function(){
        if(this.readyState == 4 && this.status == 200){
            var senha =  JSON.parse(this.responseText);
            if($("#senha").val() == senha)
               efetuarLogin();
            else
                alert("Seu email ou senha estão errados, por favor reescreva-os");
        }
    }
}

