//////////////////////////////////////////////////////////
var texto="";
function efetuarCadastro(form)
{
    var nome = $("#nome");
    var tel = $("#tel");
    var email = $("#email");
    var cpf = $("#cpf");

    var regExTel = /^(?:\+\d{2}\s?)??\(?\d{2}?\)?\s\d{4,5}-?\d{4}$/;
    var regExCpf = /^\d{3}.\d{3}.\d{3}-\d{2}$/;
    var regExEmail = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    var validaEmail = regExEmail.test(email.val());
    var validaTel = regExTel.test(tel.val());
    var validaCpf = regExCpf.test(cpf.val());

    if(validaSenha() && validaEmail && validaTel && validaCpf && nome.val() != "")
    {
        //cadastrar($("#formularioCadastro"));
        document.getElementById("menu").innerHTML = ("<li><a href='Gastos.html'>Seus Gastos</a></li><li><a href='Home.html'>Home</a></li><li><a href='Login.html'>Login</a></li><li><a href='Cadastro.html' class='waves-effect waves-light btn'>Cadastre-se</a></li>");
    }
    else 
       alert("Verifique se os campos estão preenchidos corretamente!"); 
}

function validaSenha()
{
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
        $("#senha").focus();
        texto = "Os campos de senha não estão compatíveis";
        return false;
    }
    return true;
}

//////////////////////////////////////////////////////////////////////
cadastrar = function(form){
    $.post( "http://localhost:3000/Usuario/", form.serialize() ).done(function(data){
        if (!data.erro) {
            form.each(function(data){
                $("#nome").val() = "";
                $("#senha").val() = "";
                $("#senha2").val() = "";
                $("#tel").val() = "";
                $("#email").val() = "";
                $("#cpf").val() = "";
                this.reset();
            });
        }
        alert(data.mensagem);
    });
};