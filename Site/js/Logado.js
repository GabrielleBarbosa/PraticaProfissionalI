function VerificarLog()
{
    var xmlhttp = new XMLHttpRequest();

    var url = "http://localhost:3000/Logado";

    xmlhttp.onreadystatechange=function()
    {
        var logado = this.responseText;
        alert(logado);

        if(logado == "true")
            document.getElementById("menu").innerHTML = "<li><a href='Gastos.html'>Seus Gastos</a></li><li><a href='Home.html'>Home</a></li><li><a href='Login.html'>Login</a></li><li><a href='Cadastro.html' class='waves-effect waves-light btn' >Cadastre-se</a></li>";

    }

    xmlhttp.open("GET", url,true);
    xmlhttp.send();
}