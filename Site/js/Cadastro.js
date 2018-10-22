//////////////////////////////////////////////////////////
var texto = "";
function efetuarCadastro()
{
    if(validarSenha() && validarNome() && validarTelefone() && validarEmail())
    {
        cadastrar($("#formularioCadastro"));
        document.getElementById("menu").innerHTML = ("<li><a href='Gastos.html'>Seus Gastos</a></li><li><a href='Home.html'>Home</a></li><li><a href='Login.html'>Login</a></li><li><a href='Cadastro.html' class='waves-effect waves-light btn'>Cadastre-se</a></li>");
    }
    else 
       alert(texto); 
}

function validarSenha()
{
    texto="";
    var senha1 = $("#senha").val();
    var senha2 = $("#senha2").val();
    if(senha1 === "" || senha2 === "")
    {
        senha1===""?$("#senha").focus():$("#senha2").focus();
        texto = "Digite os campos de senha";
        return false;
    }
    else if(senha1 !== senha2)
    {
        $("#senha1").focus();
        texto = "Os campos de senha não estão compatíveis";
        return false;
    }
    return true;
}

function validarTelefone()
{
    if($("#tel").validate())
    {
       texto += "\nDigite o telefone em um formato correto(99999999999)";
       return false;
    }
    return true;
}

function validarNome()
{

    if($("#nome").val() == "")
    {
        texto += "\nDigite o seu nome";
        return false;
    }
    else
        return true;
}

function validarEmail()
{
    if($("#email").validate())
    {
        return false;
        texto += "\nDigite o seu email corretamente";
    }
    return true;
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