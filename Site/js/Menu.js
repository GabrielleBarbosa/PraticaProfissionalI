var menu = document.getElementById("menu");
var emailLogado = "";

function Menu()
{
    if(logado == true)
        menu.InnerHTML = ("<li><a href='Gastos.html'>Seus Gastos</a></li><li><a href='Home.html'>Home</a></li><li><a href='Login.html'>Login</a></li><li><a href='Relatorio.html'>Relatórios</a></li><li><a href='Cadastro.html' class='waves-effect waves-light btn'>Cadastre-se<i class='material-icons right'></i></a></li>");
    else
        menu.InnerHTML = ("<li><a href='Home.html'>Home</a></li><li><a href='Login.html'>Login</a></li><li><a href='Relatorio.html'>Relatórios</a></li><li><a href='Cadastro.html' class='waves-effect waves-light btn'>Cadastre-se<i class='material-icons right'></i></a></li>");
}
