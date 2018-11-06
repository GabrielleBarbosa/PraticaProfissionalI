var tipoAtual = "";

/////////////////////////////////////
listarGastos = function (tipo) {

    tipoAtual = tipo;
    $("#valores").empty();

    $.ajax({
        url : "http://localhost:3000/Gasto/" + tipo

    }).done(function(dados){

        $.each(dados, function(key, val) {
            
            //variável tr para dar um append de linha na tabela
            tr = $("<tr/>");

            // --- criar botao ALTERAR que vai ser um link
            var btnAlterar = $("<a />").attr({
                    title: "Alterar gasto",
                    href:  "#modalAlteracao"
            });

            icone = $("<img />").attr({ class: "botao",
                                        title: "Alterar gasto",
                                        src: "Imagens/edit.png" });
            btnAlterar.append(icone);
            // fim do botao alterar

            // --- criar botao EXCLUIR que vai ser um link
            var btnExcluir = $("<a />").attr({
                                        title: "Excluir gasto",
                                        href:  "#" });

            icone = $("<img />").attr({ class: "botao",
                                        title: "Excluir gasto",
                                        src: "Imagens/delete.png" });
            btnExcluir.append(icone);
            btnExcluir.click(function(){
                excluir(val.ID);
            });
            // fim do botao excluir

            tdBotoes = $("<td />");

            tdBotoes.append(btnAlterar);
            tdBotoes.append(btnExcluir);

            //colunas da tabela
            if(val.nome == "Total")
            {
                tr.append($("<td style='color: red;' />").text(val.nome));
                tr.append($("<td style='color: red;' />").text("R$ " + val.valor));
            }
            else
            {
                tr.append($("<td />").text(val.nome));
                tr.append($("<td />").text("R$ " + val.valor));
            }

            tr.append(tdBotoes); 

            //adiciona a linha acima montada na tabela
            $("tbody").append(tr);
        });
    }); //ajax
        
};   

/////////////////////////////////////
excluir = function(id){ 
        if(confirm("Tem certeza que deseja excluir?")){
                $.ajax({
                    url: "http://localhost:3000/clientes/"+id,
                    type: 'DELETE'
                }).done(function(){
                    //chamar listarItem
                    listarClientes(tipoAtual);

                }); //done
        }
};
    
/////////////////////////////////////
cadastrar = function(form){
    $.post( "http://localhost:3000/clientes/", form.serialize() ).done(function(data){
        if (!data.erro) {
            form.each(function(data){
                    //limpar formulário
                    this.reset();
            });

            $("#modalInc").closeModal();
        }
        alert(data.mensagem);

        //chamar listarItem
        listarClientes(tipoAtual);
    });
};   


