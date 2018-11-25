function verificarLog()
{
    var xmlhttp = new XMLHttpRequest();

    var url = "http://localhost:3000/Logado";

    var cont = 0;
    xmlhttp.onreadystatechange=function()
    {
        var logado = JSON.stringify(this.responseText);
        cont++;

        if(cont > 2)
        {
            var logado = JSON.parse(this.responseText);
            if(logado[0].logado == "s")
                document.getElementById("menu").innerHTML = "<li><a href='Gastos.html' style='background-color: #2ECCFA; border-radius: 100px;'>Seus Gastos</a></li><li><a href='Home.html'>Home</a></li><li><a onclick='mudarSituacao(\"n\"); redirecionar(\"Home.html\")'>Deslogar</a></li>";
            else if(logado[0].logado == "n")
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
        
            }); 
}

function redirecionar(pagina)
{
    window.location.href = pagina;
}