function verificarLog()
{
    var xmlhttp = new XMLHttpRequest();

    var url = "http://localhost:3000/Acesso/logado";

    var cont = 0;
    xmlhttp.onreadystatechange=function()
    {
        var logado = JSON.stringify(this.responseText);
        cont++;
        alert(logado);

        if(cont > 2)
        {
            if(logado == "s")
                document.getElementById("menu").innerHTML = "<li><a href='Gastos.html'>Seus Gastos</a></li><li><a href='Home.html'>Home</a></li><li><a href='Login.html'>Login</a></li><li><a href='Cadastro.html' class='waves-effect waves-light btn' >Cadastre-se</a></li>";
            else if(logado == "n")
                document.getElementById("menu").innerHTML = "<li><a href='Home.html'>Home</a></li><li><a href='Login.html'>Login</a></li><li><a href='Cadastro.html' class='waves-effect waves-light btn' >Cadastre-se</a></li>";
        }

    }

    xmlhttp.open("GET", url,true);
    xmlhttp.send();
}

function verificarLogGastos()
{
    var xmlhttp = new XMLHttpRequest();

    var url = "http://localhost:3000/Logado";

    var cont = 0;
    xmlhttp.onreadystatechange=function()
    {
        var logado = JSON.stringify(this.responseText);
        cont++;
        alert(logado);

        if(cont > 2)
        {
            var logado = JSON.parse(this.responseText);
            if(logado[0].logado == "n")
                window.location.href = "Home.html";
        }

    }

    xmlhttp.open("GET", url,true);
    xmlhttp.send();
}

function mudarSituacao(logado)
{
    $.ajax({
                url: "http://localhost:3000/Acesso/"+logado,
                type: 'POST'
            }).done(function(){
                location.href = "Home.html"
            }); 
}