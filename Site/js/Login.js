//////////////////////////////////////////////////////////
var texto = "";
function efetuarLogin()
{
    document.getElementById("menu").innerHTML = ("<li><a href='Gastos.html'>Seus Gastos</a></li><li><a href='Home.html'>Home</a></li><li><a href='Login.html'>Login</a></li><li><a href='Cadastro.html' class='waves-effect waves-light btn'>Cadastre-se<i class='material-icons right'></i></a></li>");
}


//////////////////////////////////////////////////////////////////////
cadastrar = function(form){
    $.post( "http://localhost:3000/Usuario/", form.serialize() ).done(function(data){
        if (!data.erro) {
            form.each(function(data){
                //limpar formulário
                this.reset();
            });
        }
        alert(data.mensagem);
    });
};